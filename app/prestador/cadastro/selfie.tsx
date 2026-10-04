import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing } from '@/theme';
import { BackHeader, BottomBar, Button, Notice, Screen } from '@/components/ui';
import { Steps } from '@/components/Steps';

const LABELS = ['dados', 'documentos', 'foto', 'serviços'];

/** Tela 39 — etapa 3: selfie de verificação. */
export default function CadastroSelfie() {
  const [tirada, setTirada] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Quero trabalhar" subtitle="Sua foto" />
      <Screen scroll>
        <Steps current={2} labels={LABELS} />

        <Text style={[font.h2, { marginTop: spacing(6), marginBottom: spacing(2) }]}>Agora uma foto sua</Text>
        <Text style={[font.small, { marginBottom: spacing(6), lineHeight: 20 }]}>
          Ela vira a foto do seu perfil e também confirma que você é a pessoa do documento.
        </Text>

        <View style={s.frame}>
          {tirada ? (
            <>
              <Ionicons name="checkmark-circle" size={54} color={colors.success} />
              <Text style={[font.bodyStrong, { marginTop: spacing(3), color: colors.success }]}>Foto capturada</Text>
            </>
          ) : (
            <>
              <Ionicons name="person-outline" size={62} color={colors.brandLight} />
              <Text style={[font.small, { marginTop: spacing(3), textAlign: 'center' }]}>
                centralize o rosto{'\n'}dentro da moldura
              </Text>
            </>
          )}
        </View>

        <Button
          label={tirada ? 'tirar outra foto' : 'tirar foto'}
          variant={tirada ? 'secondary' : 'primary'}
          icon="camera-outline"
          style={{ marginTop: spacing(6) }}
          onPress={() => setTirada(!tirada)}
        />

        <View style={{ marginTop: spacing(5) }}>
          <Notice tone="info" icon="bulb-outline">
            Dicas: boa iluminação, sem óculos escuros e sem boné. Uma foto clara acelera a aprovação.
          </Notice>
        </View>
      </Screen>

      <BottomBar>
        <Button label="Continuar" onPress={() => router.push('/prestador/cadastro/servicos')} disabled={!tirada} />
      </BottomBar>
    </View>
  );
}

const s = StyleSheet.create({
  frame: {
    height: 250, borderRadius: 125, borderWidth: 2, borderStyle: 'dashed',
    borderColor: colors.brandLight, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center', marginHorizontal: spacing(8),
  },
});
