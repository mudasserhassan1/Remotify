import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RemoteIcon} from './RemoteIcon';
import {useTv} from '../context/TvContext';
import {colors} from '../theme/colors';
import type {DiscoveredTv, TvDevice} from '../types/device';

interface DeviceSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function DeviceSheet({visible, onClose}: DeviceSheetProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'saved' | 'nearby'>('saved');
  const {
    devices,
    discoveredTvs,
    activeDevice,
    isDiscovering,
    isDiscoverySupported,
    connectionState,
    startDiscovery,
    stopDiscovery,
    connectToDevice,
    addDiscoveredDevice,
    deleteDevice,
  } = useTv();

  useEffect(() => {
    if (visible) {
      setTab(devices.length === 0 ? 'nearby' : 'saved');
    }
  }, [visible, devices.length]);

  const handleClose = () => {
    if (isDiscovering) {
      stopDiscovery();
    }
    onClose();
  };

  const handleSelectSaved = async (device: TvDevice) => {
    handleClose();
    await connectToDevice(device);
  };

  const handleAddNearby = async (tv: DiscoveredTv) => {
    const device = await addDiscoveredDevice(tv);
    handleClose();
    await connectToDevice(device);
  };

  const handleDelete = (device: TvDevice) => {
    Alert.alert('Remove TV', `Remove ${device.name}?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => deleteDevice(device.id),
      },
    ]);
  };

  const toggleScan = async () => {
    if (!isDiscoverySupported) {
      return;
    }
    if (isDiscovering) {
      stopDiscovery();
    } else {
      setTab('nearby');
      await startDiscovery();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}>
      <View style={styles.modalRoot}>
        <Pressable
          style={styles.backdrop}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close TV picker"
        />

        <View
          style={[
            styles.sheet,
            {paddingBottom: Math.max(insets.bottom, 16)},
          ]}>
          <View style={styles.sheetHeader}>
            <Text style={styles.title}>Your TVs</Text>
            <Pressable
              style={styles.closeBtn}
              onPress={handleClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close">
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.toolbar}>
            <View style={styles.tabs}>
              <TabChip
                label="Saved"
                active={tab === 'saved'}
                onPress={() => setTab('saved')}
              />
              <TabChip
                label="Nearby"
                active={tab === 'nearby'}
                onPress={() => {
                  setTab('nearby');
                  if (
                    isDiscoverySupported &&
                    !isDiscovering &&
                    discoveredTvs.length === 0
                  ) {
                    startDiscovery();
                  }
                }}
              />
            </View>

            <Pressable
              style={[
                styles.scanBtn,
                isDiscovering && styles.scanBtnActive,
                !isDiscoverySupported && styles.scanBtnDisabled,
              ]}
              onPress={toggleScan}
              disabled={!isDiscoverySupported}>
              <RemoteIcon
                name={isDiscovering ? 'stop' : 'search'}
                size={18}
                color="#fff"
              />
              <Text style={styles.scanText}>
                {isDiscovering ? 'Stop' : 'Scan'}
              </Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled">
            {tab === 'saved' ? (
              devices.length === 0 ? (
                <Text style={styles.empty}>
                  No TVs saved yet. Switch to Nearby and tap Scan.
                </Text>
              ) : (
                devices.map(device => (
                  <DeviceRow
                    key={device.id}
                    name={device.name}
                    subtitle={device.host}
                    isActive={activeDevice?.id === device.id}
                    isConnected={
                      activeDevice?.id === device.id &&
                      connectionState === 'connected'
                    }
                    onPress={() => handleSelectSaved(device)}
                    onLongPress={() => handleDelete(device)}
                  />
                ))
              )
            ) : !isDiscoverySupported ? (
              <Text style={styles.empty}>
                TV discovery requires an Android device on the same Wi‑Fi as your
                TV.
              </Text>
            ) : isDiscovering && discoveredTvs.length === 0 ? (
              <View style={styles.scanning}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.empty}>Searching for Android TVs…</Text>
              </View>
            ) : discoveredTvs.length === 0 ? (
              <Text style={styles.empty}>
                Tap Scan to discover TVs on the same network.
              </Text>
            ) : (
              discoveredTvs.map(tv => (
                <DeviceRow
                  key={`${tv.host}:${tv.port}`}
                  name={tv.name}
                  subtitle={`${tv.host}:${tv.port}`}
                  onPress={() => handleAddNearby(tv)}
                  trailing={
                    <RemoteIcon name="add" size={24} color={colors.primary} />
                  }
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function TabChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function DeviceRow({
  name,
  subtitle,
  isActive,
  isConnected,
  onPress,
  onLongPress,
  trailing,
}: {
  name: string;
  subtitle: string;
  isActive?: boolean;
  isConnected?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <Pressable
      style={[styles.row, isActive && styles.rowActive]}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View style={styles.rowIcon}>
        <RemoteIcon name="tv" size={22} color={colors.primary} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{name}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
        {isConnected ? (
          <Text style={styles.connected}>Connected</Text>
        ) : isActive ? (
          <Text style={styles.rowHint}>Tap to connect</Text>
        ) : null}
      </View>
      {trailing ?? (
        <RemoteIcon name="chevron-right" size={20} color={colors.iconMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    zIndex: 2,
    elevation: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 8,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanBtnActive: {
    backgroundColor: colors.danger,
  },
  scanBtnDisabled: {
    opacity: 0.4,
  },
  scanText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  list: {
    maxHeight: 360,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingVertical: 32,
    paddingHorizontal: 12,
  },
  scanning: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowActive: {
    borderColor: colors.primary,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowBody: {flex: 1},
  rowTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  rowSub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  rowHint: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },
  connected: {
    color: colors.success,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
});
