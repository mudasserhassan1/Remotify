package com.remotify.tvremote

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.net.wifi.WifiManager
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class NsdModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "NsdDiscovery"
    private const val TAG = "NsdDiscovery"
    private const val SERVICE_TYPE = "_androidtvremote2._tcp."
  }

  private var nsdManager: NsdManager? = null
  private var multicastLock: WifiManager.MulticastLock? = null
  private var discoveryListener: NsdManager.DiscoveryListener? = null
  private val resolving = mutableSetOf<String>()

  override fun getName(): String = NAME

  @ReactMethod
  fun startDiscovery(promise: Promise) {
    try {
      stopDiscoveryInternal()
      acquireMulticastLock()
      nsdManager = reactContext.getSystemService(Context.NSD_SERVICE) as NsdManager

      discoveryListener = object : NsdManager.DiscoveryListener {
        override fun onDiscoveryStarted(serviceType: String) {
          Log.d(TAG, "Discovery started: $serviceType")
        }

        override fun onServiceFound(serviceInfo: NsdServiceInfo) {
          if (serviceInfo.serviceType != SERVICE_TYPE) {
            return
          }
          val key = "${serviceInfo.serviceName}:${serviceInfo.host?.hostAddress ?: "pending"}"
          if (resolving.contains(key)) {
            return
          }
          resolving.add(key)
          nsdManager?.resolveService(serviceInfo, createResolveListener(serviceInfo))
        }

        override fun onServiceLost(serviceInfo: NsdServiceInfo) {
          sendEvent("onServiceLost", mapOf("name" to serviceInfo.serviceName))
        }

        override fun onDiscoveryStopped(serviceType: String) {
          Log.d(TAG, "Discovery stopped")
        }

        override fun onStartDiscoveryFailed(serviceType: String, errorCode: Int) {
          Log.e(TAG, "Start discovery failed: $errorCode")
        }

        override fun onStopDiscoveryFailed(serviceType: String, errorCode: Int) {
          Log.w(TAG, "Stop discovery failed: $errorCode")
        }
      }

      nsdManager?.discoverServices(SERVICE_TYPE, NsdManager.PROTOCOL_DNS_SD, discoveryListener)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("DISCOVERY_ERROR", e.message, e)
    }
  }

  @ReactMethod
  fun stopDiscovery(promise: Promise) {
    try {
      stopDiscoveryInternal()
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("STOP_ERROR", e.message, e)
    }
  }

  private fun createResolveListener(original: NsdServiceInfo): NsdManager.ResolveListener {
    return object : NsdManager.ResolveListener {
      override fun onResolveFailed(serviceInfo: NsdServiceInfo, errorCode: Int) {
        resolving.remove("${serviceInfo.serviceName}:${serviceInfo.host?.hostAddress}")
        Log.w(TAG, "Resolve failed for ${serviceInfo.serviceName}: $errorCode")
      }

      override fun onServiceResolved(serviceInfo: NsdServiceInfo) {
        resolving.remove("${serviceInfo.serviceName}:${serviceInfo.host?.hostAddress}")
        val host = serviceInfo.host?.hostAddress ?: return
        val payload = Arguments.createMap().apply {
          putString("name", serviceInfo.serviceName.replace("-", " "))
          putString("host", host)
          putInt("port", serviceInfo.port)
          putString("serviceType", serviceInfo.serviceType)
        }
        sendEvent("onServiceFound", payload)
      }
    }
  }

  private fun stopDiscoveryInternal() {
    try {
      discoveryListener?.let { nsdManager?.stopServiceDiscovery(it) }
    } catch (_: Exception) {
    }
    discoveryListener = null
    releaseMulticastLock()
    resolving.clear()
  }

  private fun acquireMulticastLock() {
    val wifi = reactContext.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
    multicastLock = wifi.createMulticastLock("remotify-nsd").apply {
      setReferenceCounted(true)
      acquire()
    }
  }

  private fun releaseMulticastLock() {
    multicastLock?.let {
      if (it.isHeld) {
        it.release()
      }
    }
    multicastLock = null
  }

  private fun sendEvent(eventName: String, params: WritableMap) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  private fun sendEvent(eventName: String, params: Map<String, String>) {
    val map = Arguments.createMap()
    params.forEach { (k, v) -> map.putString(k, v) }
    sendEvent(eventName, map)
  }
}
