import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RemoteKeyCode} from 'react-native-androidtv-remote';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AdBanner} from '../components/AdBanner';
import {CircleIconButton} from '../components/CircleIconButton';
import {DeviceSheet} from '../components/DeviceSheet';
import {DPad} from '../components/DPad';
import {PairingModal} from '../components/PairingModal';
import {RemoteIcon} from '../components/RemoteIcon';
import {VolChPill} from '../components/VolChPill';
import {useTv} from '../context/TvContext';
import {colors} from '../theme/colors';

export function HomeScreen() {
  const {
    activeDevice,
    connectionState,
    pairingRequired,
    connectToDevice,
    submitPairingCode,
    cancelPairing,
    sendKey,
  } = useTv();

  const [sheetOpen, setSheetOpen] = useState(false);
  const autoConnectAttemptedFor = useRef<string | null>(null);

  const openDeviceSheet = () => {
    setSheetOpen(false);
    requestAnimationFrame(() => setSheetOpen(true));
  };

  const closeDeviceSheet = () => {
    setSheetOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(openDeviceSheet, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!activeDevice || connectionState !== 'disconnected') {
      return;
    }
    if (autoConnectAttemptedFor.current === activeDevice.id) {
      return;
    }
    autoConnectAttemptedFor.current = activeDevice.id;
    connectToDevice(activeDevice);
  }, [activeDevice, connectionState, connectToDevice]);

  useEffect(() => {
    if (connectionState === 'error') {
      autoConnectAttemptedFor.current = null;
    }
  }, [connectionState]);

  const press = (key: keyof typeof RemoteKeyCode) => {
    if (connectionState !== 'connected') {
      return;
    }
    const code = RemoteKeyCode[key];
    if (code !== undefined) {
      sendKey(code);
    }
  };

  const deviceLabel = activeDevice?.name ?? 'Select TV';
  const isBusy =
    connectionState === 'connecting' ||
    connectionState === 'discovering' ||
    connectionState === 'pairing';

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.content}>
          <View style={styles.main}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.devicePill}
            onPress={openDeviceSheet}>
            <RemoteIcon name="tv" size={16} color={colors.primary} />
            <Text style={styles.deviceName} numberOfLines={1}>
              {deviceLabel}
            </Text>
            <RemoteIcon name="chevron-down" size={18} color={colors.icon} />
          </Pressable>
          <CircleIconButton
            variant="danger"
            icon={
              <RemoteIcon name="power" size={22} color={colors.danger} />
            }
            onPress={() => press('KEYCODE_POWER')}
          />
        </View>

        {isBusy && (
          <View style={styles.statusBar}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.statusText}>
              {connectionState === 'pairing'
                ? 'Waiting for pairing code on TV…'
                : connectionState === 'connecting'
                  ? 'Connecting…'
                  : 'Searching…'}
            </Text>
          </View>
        )}

        {connectionState === 'error' && (
          <Pressable style={styles.errorBar} onPress={openDeviceSheet}>
            <RemoteIcon name="error" size={16} color={colors.danger} />
            <Text style={styles.errorText}>Connection failed — tap to retry</Text>
          </Pressable>
        )}

        {/* D-Pad */}
        <View style={styles.dpadSection}>
          <DPad />
        </View>

        {/* Volume / Home-Back / Channel */}
        <View style={styles.controlsRow}>
          <VolChPill
            type="vol"
            onUp={() => press('KEYCODE_VOLUME_UP')}
            onDown={() => press('KEYCODE_VOLUME_DOWN')}
          />

          <View style={styles.navColumn}>
            <CircleIconButton
              size={56}
              icon={<RemoteIcon name="home" size={24} color={colors.icon} />}
              onPress={() => press('KEYCODE_HOME')}
            />
            <CircleIconButton
              size={56}
              icon={<RemoteIcon name="back" size={24} color={colors.icon} />}
              onPress={() => press('KEYCODE_BACK')}
            />
          </View>

          <VolChPill
            type="ch"
            onUp={() => press('KEYCODE_CHANNEL_UP')}
            onDown={() => press('KEYCODE_CHANNEL_DOWN')}
          />
        </View>

        <View style={styles.spacer} />

        {/* Sheet grab handle hint */}
        <Pressable style={styles.sheetHint} onPress={openDeviceSheet}>
          <View style={styles.grabber} />
          <Text style={styles.sheetHintText}>Tap to find TVs</Text>
        </Pressable>
        </View>

          <AdBanner />
        </View>
      </SafeAreaView>

      <DeviceSheet visible={sheetOpen} onClose={closeDeviceSheet} />

      <PairingModal
        visible={pairingRequired}
        onSubmit={submitPairingCode}
        onClose={cancelPairing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
    paddingBottom: 12,
  },
  devicePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deviceName: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  errorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
    paddingVertical: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  dpadSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  navColumn: {
    alignItems: 'center',
    gap: 16,
  },
  spacer: {
    flex: 0.15,
    minHeight: 8,
  },
  sheetHint: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  sheetHintText: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 6,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.grabHandle,
  },
});
