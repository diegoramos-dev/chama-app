import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, font, radius, spacing } from '@/theme';
import { Card, Row } from '@/components/ui';

/** Tela 2 — os "dois steps" do app: quem contrata e quem trabalha. */
export default function EscolherPerfil() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: spacing(5), justifyContent: 'center' }}>
        <Text style={font.h1}>como você vai usar{'\n'}o Chama?</Text>
        <Text style={[font.small, { marginTop: spacing(3), lineHeight: 20 }]}>
          Dá pra trocar de perfil depois, dentro do app.
        </Text>

        <Card onPress={() => router.push('/login?perfil=cliente')} style={{ marginTop: spacing(8) }}>
          <Row gap={4}>
            <View style={[s.icon, { backgroundColor: colors.brandWash }]}>
              <Ionicons name="search-outline" size={26} color={colors.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={font.h3}>Quero contratar</Text>
              <Text style={[font.small, { marginTop: 3, lineHeight: 19 }]}>
                Encontro alguém perto de mim pra resolver o que eu preciso.
              </Text>
            </View>
          </Row>
        </Card>

        <Card onPress={() => router.push('/prestador/cadastro/dados')} style={{ marginTop: spacing(4) }}>
          <Row gap={4}>
            <View style={[s.icon, { backgroundColor: colors.successWash }]}>
              <Ionicons name="hammer-outline" size={26} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={font.h3}>Quero trabalhar</Text>
              <Text style={[font.small, { marginTop: 3, lineHeight: 19 }]}>
                Ofereço meus serviços e recebo pedidos na minha região.
              </Text>
            </View>
          </Row>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  icon: { width: 54, height: 54, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
