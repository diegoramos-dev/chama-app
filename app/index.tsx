import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { Button } from '@/components/ui';
import { LogoMark } from '@/components/Logo';

/** Tela 1 — splash / boas-vindas. */
export default function Splash() {
  return (
    <SafeAreaView style={s.container}>
      <View style={s.center}>
        <LogoMark size={92} />
        <Text style={s.tagline}>Precisa de uma mãozinha?</Text>
        <Text style={s.brand}>Chama.</Text>
      </View>
      <View style={s.footer}>
        <Button
          label="Começar"
          variant="secondary"
          style={{ backgroundColor: colors.bg, borderWidth: 0 }}
          onPress={() => router.push('/escolher-perfil')}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brand },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tagline: { ...font.body, color: 'rgba(255,255,255,0.9)', marginTop: spacing(8) },
  brand: { fontSize: 46, fontWeight: '700', color: colors.onBrand, marginTop: spacing(1) },
  footer: { paddingHorizontal: spacing(6), paddingBottom: spacing(4) },
});
