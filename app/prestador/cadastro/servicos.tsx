import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, font, spacing, brl, cap} from '@/theme';
import { categories, COMMISSION_RATE } from '@/data/mock';
import { BackHeader, BottomBar, Button, Card, Chip, Field, Notice, Row, Screen, SectionTitle } from '@/components/ui';
import { Steps } from '@/components/Steps';

const LABELS = ['dados', 'documentos', 'foto', 'serviços'];

/** Tela 40 — etapa 4: o que você faz e quanto cobra. */
export default function CadastroServicos() {
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');

  const alternar = (id: string) =>
    setSelecionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const valorNum = Number(valor.replace(/\D/g, ''));
  const comissao = Math.round(valorNum * COMMISSION_RATE * 100) / 100;
  const valido = selecionadas.length > 0 && valorNum >= 20;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Quero trabalhar" subtitle="Seus serviços" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Screen scroll>
          <Steps current={3} labels={LABELS} />

          <Text style={[font.h2, { marginTop: spacing(6), marginBottom: spacing(2) }]}>O que você faz?</Text>
          <Text style={[font.small, { marginBottom: spacing(5), lineHeight: 20 }]}>
            Escolha uma ou mais categorias. Você aparece nas buscas de cada uma delas.
          </Text>

          <Row gap={2} style={{ flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <Chip key={c.id} label={cap(c.name)} active={selecionadas.includes(c.id)} onPress={() => alternar(c.id)} />
            ))}
          </Row>

          <SectionTitle>Quanto você cobra por diária?</SectionTitle>
          <Field
            value={valor}
            onChangeText={(t) => setValor(t.replace(/\D/g, '').slice(0, 5))}
            placeholder="350"
            keyboardType="numeric"
            hint="Você pode negociar valores diferentes no chat com cada cliente"
          />

          {valorNum >= 20 && (
            <Card style={{ backgroundColor: colors.surface, borderColor: colors.surface, marginBottom: spacing(4) }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text style={font.small}>Cliente paga</Text>
                <Text style={font.bodyStrong}>{brl(valorNum)}</Text>
              </Row>
              <Row style={{ justifyContent: 'space-between', marginTop: spacing(2) }}>
                <Text style={font.small}>comissão Chama ({(COMMISSION_RATE * 100).toFixed(0)}%)</Text>
                <Text style={font.small}>- {brl(comissao)}</Text>
              </Row>
              <Row style={{ justifyContent: 'space-between', marginTop: spacing(2) }}>
                <Text style={font.bodyStrong}>Você recebe</Text>
                <Text style={[font.h3, { color: colors.success }]}>{brl(valorNum - comissao)}</Text>
              </Row>
            </Card>
          )}

          <SectionTitle>Conte um pouco do seu trabalho</SectionTitle>
          <Field
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Experiência, o que você leva, quantas pessoas atende..."
            multiline
          />

          <Notice tone="success" icon="cash-outline">
            Sem mensalidade, sem taxa de cadastro e sem cobrança por orçamento. O Chama só ganha quando você ganha.
          </Notice>
        </Screen>
      </KeyboardAvoidingView>

      <BottomBar>
        <Button label="Enviar para análise" onPress={() => router.replace('/prestador/analise')} disabled={!valido} />
      </BottomBar>
    </View>
  );
}
