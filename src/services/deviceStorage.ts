import AsyncStorage from '@react-native-async-storage/async-storage';
import type {TvDevice} from '../types/device';

const DEVICES_KEY = '@remotify/devices';
const ACTIVE_DEVICE_KEY = '@remotify/active_device_id';

export async function loadDevices(): Promise<TvDevice[]> {
  const raw = await AsyncStorage.getItem(DEVICES_KEY);
  if (!raw) {
    return [];
  }
  return JSON.parse(raw) as TvDevice[];
}

export async function saveDevices(devices: TvDevice[]): Promise<void> {
  await AsyncStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
}

export async function addDevice(device: TvDevice): Promise<TvDevice[]> {
  const devices = await loadDevices();
  const exists = devices.find(d => d.id === device.id);
  if (exists) {
    return devices;
  }
  const updated = [...devices, device];
  await saveDevices(updated);
  return updated;
}

export async function removeDevice(deviceId: string): Promise<TvDevice[]> {
  const updated = (await loadDevices()).filter(d => d.id !== deviceId);
  await saveDevices(updated);
  return updated;
}

export async function updateDevice(
  deviceId: string,
  patch: Partial<TvDevice>,
): Promise<TvDevice[]> {
  const updated = (await loadDevices()).map(d =>
    d.id === deviceId ? {...d, ...patch} : d,
  );
  await saveDevices(updated);
  return updated;
}

export async function getActiveDeviceId(): Promise<string | null> {
  return AsyncStorage.getItem(ACTIVE_DEVICE_KEY);
}

export async function setActiveDeviceId(deviceId: string): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_DEVICE_KEY, deviceId);
}
