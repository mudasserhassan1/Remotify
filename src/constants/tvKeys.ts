import {RemoteKeyCode} from 'react-native-androidtv-remote';

export {RemoteKeyCode, RemoteDirection} from 'react-native-androidtv-remote';

export const TV_KEY_MAP = {
  up: RemoteKeyCode.KEYCODE_DPAD_UP,
  down: RemoteKeyCode.KEYCODE_DPAD_DOWN,
  left: RemoteKeyCode.KEYCODE_DPAD_LEFT,
  right: RemoteKeyCode.KEYCODE_DPAD_RIGHT,
  ok: RemoteKeyCode.KEYCODE_DPAD_CENTER,
  home: RemoteKeyCode.KEYCODE_HOME,
  back: RemoteKeyCode.KEYCODE_BACK,
  power: RemoteKeyCode.KEYCODE_POWER,
  volumeUp: RemoteKeyCode.KEYCODE_VOLUME_UP,
  volumeDown: RemoteKeyCode.KEYCODE_VOLUME_DOWN,
  channelUp: RemoteKeyCode.KEYCODE_CHANNEL_UP,
  channelDown: RemoteKeyCode.KEYCODE_CHANNEL_DOWN,
  mute: RemoteKeyCode.KEYCODE_MUTE,
} as const;
