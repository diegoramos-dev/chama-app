import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing } from '@/theme';
import { useApp } from '@/store/app';
import { Button, Card, Header, Notice, Row, Screen } from '@/components/ui';
import { Timeline } from '@/components/domain';

const PASSOS = [
  { label: 'Cadastro enviado', detail: 'Recebemos seus dados e documentos' },
  { label: 'Verificação em andamento', detail: 'Conferindo documentos e antecedentes' },
  { label: 'Perfil aprovado', detail: 'Você começa a receber pedidos' },
];

/** Tela 41 — perfil em análise, até 48h. */
export default function Analise() {
  const { approveProvider } = useApp();

  const entrar = () => {
    approveProvider();
    router.replace('/prestador/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="Cadastro enviado" onBack={() => router.replace('/')} />
      <Screen scroll>
        <View style={{ alignItems: 'center', marginTop: spacing(7) }}>
          <View style={s.clock}>
            <Ionicons name="hourglass-outline" size={44} color={colors.brand} />
          </View>
          <Text style={[font.h2, { marginTop: spacing(4), textAlign: 'center' }]}>
            seu perfil está{'\n'}em análise
          </Text>
          <Text style={[font.body, { marginTop: spacing(3), textAlign: 'center', lineHeight: 22, color: colors.textMuted }]}>
            A gente confere seus documentos e a certidão de antecedentes em até 48 horas. Você recebe uma
            notificação assim que sair o resultado.
          </Text>
        </View>

        <Card style={{ marginTop: spacing(7) }}>
          <Timeline steps={PASSOS} currentIndex={1} />
        </Card>

        <View style={{ marginTop: spacing(5) }}>
          <Notice tone="info" icon="information-circle-outline">
            Se faltar algum documento, a gente te avisa por notificação e você reenvia direto pelo app.
          </Notice>
        </View>

        <Button
          label="Simular aprovação e entrar"
          icon="play-outline"
          style={{ marginTop: spacing(6) }}
          onPress={entrar}
        />
        <Button label="Voltar ao início" variant="ghost" onPress={() => router.replace('/')} />
      </Screen>
    </View>
  );
}

const s = StyleSheet.create({
  clock: {
    width: 92, height: 92, borderRadius: 46, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center',
  },
});
