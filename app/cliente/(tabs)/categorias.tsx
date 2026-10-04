import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, cap} from '@/theme';
import { categories, providers } from '@/data/mock';
import { EmptyState, Header, Row } from '@/components/ui';
import { CategoryGridItem } from '@/components/blocks';

const PAD = spacing(4.5);

/** Tela 7 — todas as categorias de microserviço, agora em grade. */
export default function Categorias() {
  const [busca, setBusca] = useState('');
  const lista = categories.filter((c) =>
    (c.name + ' ' + c.tagline).toLowerCase().includes(busca.toLowerCase().trim()),
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="Categorias" subtitle={`${categories.length} tipos de serviço`} large />

      <View style={{ paddingHorizontal: PAD }}>
        <Row gap={2.5} style={s.busca}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Filtrar categoria..."
            placeholderTextColor={colors.textFaint}
            style={{ flex: 1, fontSize: 14, color: colors.text }}
          />
        </Row>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: PAD, paddingTop: spacing(5), paddingBottom: spacing(8) }}
        showsVerticalScrollIndicator={false}
      >
        {lista.length === 0 ? (
          <EmptyState icon="search-outline" title="Nada com esse nome" body="Tenta outra palavra — ou busca direto pelo serviço." />
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2.5) }}>
            {lista.map((c) => {
              const qtd = providers.filter((p) => p.categoryId === c.id).length;
              return (
                <View key={c.id} style={{ width: '31%' }}>
                  <CategoryGridItem
                    id={c.id}
                    nome={cap(c.name)}
                    largura="100%"
                    onPress={() => router.push(`/cliente/resultados?categoria=${c.id}`)}
                  />
                  <Text style={[font.tiny, { textAlign: 'center', marginTop: spacing(1.5) }]}>
                    {qtd > 0 ? `${qtd} por perto` : 'ninguém ainda'}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  busca: {
    height: 52, borderRadius: radius.lg, backgroundColor: colors.surface,
    paddingHorizontal: spacing(4),
  },
});
