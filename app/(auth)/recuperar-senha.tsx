import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { BackHeader, Button, Field, Screen, EmptyState } from '@/components/ui';

/** Tela 5 — recuperar senha. */
export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Recuperar senha" flat />
      <Screen scroll>
        {enviado ? (
          <EmptyState
            icon="mail-open-outline"
            title="Olha seu e-mail"
            body={`Mandamos um link de recuperação para ${email}. O link vale por 30 minutos.`}
            action={<Button label="Voltar para o login" onPress={() => router.replace('/login')} />}
          />
        ) : (
          <>
            <Text style={[font.body, { marginTop: spacing(6), marginBottom: spacing(6), lineHeight: 22 }]}>
              Digite o e-mail da sua conta que a gente manda um link pra você criar uma senha nova.
            </Text>
            <Field
              label="E-mail" value={email} onChangeText={setEmail}
              placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none"
            />
            <Button
              label="Enviar link"
              onPress={() => setEnviado(true)}
              disabled={!email.includes('@')}
              style={{ marginTop: spacing(2) }}
            />
          </>
        )}
      </Screen>
    </View>
  );
}
