import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing } from '@/theme';
import { BackHeader, Button, Field, Screen, Row, Notice } from '@/components/ui';

/** Tela 4 — cadastro do cliente. */
export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [aceite, setAceite] = useState(false);

  const valido = nome.trim().length > 2 && email.includes('@') && senha.length >= 6 && aceite;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Criar conta" flat />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Screen scroll>
          <Text style={[font.h2, { marginTop: spacing(6), marginBottom: spacing(6) }]}>
            bora começar
          </Text>

          <Field label="Nome completo" value={nome} onChangeText={setNome} placeholder="Como te chamam" autoCapitalize="words" />
          <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
          <Field label="Celular" value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
          <Field label="Senha" value={senha} onChangeText={setSenha} placeholder="Mínimo 6 caracteres" secureTextEntry hint="Use letras e números" />

          <Pressable onPress={() => setAceite(!aceite)}>
            <Row gap={2.5} style={{ marginTop: spacing(2) }}>
              <Ionicons
                name={aceite ? 'checkbox' : 'square-outline'}
                size={22}
                color={aceite ? colors.brand : colors.textFaint}
              />
              <Text style={[font.small, { flex: 1, lineHeight: 19 }]}>
                li e aceito os termos de uso e a política de privacidade
              </Text>
            </Row>
          </Pressable>

          <Button
            label="Criar conta"
            onPress={() => router.replace('/cliente/(tabs)')}
            disabled={!valido}
            style={{ marginTop: spacing(6) }}
          />

          <View style={{ marginTop: spacing(5) }}>
            <Notice tone="info" icon="lock-closed-outline">
              Seus dados de pagamento ficam guardados de forma criptografada e o valor só é cobrado quando o serviço termina.
            </Notice>
          </View>
        </Screen>
      </KeyboardAvoidingView>
    </View>
  );
}
