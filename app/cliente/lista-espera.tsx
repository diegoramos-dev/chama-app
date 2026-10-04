import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, font, spacing, cap} from '@/theme';
import { categories, currentUser, waitlistRegions } from '@/data/mock';
import { useApp } from '@/store/app';
import { BackHeader, Button, Screen, Chip, Row, EmptyState, Notice } from '@/components/ui';

/** Tela 11 — lista de espera: avisa quando aparecer alguém. */
export default function ListaEspera() {
  const { categoria } = useLocalSearchParams<{ categoria?: string }>();
  const { joinWaitlist, waitlist } = useApp();
  const [regiao, setRegiao] = useState(currentUser.city);
  const [pronto, setPronto] = useState(false);

  const cat = categories.find((c) => c.id === categoria);
  const jaNaLista = waitlist.some((w) => w.categoryId === categoria);

  const entrar = () => {
    joinWaitlist(categoria ?? 'geral', cat?.name ?? 'serviço', regiao);
    setPronto(true);
  };

  if (pronto || jaNaLista) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Lista de espera" />
        <Screen scroll>
          <EmptyState
            icon="checkmark-circle-outline"
            title="Prontinho, você está na lista"
            body={`Assim que um ${cat?.name ?? 'profissional'} for aprovado em ${regiao}, você recebe uma notificação — antes de todo mundo.`}
            action={<Button label="Voltar para o início" onPress={() => router.replace('/cliente/(tabs)')} />}
          />
        </Screen>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Lista de espera" subtitle={cat ? cap(cat.name) : undefined} />
      <Screen scroll>
        <Text style={[font.body, { marginTop: spacing(6), lineHeight: 22 }]}>
          A gente te avisa assim que um profissional dessa categoria for aprovado perto de você.
        </Text>

        <Text style={[font.h3, { marginTop: spacing(7), marginBottom: spacing(3) }]}>Onde você quer ser atendido?</Text>
        <Row gap={2} style={{ flexWrap: 'wrap' }}>
          {waitlistRegions.map((r) => (
            <Chip key={r} label={r} active={regiao === r} onPress={() => setRegiao(r)} />
          ))}
        </Row>

        <View style={{ marginTop: spacing(7) }}>
          <Notice tone="info" icon="notifications-outline">
            Você só recebe uma notificação quando tiver alguém de verdade disponível. Nada de spam.
          </Notice>
        </View>

        <Button label="Entrar na lista de espera" onPress={entrar} style={{ marginTop: spacing(6) }} />
      </Screen>
    </View>
  );
}
