import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { BackHeader, BottomBar, Button, Field, Screen } from '@/components/ui';
import { Steps } from '@/components/Steps';

const LABELS = ['dados', 'documentos', 'foto', 'serviços'];

/** Tela 37 — cadastro do prestador, etapa 1: dados pessoais. */
export default function CadastroDados() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');

  const valido = nome.trim().length > 4 && cpf.length === 11 && email.includes('@') && cidade.trim().length > 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Quero trabalhar" subtitle="Seus dados" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Screen scroll>
          <Steps current={0} labels={LABELS} />

          <Text style={[font.h2, { marginTop: spacing(6), marginBottom: spacing(2) }]}>Vamos começar por você</Text>
          <Text style={[font.small, { marginBottom: spacing(6), lineHeight: 20 }]}>
            Esses dados são conferidos na análise e não aparecem para os clientes.
          </Text>

          <Field label="Nome completo" value={nome} onChangeText={setNome} placeholder="Como está no documento" autoCapitalize="words" />
          <Field label="CPF" value={cpf} onChangeText={(t) => setCpf(t.replace(/\D/g, '').slice(0, 11))} placeholder="000.000.000-00" keyboardType="numeric" />
          <Field label="Data de nascimento" value={nascimento} onChangeText={setNascimento} placeholder="DD/MM/AAAA" keyboardType="numeric" />
          <Field label="Celular" value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
          <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
          <Field label="Onde você atende" value={cidade} onChangeText={setCidade} placeholder="Bairro e cidade" hint="Você pode adicionar mais regiões depois" />
        </Screen>
      </KeyboardAvoidingView>

      <BottomBar>
        <Button label="Continuar" onPress={() => router.push('/prestador/cadastro/documentos')} disabled={!valido} />
      </BottomBar>
    </View>
  );
}
