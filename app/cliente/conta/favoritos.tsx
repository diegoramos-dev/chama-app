import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@/theme';
import { providers } from '@/data/mock';
import { useApp } from '@/store/app';
import { BackHeader, Button, EmptyState, Screen } from '@/components/ui';
import { ProviderCard } from '@/components/domain';

/** Tela 33 — profissionais favoritados. */
export default function Favoritos() {
  const { favorites } = useApp();
  const lista = providers.filter((p) => favorites.includes(p.id));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Favoritos" subtitle={`${lista.length} profissionais salvos`} />
      <Screen scroll>
        {lista.length === 0 ? (
          <EmptyState
            icon="heart-outline"
            title="Nenhum favorito ainda"
            body="Toque no coração no perfil de um profissional para salvar e chamar de novo depois."
            action={<Button label="Procurar profissionais" onPress={() => router.push('/cliente/(tabs)')} />}
          />
        ) : (
          <View style={{ marginTop: spacing(4) }}>
            {lista.map((p) => <ProviderCard key={p.id} provider={p} />)}
          </View>
        )}
      </Screen>
    </View>
  );
}
