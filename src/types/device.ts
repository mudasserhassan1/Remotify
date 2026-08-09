export type DeviceType = 'android_tv';

export type ConnectionState =
  | 'disconnected'
  | 'discovering'
  | 'connecting'
  | 'pairing'
  | 'connected'
  | 'error';

export interface TvDevice {
  id: string;
  name: string;
  host: string;
  port: number;
  type: DeviceType;
  room?: string;
  pairedCert?: {
    key: string | null;
    cert: string | null;
  };
  lastConnectedAt?: string;
}

export interface DiscoveredTv {
  name: string;
  host: string;
  port: number;
}
