import React from 'react';
import { View, Text } from 'react-native';
import { colors, font, spacing } from '@/theme';

/** Indicador de etapa do cadastro do prestador (1 · 2 · 3 · 4). */
export function Steps({ current, total = 4, labels }: { current: number; total?: number; labels?: string[] }) {
  return (
    <View style={{ marginTop: spacing(4) }}>
      <View style={{ flexDirection: 'row', gap: spacing(1.5) }}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1, height: 4, borderRadius: 2,
              backgroundColor: i <= current ? colors.brand : colors.border,
            }}
          />
        ))}
      </View>
      <Text style={[font.tiny, { marginTop: spacing(2) }]}>
        Etapa {current + 1} de {total}{labels?.[current] ? ` · ${labels[current]}` : ''}
      </Text>
    </View>
  );
}
