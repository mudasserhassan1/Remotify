import React from 'react';
import {Pressable, StyleSheet, View, type ViewStyle} from 'react-native';
import {colors} from '../theme/colors';

interface CircleIconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  style?: ViewStyle;
  variant?: 'default' | 'danger';
}

export function CircleIconButton({
  icon,
  onPress,
  size = 48,
  style,
  variant = 'default',
}: CircleIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: pressed ? 0.7 : 1,
          borderColor:
            variant === 'danger' ? 'rgba(255, 69, 58, 0.35)' : colors.border,
        },
        style,
      ]}>
      <View style={styles.iconWrap}>{icon}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
