import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { useApp } from '@/store/app';
import { BackHeader, BottomBar, Button, Field, Notice, Row, Screen } from '@/components/ui';

const bandeira = (numero: string) => {
  const n = numero.replace(/\D/g, '');
  if (n.startsWith('4')) return 'Visa';
  if (n.startsWith('5')) return 'Mastercard';
  if (n.startsWith('3')) return 'Amex';
  if (n.startsWith('6')) return 'Elo';
  return 'Cartão';
};

/** Tela 19 — adicionar cartão de crédito. */
export default function AdicionarCartao() {
  const { addCard } = useApp();
  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');

  const digitos = numero.replace(/\D/g, '');
  const valido = digitos.length >= 15 && nome.trim().length > 2 && validade.length === 5 && cvv.length >= 3;

  const salvar = () => {
    addCard(bandeira(numero), digitos.slice(-4), validade);
    router.back();
  };

  const formatarNumero = (t: string) =>
    setNumero(t.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '));

  const formatarValidade = (t: string) => {
    const n = t.replace(/\D/g, '').slice(0, 4);
    setValidade(n.length > 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Adicionar cartão" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Screen scroll>
          <View style={{ marginTop: spacing(5) }}>
            <Field
              label="Número do cartão" value={numero} onChangeText={formatarNumero}
              placeholder="0000 0000 0000 0000" keyboardType="numeric"
              hint={digitos.length >= 1 ? bandeira(numero) : undefined}
            />
            <Field
              label="Nome impresso no cartão" value={nome} onChangeText={setNome}
              placeholder="Como está no cartão" autoCapitalize="words"
            />
            <Row gap={3}>
              <View style={{ flex: 1 }}>
                <Field label="Validade" value={validade} onChangeText={formatarValidade} placeholder="MM/AA" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="CVV" value={cvv} onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))} placeholder="123" keyboardType="numeric" />
              </View>
            </Row>
          </View>

          <Notice tone="info" icon="shield-checkmark-outline">
            Versão mock: nenhum dado de cartão é enviado ou armazenado de verdade.
          </Notice>
        </Screen>
      </KeyboardAvoidingView>

      <BottomBar>
        <Button label="Salvar cartão" onPress={salvar} disabled={!valido} />
      </BottomBar>
    </View>
  );
}
