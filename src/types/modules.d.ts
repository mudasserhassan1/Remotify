declare module 'react-native-vector-icons/MaterialIcons';

declare module 'react-native-androidtv-remote' {
  export class AndroidRemote {
    constructor(host: string, options: Record<string, unknown>);
    start(): Promise<boolean | undefined>;
    stop(): void;
    sendPairingCode(code: string): void;
    cancelPairing(): void;
    sendKey(key: number, direction?: string): void;
    getCertificate(): {key: string | null; cert: string | null};
    on(event: string, listener: (...args: unknown[]) => void): void;
    removeAllListeners(): void;
  }

  export const RemoteKeyCode: Record<string, number>;
  export const RemoteDirection: Record<string, string>;
}
