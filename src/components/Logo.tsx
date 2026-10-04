import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

/** Pin do Chama: gota branca com a chama dentro. */
export function LogoMark({ size = 92, color = colors.bg, flame = colors.brand }: { size?: number; color?: string; flame?: string }) {
  return (
    <View style={{ width: size, height: size * 1.18, alignItems: 'center' }}>
      <Ionicons name="location" size={size * 1.18} color={color} style={{ position: 'absolute' }} />
      <View style={{ marginTop: size * 0.2 }}>
        <Ionicons name="flame" size={size * 0.42} color={flame} />
      </View>
    </View>
  );
}
