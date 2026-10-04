import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/theme';
import { BackHeader, Chip, Notice, Row } from '@/components/ui';

type Msg = { id: string; de: 'voce' | 'suporte'; texto: string; hora: string };

const ATALHOS = [
  'Quero cancelar um pedido',
  'O profissional não apareceu',
  'Como funciona o pagamento?',
  'Quero falar sobre uma disputa',
];

/** Respostas do mock — o suporte "responde" conforme a palavra-chave. */
const responder = (texto: string): string => {
  const t = texto.toLowerCase();
  if (t.includes('cancel'))
    return 'Consigo te ajudar. Cancelamentos com mais de 24h de antecedência são gratuitos; abaixo disso há uma taxa de 20% para compensar o profissional. Qual é o número do pedido?';
  if (t.includes('não apareceu') || t.includes('nao apareceu'))
    return 'Sinto muito por isso. Nesse caso você não paga nada: a pré-autorização é liberada em até 7 dias úteis. Vou registrar a ocorrência — me passa o número do pedido, por favor.';
  if (t.includes('pagamento') || t.includes('pagar'))
    return 'O valor é pré-autorizado no agendamento mas só é cobrado quando o serviço termina e você confirma a conclusão. Até lá ele fica retido, e nem você nem o profissional têm acesso.';
  if (t.includes('disputa'))
    return 'Disputas são analisadas em até 24h e o valor fica retido durante todo o processo. Me conta o que aconteceu que eu já encaminho para o time responsável.';
  return 'Entendi. Já encaminhei para o time e a gente te responde por aqui em até 24h. Se for urgente, dá pra ligar no 0800 123 4567.';
};

/** Chat com o suporte do Chama. */
export default function Suporte() {
  const { assunto } = useLocalSearchParams<{ assunto?: string }>();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 'm1', de: 'suporte', hora: 'agora',
      texto: assunto
        ? `Oi! Vi que é sobre o pedido #${assunto}. Me conta o que aconteceu que eu te ajudo.`
        : 'Oi! Aqui é o suporte do Chama. Como posso te ajudar hoje?',
    },
  ]);
  const [texto, setTexto] = useState('');

  const enviar = (conteudo?: string) => {
    const corpo = (conteudo ?? texto).trim();
    if (!corpo) return;
    setMsgs((m) => [...m, { id: `u${m.length}`, de: 'voce', texto: corpo, hora: 'agora' }]);
    setTexto('');
    setTimeout(() => {
      setMsgs((m) => [...m, { id: `s${m.length}`, de: 'suporte', texto: responder(corpo), hora: 'agora' }]);
    }, 800);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <BackHeader title="Suporte Chama" subtitle="Seg a sáb, 8h às 20h" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView contentContainerStyle={{ padding: spacing(4.5), gap: spacing(2) }}>
          <View style={{ marginBottom: spacing(2) }}>
            <Notice tone="info" icon="chatbubble-ellipses-outline">
              Versão mock: o suporte responde automaticamente conforme o assunto da mensagem.
            </Notice>
          </View>

          {msgs.map((m) => (
            <View key={m.id} style={[s.bolha, m.de === 'voce' ? s.minha : s.dele]}>
              <Text style={[font.body, m.de === 'voce' && { color: colors.onBrand }]}>{m.texto}</Text>
              <Text style={[font.tiny, s.hora, m.de === 'voce' && { color: 'rgba(255,255,255,0.7)' }]}>
                {m.hora}
              </Text>
            </View>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ paddingHorizontal: spacing(4.5), gap: spacing(2), paddingBottom: spacing(2) }}
        >
          {ATALHOS.map((a) => <Chip key={a} label={a} tone="brand" onPress={() => enviar(a)} />)}
        </ScrollView>

        <View style={s.composer}>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            placeholder="Escreva sua mensagem..."
            placeholderTextColor={colors.textFaint}
            style={s.input}
            multiline
          />
          <Pressable onPress={() => enviar()} style={[s.send, !texto.trim() && { opacity: 0.4 }]}>
            <Ionicons name="send" size={18} color={colors.onBrand} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  bolha: { maxWidth: '84%', padding: spacing(3.5), borderRadius: radius.card },
  minha: { alignSelf: 'flex-end', backgroundColor: colors.brand, borderBottomRightRadius: 6 },
  dele: {
    alignSelf: 'flex-start', backgroundColor: colors.bg, borderBottomLeftRadius: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  hora: { marginTop: 4, alignSelf: 'flex-end' },
  composer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing(2.5),
    padding: spacing(4.5), paddingTop: spacing(2), backgroundColor: colors.bg,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  input: {
    flex: 1, minHeight: 48, maxHeight: 110, backgroundColor: colors.surface,
    borderRadius: radius.lg, paddingHorizontal: spacing(4), paddingTop: spacing(3.5),
    paddingBottom: spacing(3), fontSize: 15, color: colors.text,
  },
  send: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
});
