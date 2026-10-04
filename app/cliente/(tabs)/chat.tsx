import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, cap} from '@/theme';
import { chatMessages, providers } from '@/data/mock';
import { Avatar, EmptyState, Header, Row } from '@/components/ui';

/** Lista de conversas — aba nova que veio junto com a barra de 5 itens. */
export default function ListaDeConversas() {
  const conversas = Object.entries(chatMessages)
    .map(([providerId, msgs]) => {
      const p = providers.find((x) => x.id === providerId);
      const ultima = msgs[msgs.length - 1];
      return p && ultima ? { p, ultima, total: msgs.length } : null;
    })
    .filter(Boolean) as { p: (typeof providers)[number]; ultima: any; total: number }[];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="Conversas" subtitle={`${conversas.length} em andamento`} large />

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing(4.5), paddingBottom: spacing(8) }}>
        {conversas.length === 0 ? (
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="Nenhuma conversa ainda"
            body="Fale com um profissional antes de agendar para combinar valor e detalhes."
          />
        ) : (
          conversas.map(({ p, ultima }) => (
            <Pressable
              key={p.id}
              style={s.linha}
              onPress={() => router.push(`/cliente/chat/${p.id}`)}
            >
              <Avatar initials={p.initials} size={52} flame={p.flame} />
              <View style={{ flex: 1 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Row gap={1}>
                    <Text style={font.bodyStrong}>{p.name}</Text>
                    {p.verified && <Ionicons name="checkmark-circle" size={13} color={colors.info} />}
                  </Row>
                  <Text style={font.tiny}>{ultima.at}</Text>
                </Row>
                <Text style={[font.small, { marginTop: 3 }]} numberOfLines={1}>
                  {ultima.from === 'cliente' ? 'você: ' : ''}{ultima.text}
                </Text>
                <Text style={[font.tiny, { marginTop: 3, color: colors.brand, fontWeight: '600' }]}>
                  {cap(p.categoryName)}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  linha: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3.5),
    paddingVertical: spacing(3.5), borderBottomWidth: 1, borderBottomColor: colors.border,
  },
});
