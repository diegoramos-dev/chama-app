import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing, brl, cap} from '@/theme';
import { useApp } from '@/store/app';
import {
  Avatar, BottomBar, Button, Card, Divider, EmptyState,
  Header, Notice, Row, Screen,
} from '@/components/ui';

/** Tela 20 — pedido enviado, aguardando o prestador aceitar. */
export default function Confirmacao() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { getOrder, resetDraft } = useApp();
  const pedido = getOrder(orderId ?? '');

  if (!pedido) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <Header title="Confirmação" onBack={() => router.replace('/cliente/(tabs)')} />
        <EmptyState icon="receipt-outline" title="Pedido não encontrado" />
      </View>
    );
  }

  const voltarAoInicio = () => {
    resetDraft();
    router.replace('/cliente/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="Confirmação" onBack={voltarAoInicio} />

      <Screen scroll>
        <View style={{ alignItems: 'center', marginTop: spacing(6) }}>
          <View style={s.check}>
            <Ionicons name="checkmark" size={38} color={colors.brand} />
          </View>
          <Text style={[font.h2, { marginTop: spacing(4) }]}>Pedido enviado!</Text>
          <Text style={[font.small, { marginTop: spacing(2) }]}>
            aguardando o {pedido.providerName.split(' ')[0]} aceitar
          </Text>
        </View>

        <Card style={{ marginTop: spacing(6) }}>
          <Row gap={3}>
            <Avatar initials={pedido.providerInitials} size={44} />
            <View style={{ flex: 1 }}>
              <Text style={font.bodyStrong}>{pedido.providerName}</Text>
              <Text style={[font.small, { marginTop: 2 }]}>{cap(pedido.categoryName)}</Text>
            </View>
          </Row>

          <Divider />

          <Row gap={2}>
            <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
            <Text style={font.small}>{pedido.date} · {pedido.time}</Text>
          </Row>
          <Row gap={2} style={{ marginTop: spacing(2) }}>
            <Ionicons name="location-outline" size={15} color={colors.textMuted} />
            <Text style={font.small}>{pedido.addressLabel}</Text>
          </Row>

          <Row style={{ justifyContent: 'space-between', marginTop: spacing(4) }}>
            <Text style={font.bodyStrong}>Total</Text>
            <Text style={font.h3}>{brl(pedido.total)}</Text>
          </Row>
        </Card>

        <View style={{ marginTop: spacing(5) }}>
          <Notice tone="warning" icon="lock-closed-outline">
            valor pré-autorizado. só é cobrado quando o serviço for concluído.
          </Notice>
        </View>
      </Screen>

      <BottomBar>
        <Button label="Acompanhar pedido" onPress={() => router.replace(`/cliente/pedido/${pedido.id}`)} />
        <Button label="Voltar ao início" variant="ghost" onPress={voltarAoInicio} />
      </BottomBar>
    </View>
  );
}

const s = StyleSheet.create({
  check: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center',
  },
});
