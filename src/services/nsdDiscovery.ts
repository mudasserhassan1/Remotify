import {NativeModules, NativeEventEmitter, Platform} from 'react-native';
import type {DiscoveredTv} from '../types/device';

const {NsdDiscovery} = NativeModules;

const isSupported = Platform.OS === 'android' && NsdDiscovery != null;

type DiscoveryEvent = {
  name: string;
  host: string;
  port: number;
  serviceType?: string;
};

class NsdDiscoveryService {
  readonly isSupported = isSupported;

  private emitter = isSupported
    ? new NativeEventEmitter(NsdDiscovery)
    : null;

  onServiceFound(callback: (device: DiscoveredTv) => void) {
    return this.emitter?.addListener('onServiceFound', (event: DiscoveryEvent) => {
      callback({
        name: event.name,
        host: event.host,
        port: event.port || 6466,
      });
    });
  }

  onServiceLost(callback: (name: string) => void) {
    return this.emitter?.addListener('onServiceLost', (event: {name: string}) => {
      callback(event.name);
    });
  }

  async startDiscovery(): Promise<boolean> {
    if (!isSupported) {
      return false;
    }
    return NsdDiscovery.startDiscovery();
  }

  async stopDiscovery(): Promise<boolean> {
    if (!isSupported) {
      return false;
    }
    return NsdDiscovery.stopDiscovery();
  }
}

export const nsdDiscovery = new NsdDiscoveryService();
