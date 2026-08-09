import React from 'react';
import {StyleSheet, Text, type TextStyle} from 'react-native';
import {colors} from '../theme/colors';

export type RemoteIconName =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'plus'
  | 'minus'
  | 'home'
  | 'back'
  | 'menu'
  | 'power'
  | 'tv'
  | 'chevron-down'
  | 'chevron-right'
  | 'search'
  | 'stop'
  | 'add'
  | 'error';

const GLYPHS: Record<RemoteIconName, string> = {
  up: '▲',
  down: '▼',
  left: '◀',
  right: '▶',
  plus: '+',
  minus: '−',
  home: '⌂',
  back: '←',
  menu: '☰',
  power: '⏻',
  tv: '▣',
  'chevron-down': '▾',
  'chevron-right': '›',
  search: '⌕',
  stop: '■',
  add: '+',
  error: '!',
};

interface RemoteIconProps {
  name: RemoteIconName;
  size?: number;
  color?: string;
  style?: TextStyle;
}

export function RemoteIcon({
  name,
  size = 22,
  color = colors.icon,
  style,
}: RemoteIconProps) {
  const glyph = GLYPHS[name];
  const fontSize =
    name === 'plus' || name === 'minus' || name === 'add'
      ? size + 4
      : name === 'menu'
        ? size - 2
        : size;

  return (
    <Text
      style={[
        styles.glyph,
        {
          fontSize,
          lineHeight: fontSize + 4,
          color,
        },
        style,
      ]}>
      {glyph}
    </Text>
  );
}

const styles = StyleSheet.create({
  glyph: {
    textAlign: 'center',
    includeFontPadding: false,
    fontWeight: '600',
  },
});
