import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {RemoteIcon} from './RemoteIcon';
import {colors} from '../theme/colors';

interface VolChPillProps {
  type: 'vol' | 'ch';
  onUp: () => void;
  onDown: () => void;
}

export function VolChPill({type, onUp, onDown}: VolChPillProps) {
  const label = type === 'vol' ? 'VOL' : 'CH';
  const upIcon = type === 'vol' ? 'plus' : 'up';
  const downIcon = type === 'vol' ? 'minus' : 'down';

  return (
    <View style={styles.pill}>
      <Pressable
        style={({pressed}) => [styles.segment, pressed && styles.pressed]}
        onPress={onUp}>
        <RemoteIcon name={upIcon} size={22} color={colors.icon} />
      </Pressable>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({pressed}) => [styles.segment, pressed && styles.pressed]}
        onPress={onDown}>
        <RemoteIcon name={downIcon} size={22} color={colors.icon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: 56,
    height: 148,
    borderRadius: 28,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  segment: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: colors.surfaceRing,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
