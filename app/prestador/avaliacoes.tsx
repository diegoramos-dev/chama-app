import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, cap} from '@/theme';
import { currentProvider, flameColor, providers } from '@/data/mock';
import { BackHeader, Card, Notice, Row, Screen, SectionTitle, Stars } from '@/components/ui';
import { FlameBadge, ReviewItem } from '@/components/domain';

const NIVEIS = [
  { key: 'novato', min: 0, desc: 'Começando agora no app' },
  { key: 'bronze', min: 4.0, desc: 'Aparece nas buscas normalmente' },
  { key: 'prata', min: 4.3, desc: 'Sobe algumas posições na busca' },
  { key: 'ouro', min: 4.6, desc: 'Destaque nos resultados' },
  { key: 'chama', min: 4.8, desc: 'Topo da busca e borda em chama' },
];

/** Tela 50 — avaliações recebidas e nível da chama. */
export default function AvaliacoesPrestador() {
  const eu = providers.find((p) => p.name === currentProvider.name)!;
  const nivelAtual = [...NIVEIS].reverse().find((n) => eu.rating >= n.min)!;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Minhas avaliações" subtitle={`${eu.reviewCount} avaliações recebidas`} />
      <Screen scroll>
        <Card style={{ marginTop: spacing(4), alignItems: 'center' }}>
          <Text style={{ fontSize: 42, fontWeight: '700', color: colors.text }}>
            {eu.rating.toFixed(1).replace('.', ',')}
          </Text>
          <View style={{ marginTop: spacing(1) }}>
            <Stars value={eu.rating} size={19} />
          </View>
          <View style={{ marginTop: spacing(3) }}>
            <FlameBadge level={eu.flame} />
          </View>
        </Card>

        <SectionTitle>Como funciona o nível da chama</SectionTitle>
        <Card padded={false}>
          {NIVEIS.map((n, i) => {
            const atual = n.key === nivelAtual.key;
            return (
              <Row
                key={n.key}
                gap={3}
                style={{
                  padding: spacing(4),
                  borderBottomWidth: i < NIVEIS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                  backgroundColor: atual ? colors.brandWash : undefined,
                }}
              >
                <Ionicons name="flame" size={21} color={flameColor[n.key]} />
                <View style={{ flex: 1 }}>
                  <Row gap={2}>
                    <Text style={font.bodyStrong}>{cap(n.key)}</Text>
                    {atual && <Text style={[font.tiny, { color: colors.brand, fontWeight: '700' }]}>Você está aqui</Text>}
                  </Row>
                  <Text style={[font.small, { marginTop: 2 }]}>
                    nota {n.min.toFixed(1).replace('.', ',')}+ · {n.desc}
                  </Text>
                </View>
              </Row>
            );
          })}
        </Card>

        <View style={{ marginTop: spacing(5) }}>
          <Notice tone="success" icon="trending-up-outline">
            Serviço bem feito, pontualidade e boa comunicação são o que mais pesam na nota. Nota alta significa
            mais pedidos chegando.
          </Notice>
        </View>

        <SectionTitle>O que os clientes disseram</SectionTitle>
        {eu.reviews.map((r) => <ReviewItem key={r.id} review={r} />)}
      </Screen>
    </View>
  );
}
