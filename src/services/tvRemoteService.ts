import {
  AndroidRemote,
  RemoteDirection,
} from 'react-native-androidtv-remote';
import type {TvDevice} from '../types/device';
import {SimpleEventEmitter} from '../utils/SimpleEventEmitter';

class TvRemoteService extends SimpleEventEmitter {
  private remote: AndroidRemote | null = null;
  private activeHost: string | null = null;

  async connect(device: TvDevice): Promise<void> {
    await this.disconnect();

    this.remote = new AndroidRemote(device.host, {
      pairing_port: 6467,
      remote_port: 6466,
      service_name: 'com.remotify',
      systeminfo: {
        manufacturer: 'Remotify',
        model: 'Android Remote',
      },
      cert: {
        key: device.pairedCert?.key ?? null,
        cert: device.pairedCert?.cert ?? null,
        androidKeyStore: 'AndroidKeyStore',
        certAlias: 'remotify-atv-cert',
        keyAlias: 'remotify-atv-key',
      },
    });

    this.remote.on('secret', () => this.emit('secret'));
    this.remote.on('ready', () => this.emit('ready'));
    this.remote.on('error', () => this.emit('error'));

    this.activeHost = device.host;
    await this.remote.start();
  }

  sendCode(code: string): void {
    this.remote?.sendPairingCode(code);
  }

  cancelPairing(): void {
    this.remote?.cancelPairing();
  }

  sendKey(keyCode: number, direction: string = RemoteDirection.SHORT): void {
    this.remote?.sendKey(keyCode, direction);
  }

  getCertificate(): {key: string | null; cert: string | null} | null {
    if (!this.remote) {
      return null;
    }
    return this.remote.getCertificate();
  }

  isConnected(): boolean {
    return this.remote !== null;
  }

  getActiveHost(): string | null {
    return this.activeHost;
  }

  async disconnect(): Promise<void> {
    if (this.remote) {
      this.remote.stop();
      this.remote.removeAllListeners();
      this.remote = null;
    }
    this.activeHost = null;
    this.emit('disconnected');
  }
}

export const tvRemoteService = new TvRemoteService();
