import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing, cap} from '@/theme';
import { categories, currentUser } from '@/data/mock';
import { BackHeader, Button, Screen, Notice } from '@/components/ui';

/** Tela 10 — "a chama triste": ninguém dessa categoria na região. */
export default function SemProfissional() {
  const { categoria } = useLocalSearchParams<{ categoria?: string }>();
  const cat = categories.find((c) => c.id === categoria);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title={cat ? cap(cat.name) : 'Busca'} />
      <Screen scroll>
        <View style={s.center}>
          <View style={s.flameWrap}>
            <Ionicons name="flame-outline" size={54} color={colors.brandLight} />
            <View style={s.sadFace}>
              <Ionicons name="sad-outline" size={22} color={colors.brand} />
            </View>
          </View>

          <Text style={[font.h2, { textAlign: 'center', marginTop: spacing(5) }]}>
            a chama apagou por aqui
          </Text>
          <Text style={[font.body, { textAlign: 'center', marginTop: spacing(3), lineHeight: 22, color: colors.textMuted }]}>
            Ainda não temos {cat ? cat.name : 'esse serviço'} atendendo perto de {currentUser.city}. O Chama é novo na sua região.
          </Text>
        </View>

        <View style={{ marginTop: spacing(8), gap: spacing(3) }}>
          <Button
            label="Me avisa quando tiver"
            icon="notifications-outline"
            onPress={() => router.push(`/cliente/lista-espera?categoria=${categoria ?? ''}`)}
          />
          <Button label="Ver outras categorias" variant="secondary" onPress={() => router.replace('/cliente/categorias')} />
        </View>

        <View style={{ marginTop: spacing(6) }}>
          <Notice tone="info" icon="megaphone-outline">
            Conhece alguém que faz esse serviço? Indica o Chama — profissional aprovado começa a receber pedidos na hora.
          </Notice>
        </View>
      </Screen>
    </View>
  );
}

const s = StyleSheet.create({
  center: { alignItems: 'center', marginTop: spacing(10) },
  flameWrap: {
    width: 108, height: 108, borderRadius: 54, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center',
  },
  sadFace: {
    position: 'absolute', bottom: 6, right: 6, backgroundColor: colors.bg,
    borderRadius: 16, padding: 4,
  },
});
