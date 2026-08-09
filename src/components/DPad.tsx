import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {RemoteKeyCode} from 'react-native-androidtv-remote';
import {RemoteIcon} from './RemoteIcon';
import {colors} from '../theme/colors';
import {useTv} from '../context/TvContext';

const OUTER = 280;
const OK_SIZE = 80;

export function DPad() {
  const {sendKey, connectionState} = useTv();
  const disabled = connectionState !== 'connected';

  const press = (key: keyof typeof RemoteKeyCode) => {
    if (disabled) {
      return;
    }
    const code = RemoteKeyCode[key];
    if (code !== undefined) {
      sendKey(code);
    }
  };

  return (
    <View style={[styles.outer, disabled && styles.disabled]}>
      <View style={styles.ring}>
        <Pressable
          style={({pressed}) => [styles.arrow, styles.arrowUp, pressed && styles.pressed]}
          onPress={() => press('KEYCODE_DPAD_UP')}
          disabled={disabled}>
          <RemoteIcon name="up" size={20} color={colors.icon} />
        </Pressable>
        <Pressable
          style={({pressed}) => [styles.arrow, styles.arrowDown, pressed && styles.pressed]}
          onPress={() => press('KEYCODE_DPAD_DOWN')}
          disabled={disabled}>
          <RemoteIcon name="down" size={20} color={colors.icon} />
        </Pressable>
        <Pressable
          style={({pressed}) => [styles.arrow, styles.arrowLeft, pressed && styles.pressed]}
          onPress={() => press('KEYCODE_DPAD_LEFT')}
          disabled={disabled}>
          <RemoteIcon name="left" size={20} color={colors.icon} />
        </Pressable>
        <Pressable
          style={({pressed}) => [styles.arrow, styles.arrowRight, pressed && styles.pressed]}
          onPress={() => press('KEYCODE_DPAD_RIGHT')}
          disabled={disabled}>
          <RemoteIcon name="right" size={20} color={colors.icon} />
        </Pressable>

        <Pressable
          style={({pressed}) => [styles.ok, pressed && styles.okPressed]}
          onPress={() => press('KEYCODE_DPAD_CENTER')}
          disabled={disabled}>
          <Text style={styles.okText}>OK</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: OUTER,
    height: OUTER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
  ring: {
    width: OUTER,
    height: OUTER,
    borderRadius: OUTER / 2,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ok: {
    width: OK_SIZE,
    height: OK_SIZE,
    borderRadius: OK_SIZE / 2,
    backgroundColor: colors.okBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okPressed: {
    opacity: 0.85,
    transform: [{scale: 0.96}],
  },
  okText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  arrow: {
    position: 'absolute',
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },
  pressed: {
    backgroundColor: colors.surfaceRing,
    opacity: 0.85,
  },
  arrowUp: {top: 14},
  arrowDown: {bottom: 14},
  arrowLeft: {left: 14},
  arrowRight: {right: 14},
});
