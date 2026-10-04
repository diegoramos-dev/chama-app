import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/theme';
import { BackHeader, BottomBar, Button, Notice, Row, Screen, SectionTitle } from '@/components/ui';
import { Steps } from '@/components/Steps';

const LABELS = ['dados', 'documentos', 'foto', 'serviços'];

type Doc = { key: string; titulo: string; descricao: string; icone: any };

const DOCS: Doc[] = [
  { key: 'identidade', titulo: 'RG ou CNH', descricao: 'Frente e verso, foto nítida', icone: 'card-outline' },
  { key: 'residencia', titulo: 'Comprovante de residência', descricao: 'Conta de luz, água ou telefone', icone: 'home-outline' },
  { key: 'antecedentes', titulo: 'Certidão de antecedentes criminais', descricao: 'Emitida nos últimos 90 dias', icone: 'shield-checkmark-outline' },
];

/** Tela 38 — etapa 2: documentos e antecedentes criminais. */
export default function CadastroDocumentos() {
  const [enviados, setEnviados] = useState<string[]>([]);

  const alternar = (k: string) =>
    setEnviados((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const completo = DOCS.every((d) => enviados.includes(d.key));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Quero trabalhar" subtitle="Documentos" />
      <Screen scroll>
        <Steps current={1} labels={LABELS} />

        <Text style={[font.h2, { marginTop: spacing(6), marginBottom: spacing(2) }]}>A parte da confiança</Text>
        <Text style={[font.small, { marginBottom: spacing(5), lineHeight: 20 }]}>
          Todo profissional do Chama passa por checagem de documentos. É isso que faz o cliente se sentir seguro
          em deixar você entrar na casa dele.
        </Text>

        <View style={{ gap: spacing(3) }}>
          {DOCS.map((d) => {
            const ok = enviados.includes(d.key);
            return (
              <Pressable key={d.key} onPress={() => alternar(d.key)} style={[s.doc, ok && s.docOk]}>
                <View style={[s.docIcon, ok && { backgroundColor: colors.successWash }]}>
                  <Ionicons name={ok ? 'checkmark' : d.icone} size={21} color={ok ? colors.success : colors.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={font.bodyStrong}>{d.titulo}</Text>
                  <Text style={[font.small, { marginTop: 2 }]}>{ok ? 'enviado' : d.descricao}</Text>
                </View>
                <Ionicons name={ok ? 'checkmark-circle' : 'cloud-upload-outline'} size={21} color={ok ? colors.success : colors.textFaint} />
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: spacing(5) }}>
          <Notice tone="info" icon="lock-closed-outline">
            Seus documentos são usados só para a verificação e ficam criptografados. Nenhum cliente tem acesso a eles.
          </Notice>
        </View>

        <Text style={[font.tiny, { marginTop: spacing(4), textAlign: 'center' }]}>
          mock: toque em cada item para simular o envio
        </Text>
      </Screen>

      <BottomBar>
        <Button label="Continuar" onPress={() => router.push('/prestador/cadastro/selfie')} disabled={!completo} />
      </BottomBar>
    </View>
  );
}

const s = StyleSheet.create({
  doc: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3),
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing(4),
  },
  docOk: { borderColor: colors.success, backgroundColor: colors.successWash },
  docIcon: {
    width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center',
  },
});
