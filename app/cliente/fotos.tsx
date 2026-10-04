import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { providers } from '@/data/mock';
import { BackHeader, PhotoBox, Screen, Row, EmptyState } from '@/components/ui';

/** Tela 13 — galeria de fotos dos trabalhos do prestador. */
export default function Fotos() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = providers.find((x) => x.id === id);

  // No mock as fotos são blocos de cor; com backend viram URLs de imagem.
  const galeria = p ? [...p.photos, ...p.photos, ...p.photos].slice(0, 9) : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Fotos dos trabalhos" subtitle={p?.name} />
      <Screen scroll>
        {galeria.length === 0 ? (
          <EmptyState icon="images-outline" title="Sem fotos ainda" body="Esse profissional ainda não publicou fotos dos trabalhos." />
        ) : (
          <View style={{ marginTop: spacing(4), gap: spacing(2.5) }}>
            {[0, 3, 6].map((start) => (
              <Row key={start} gap={2.5}>
                {galeria.slice(start, start + 3).map((c, i) => <PhotoBox key={start + i} color={c} />)}
              </Row>
            ))}
          </View>
        )}
        <Text style={[font.tiny, { textAlign: 'center', marginTop: spacing(5) }]}>
          fotos enviadas pelo profissional ao concluir cada serviço
        </Text>
      </Screen>
    </View>
  );
}
