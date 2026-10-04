import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { providers } from '@/data/mock';
import { BackHeader, Screen, Row, Chip, Stars, EmptyState, Card } from '@/components/ui';
import { ReviewItem } from '@/components/domain';

/** Tela 14 — todas as avaliações de um prestador. */
export default function Avaliacoes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [filtro, setFiltro] = useState<number | null>(null);
  const p = providers.find((x) => x.id === id);

  if (!p) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Avaliações" />
        <EmptyState icon="star-outline" title="Profissional não encontrado" />
      </View>
    );
  }

  const lista = filtro ? p.reviews.filter((r) => r.stars === filtro) : p.reviews;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, qtd: p.reviews.filter((r) => r.stars === n).length }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Avaliações" subtitle={p.name} />
      <Screen scroll>
        <Card style={{ marginTop: spacing(4), alignItems: 'center' }}>
          <Text style={{ fontSize: 40, fontWeight: '700', color: colors.text }}>
            {p.rating.toFixed(1).replace('.', ',')}
          </Text>
          <View style={{ marginTop: spacing(1) }}>
            <Stars value={p.rating} size={18} />
          </View>
          <Text style={[font.small, { marginTop: spacing(2) }]}>{p.reviewCount} avaliações no total</Text>
        </Card>

        <Row gap={2} style={{ flexWrap: 'wrap', marginTop: spacing(5) }}>
          <Chip label="Todas" active={filtro === null} onPress={() => setFiltro(null)} />
          {dist.filter((d) => d.qtd > 0).map((d) => (
            <Chip key={d.n} label={`${d.n} estrelas (${d.qtd})`} active={filtro === d.n} onPress={() => setFiltro(d.n)} />
          ))}
        </Row>

        <View style={{ marginTop: spacing(5) }}>
          {lista.length === 0 ? (
            <EmptyState icon="star-outline" title="Nenhuma avaliação com essa nota" />
          ) : (
            lista.map((r) => <ReviewItem key={r.id} review={r} />)
          )}
        </View>
      </Screen>
    </View>
  );
}
