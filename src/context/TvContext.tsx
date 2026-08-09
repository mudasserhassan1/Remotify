import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {ConnectionState, DiscoveredTv, TvDevice} from '../types/device';
import {
  addDevice,
  getActiveDeviceId,
  loadDevices,
  removeDevice,
  setActiveDeviceId,
  updateDevice,
} from '../services/deviceStorage';
import {nsdDiscovery} from '../services/nsdDiscovery';
import {tvRemoteService} from '../services/tvRemoteService';

interface TvContextValue {
  devices: TvDevice[];
  activeDevice: TvDevice | null;
  discoveredTvs: DiscoveredTv[];
  connectionState: ConnectionState;
  pairingRequired: boolean;
  isDiscovering: boolean;
  isDiscoverySupported: boolean;
  refreshDevices: () => Promise<void>;
  startDiscovery: () => Promise<void>;
  stopDiscovery: () => Promise<void>;
  selectDevice: (deviceId: string) => Promise<void>;
  connectToDevice: (device: TvDevice) => Promise<void>;
  submitPairingCode: (code: string) => Promise<void>;
  cancelPairing: () => Promise<void>;
  addDiscoveredDevice: (tv: DiscoveredTv, name?: string) => Promise<TvDevice>;
  deleteDevice: (deviceId: string) => Promise<void>;
  sendKey: (keyCode: number) => void;
}

const TvContext = createContext<TvContextValue | null>(null);

export function TvProvider({children}: {children: React.ReactNode}) {
  const [devices, setDevices] = useState<TvDevice[]>([]);
  const [activeDevice, setActiveDevice] = useState<TvDevice | null>(null);
  const [discoveredTvs, setDiscoveredTvs] = useState<DiscoveredTv[]>([]);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('disconnected');
  const [pairingRequired, setPairingRequired] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const connectingDeviceRef = useRef<TvDevice | null>(null);

  const refreshDevices = useCallback(async () => {
    const loaded = await loadDevices();
    setDevices(loaded);
    const activeId = await getActiveDeviceId();
    const active = loaded.find(d => d.id === activeId) ?? loaded[0] ?? null;
    setActiveDevice(active);
  }, []);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  useEffect(() => {
    const onSecret = () => {
      setPairingRequired(true);
      setConnectionState('pairing');
    };
    const onReady = async () => {
      setPairingRequired(false);
      setConnectionState('connected');
      const cert = tvRemoteService.getCertificate();
      const device = connectingDeviceRef.current;
      if (device && cert?.cert && cert.key) {
        const updated = await updateDevice(device.id, {
          pairedCert: {key: cert.key, cert: cert.cert},
          lastConnectedAt: new Date().toISOString(),
        });
        setDevices(updated);
        setActiveDevice(updated.find(d => d.id === device.id) ?? null);
      }
    };
    const onError = () => setConnectionState('error');
    const onDisconnected = () => {
      setPairingRequired(false);
      setConnectionState('disconnected');
      connectingDeviceRef.current = null;
    };

    tvRemoteService.on('secret', onSecret);
    tvRemoteService.on('ready', onReady);
    tvRemoteService.on('error', onError);
    tvRemoteService.on('disconnected', onDisconnected);

    return () => {
      tvRemoteService.off('secret', onSecret);
      tvRemoteService.off('ready', onReady);
      tvRemoteService.off('error', onError);
      tvRemoteService.off('disconnected', onDisconnected);
    };
  }, []);

  useEffect(() => {
    const subFound = nsdDiscovery.onServiceFound(tv => {
      setDiscoveredTvs(prev => {
        const exists = prev.some(d => d.host === tv.host);
        return exists ? prev : [...prev, tv];
      });
    });
    return () => subFound?.remove();
  }, []);

  const startDiscovery = useCallback(async (): Promise<boolean> => {
    if (!nsdDiscovery.isSupported) {
      return false;
    }
    setIsDiscovering(true);
    setDiscoveredTvs([]);
    setConnectionState('discovering');
    try {
      return await nsdDiscovery.startDiscovery();
    } catch {
      setIsDiscovering(false);
      setConnectionState('disconnected');
      return false;
    }
  }, []);

  const stopDiscovery = useCallback(async () => {
    await nsdDiscovery.stopDiscovery();
    setIsDiscovering(false);
    if (connectionState === 'discovering') {
      setConnectionState('disconnected');
    }
  }, [connectionState]);

  const connectToDevice = useCallback(async (device: TvDevice) => {
    connectingDeviceRef.current = device;
    setConnectionState('connecting');
    setPairingRequired(false);
    setActiveDevice(device);
    await setActiveDeviceId(device.id);
    try {
      await tvRemoteService.connect(device);
    } catch {
      setConnectionState('error');
      connectingDeviceRef.current = null;
    }
  }, []);

  const selectDevice = useCallback(
    async (deviceId: string) => {
      const device = devices.find(d => d.id === deviceId);
      if (!device) {
        return;
      }
      await connectToDevice(device);
    },
    [connectToDevice, devices],
  );

  const submitPairingCode = useCallback(async (code: string) => {
    tvRemoteService.sendCode(code.trim());
  }, []);

  const cancelPairing = useCallback(async () => {
    setPairingRequired(false);
    tvRemoteService.cancelPairing();
    await tvRemoteService.disconnect();
    setConnectionState('disconnected');
    connectingDeviceRef.current = null;
  }, []);

  const addDiscoveredDevice = useCallback(
    async (tv: DiscoveredTv, name?: string): Promise<TvDevice> => {
      const device: TvDevice = {
        id: `${tv.host}-${tv.port}`,
        name: name ?? tv.name,
        host: tv.host,
        port: tv.port,
        type: 'android_tv',
      };
      const updated = await addDevice(device);
      setDevices(updated);
      setActiveDevice(device);
      await setActiveDeviceId(device.id);
      return device;
    },
    [],
  );

  const deleteDevice = useCallback(async (deviceId: string) => {
    const updated = await removeDevice(deviceId);
    setDevices(updated);
    if (activeDevice?.id === deviceId) {
      await tvRemoteService.disconnect();
      setActiveDevice(updated[0] ?? null);
      setConnectionState('disconnected');
      connectingDeviceRef.current = null;
    }
  }, [activeDevice]);

  const sendKey = useCallback((keyCode: number) => {
    tvRemoteService.sendKey(keyCode);
  }, []);

  const value = useMemo(
    () => ({
      devices,
      activeDevice,
      discoveredTvs,
      connectionState,
      pairingRequired,
      isDiscovering,
      isDiscoverySupported: nsdDiscovery.isSupported,
      refreshDevices,
      startDiscovery,
      stopDiscovery,
      selectDevice,
      connectToDevice,
      submitPairingCode,
      cancelPairing,
      addDiscoveredDevice,
      deleteDevice,
      sendKey,
    }),
    [
      devices,
      activeDevice,
      discoveredTvs,
      connectionState,
      pairingRequired,
      isDiscovering,
      refreshDevices,
      startDiscovery,
      stopDiscovery,
      selectDevice,
      connectToDevice,
      submitPairingCode,
      cancelPairing,
      addDiscoveredDevice,
      deleteDevice,
      sendKey,
    ],
  );

  return <TvContext.Provider value={value}>{children}</TvContext.Provider>;
}

export function useTv() {
  const ctx = useContext(TvContext);
  if (!ctx) {
    throw new Error('useTv must be used within TvProvider');
  }
  return ctx;
}
