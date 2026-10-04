import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { BackHeader, Button, Field, Screen, Divider, Row } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { currentUser } from '@/data/mock';

/** Tela 3 — login. Mock: qualquer e-mail/senha entra. */
export default function Login() {
  const { perfil } = useLocalSearchParams<{ perfil?: string }>();
  const [email, setEmail] = useState(currentUser.email);
  const [senha, setSenha] = useState('123456');
  const [loading, setLoading] = useState(false);

  const entrar = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace(perfil === 'prestador' ? '/prestador/(tabs)' : '/cliente/(tabs)');
    }, 500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Entrar" flat />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Screen scroll>
          <Text style={[font.h2, { marginTop: spacing(6), marginBottom: spacing(6) }]}>
            que bom te ver de novo
          </Text>

          <Field
            label="E-mail" value={email} onChangeText={setEmail}
            placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none"
          />
          <Field
            label="Senha" value={senha} onChangeText={setSenha}
            placeholder="Sua senha" secureTextEntry
          />

          <Pressable onPress={() => router.push('/recuperar-senha')} style={{ alignSelf: 'flex-end' }}>
            <Text style={[font.small, { color: colors.brand, fontWeight: '600' }]}>Esqueci minha senha</Text>
          </Pressable>

          <Button label="Entrar" onPress={entrar} loading={loading} style={{ marginTop: spacing(6) }} />

          <Divider />

          <Button label="Continuar com Google" variant="secondary" icon="logo-google" onPress={entrar} />

          <Row gap={1} style={{ justifyContent: 'center', marginTop: spacing(8) }}>
            <Text style={font.small}>Não tem conta?</Text>
            <Pressable onPress={() => router.push('/cadastro')}>
              <Text style={[font.small, { color: colors.brand, fontWeight: '700' }]}>Cadastre-se</Text>
            </Pressable>
          </Row>

          <Row gap={2} style={{ justifyContent: 'center', marginTop: spacing(6), opacity: 0.7 }}>
            <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
            <Text style={font.tiny}>Versão mock — qualquer e-mail e senha entram</Text>
          </Row>
        </Screen>
      </KeyboardAvoidingView>
    </View>
  );
}
