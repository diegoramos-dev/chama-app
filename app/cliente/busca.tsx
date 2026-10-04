import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, font, radius, spacing, cap} from '@/theme';
import { categories, providers } from '@/data/mock';
import { Screen, Row, Chip } from '@/components/ui';

const RECENTES = ['Churrasqueiro', 'Dog walker', 'Diarista'];

/** Tela 8 — busca por texto, com sugestões enquanto digita. */
export default function Busca() {
  const [termo, setTermo] = useState('');
  const q = termo.toLowerCase().trim();

  const catsSugeridas = q ? categories.filter((c) => c.name.includes(q) || c.tagline.includes(q)) : [];
  const profsSugeridos = q ? providers.filter((p) => p.name.toLowerCase().includes(q)) : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }}>
        <Row gap={3} style={s.searchBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={s.voltar}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <View style={s.inputWrap}>
            <Ionicons name="search" size={18} color={colors.textFaint} />
            <TextInput
              value={termo}
              onChangeText={setTermo}
              placeholder="Buscar serviço..."
              placeholderTextColor={colors.textFaint}
              autoFocus
              style={{ flex: 1, fontSize: 15, color: colors.text }}
            />
          </View>
        </Row>
      </SafeAreaView>

      <Screen scroll>
        {!q ? (
          <>
            <Text style={[font.h3, { marginTop: spacing(5), marginBottom: spacing(3) }]}>Buscas recentes</Text>
            <Row gap={2} style={{ flexWrap: 'wrap' }}>
              {RECENTES.map((r) => <Chip key={r} label={r} icon="time-outline" onPress={() => setTermo(r)} />)}
            </Row>

            <Text style={[font.h3, { marginTop: spacing(7), marginBottom: spacing(3) }]}>Mais buscados no Chama</Text>
            <Row gap={2} style={{ flexWrap: 'wrap' }}>
              {categories.slice(0, 8).map((c) => (
                <Chip key={c.id} label={cap(c.name)} tone="brand" onPress={() => router.push(`/cliente/resultados?categoria=${c.id}`)} />
              ))}
            </Row>
          </>
        ) : (
          <View style={{ marginTop: spacing(4) }}>
            {catsSugeridas.map((c) => (
              <Pressable key={c.id} style={s.suggestion} onPress={() => router.push(`/cliente/resultados?categoria=${c.id}`)}>
                <Ionicons name={c.icon as any} size={19} color={colors.brand} />
                <View style={{ flex: 1 }}>
                  <Text style={font.bodyStrong}>{cap(c.name)}</Text>
                  <Text style={font.small}>{cap(c.tagline)}</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={colors.textFaint} />
              </Pressable>
            ))}
            {profsSugeridos.map((p) => (
              <Pressable key={p.id} style={s.suggestion} onPress={() => router.push(`/cliente/prestador/${p.id}`)}>
                <Ionicons name="person-outline" size={19} color={colors.textMuted} />
                <View style={{ flex: 1 }}>
                  <Text style={font.bodyStrong}>{p.name}</Text>
                  <Text style={font.small}>{cap(p.categoryName)}</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={colors.textFaint} />
              </Pressable>
            ))}
            {catsSugeridas.length === 0 && profsSugeridos.length === 0 && (
              <Text style={[font.small, { marginTop: spacing(6), textAlign: 'center' }]}>
                nada encontrado para "{termo}"
              </Text>
            )}
          </View>
        )}
      </Screen>
    </View>
  );
}

const s = StyleSheet.create({
  searchBar: { paddingHorizontal: spacing(4), paddingTop: spacing(2), paddingBottom: spacing(4) },
  voltar: {
    width: 42, height: 42, borderRadius: radius.round, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing(2.5),
    backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing(4), height: 50,
  },
  suggestion: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3),
    paddingVertical: spacing(3.5), borderBottomWidth: 1, borderBottomColor: colors.border,
  },
});
