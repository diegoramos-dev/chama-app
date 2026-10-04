import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, brlShort } from '@/theme';
import { chatMessages, providers } from '@/data/mock';
import { useApp } from '@/store/app';
import { Avatar, BackHeader, EmptyState, Row, Notice } from '@/components/ui';
import type { ChatMessage } from '@/data/types';

/** Tela 15 — chat para combinar valor e detalhes antes de agendar. */
export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setDraft } = useApp();
  const p = providers.find((x) => x.id === id);
  const [msgs, setMsgs] = useState<ChatMessage[]>(chatMessages[id ?? ''] ?? []);
  const [texto, setTexto] = useState('');

  if (!p) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Conversa" />
        <EmptyState icon="chatbubble-outline" title="Conversa não encontrada" />
      </View>
    );
  }

  const enviar = () => {
    if (!texto.trim()) return;
    const minha: ChatMessage = { id: `c${Date.now()}`, from: 'cliente', text: texto.trim(), at: 'agora' };
    setMsgs((m) => [...m, minha]);
    setTexto('');
    // Mock: o prestador responde sozinho depois de um instante.
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: `c${Date.now()}r`, from: 'prestador', text: 'Fechado! Pode agendar pelo app que eu confirmo por aqui.', at: 'agora' },
      ]);
    }, 900);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <BackHeader
        title={p.name}
        subtitle={`${p.categoryName} · ${p.responseTime}`}
        right={<Avatar initials={p.initials} size={38} flame={p.flame} />}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView contentContainerStyle={{ padding: spacing(4), gap: spacing(2) }}>
          <View style={{ marginBottom: spacing(2) }}>
            <Notice tone="info" icon="information-circle-outline">
              Combine aqui os detalhes e o valor. O pagamento só acontece pelo app, com o valor retido até o serviço terminar.
            </Notice>
          </View>

          {msgs.map((m) => (
            <View key={m.id} style={[s.bubble, m.from === 'cliente' ? s.mine : s.theirs]}>
              <Text style={[font.body, m.from === 'cliente' && { color: colors.onBrand }]}>{m.text}</Text>
              <Text style={[font.tiny, s.time, m.from === 'cliente' && { color: 'rgba(255,255,255,0.7)' }]}>{m.at}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={s.quickBar}>
          <Pressable
            style={s.quickBtn}
            onPress={() => {
              setDraft({ providerId: p.id });
              router.push(`/cliente/agendar/${p.id}`);
            }}
          >
            <Ionicons name="calendar-outline" size={16} color={colors.brand} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brand }}>
              agendar por {brlShort(p.dailyRate)}
            </Text>
          </Pressable>
        </View>

        <View style={s.composer}>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            placeholder="Escreva uma mensagem..."
            placeholderTextColor={colors.textFaint}
            style={s.input}
            multiline
          />
          <Pressable onPress={enviar} style={[s.send, !texto.trim() && { opacity: 0.4 }]}>
            <Ionicons name="send" size={18} color={colors.onBrand} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  bubble: { maxWidth: '82%', padding: spacing(3), borderRadius: radius.lg },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.brand, borderBottomRightRadius: 4 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.bg, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
  time: { marginTop: 4, alignSelf: 'flex-end' },
  quickBar: { paddingHorizontal: spacing(4), paddingBottom: spacing(2) },
  quickBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing(2),
    backgroundColor: colors.brandWash, borderRadius: radius.pill, paddingVertical: spacing(3),
  },
  composer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing(2.5),
    padding: spacing(4), paddingTop: spacing(2), backgroundColor: colors.bg,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  input: {
    flex: 1, minHeight: 46, maxHeight: 110, backgroundColor: colors.surface,
    borderRadius: radius.lg, paddingHorizontal: spacing(4), paddingTop: spacing(3.5),
    paddingBottom: spacing(3), fontSize: 15, color: colors.text,
  },
  send: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
});
