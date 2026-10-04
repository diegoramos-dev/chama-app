import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing, brl } from '@/theme';
import { COMMISSION_RATE } from '@/data/mock';
import { useApp } from '@/store/app';
import {
  BackHeader, BottomBar, Button, Card, Divider, EmptyState,
  MoneyRow, Notice, PhotoBox, Row, Screen, SectionTitle,
} from '@/components/ui';

/** Tela 23 — cliente confirma que o serviço foi concluído e libera o pagamento. */
export default function ConfirmarConclusao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, advanceOrder } = useApp();
  const pedido = getOrder(id ?? '');
  const [feito, setFeito] = useState(false);

  if (!pedido) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Confirmar conclusão" />
        <EmptyState icon="checkmark-circle-outline" title="Pedido não encontrado" />
      </View>
    );
  }

  const comissao = Math.round(pedido.dailyRate * COMMISSION_RATE * 100) / 100;

  const confirmar = () => {
    advanceOrder(pedido.id, 'concluido');
    setFeito(true);
  };

  if (feito) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Tudo certo" />
        <Screen scroll>
          <EmptyState
            icon="checkmark-done-outline"
            title="Pagamento liberado"
            body={`O ${pedido.providerName.split(' ')[0]} recebeu ${brl(pedido.dailyRate - comissao)}. Agora conta pra gente como foi.`}
            action={<Button label="Avaliar o profissional" icon="star-outline" onPress={() => router.replace(`/cliente/avaliar?id=${pedido.id}`)} />}
          />
        </Screen>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Confirmar conclusão" />
      <Screen scroll>
        <Text style={[font.h2, { marginTop: spacing(5) }]}>O serviço foi concluído?</Text>
        <Text style={[font.body, { marginTop: spacing(3), lineHeight: 22, color: colors.textMuted }]}>
          Ao confirmar, o valor retido é liberado para o {pedido.providerName.split(' ')[0]}. Se algo deu errado,
          abra uma disputa em vez de confirmar.
        </Text>

        {pedido.proofPhotos.length > 0 && (
          <>
            <SectionTitle>O que o profissional enviou</SectionTitle>
            <Row gap={2.5}>
              {pedido.proofPhotos.slice(0, 3).map((c, i) => <PhotoBox key={i} color={c} />)}
            </Row>
          </>
        )}

        <SectionTitle>Como o valor será dividido</SectionTitle>
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.surface }}>
          <MoneyRow label="Valor do serviço" value={brl(pedido.dailyRate)} />
          <MoneyRow label={`Comissão Chama (${(COMMISSION_RATE * 100).toFixed(0)}%)`} value={`- ${brl(comissao)}`} />
          <Divider />
          <MoneyRow label={`Vai para o ${pedido.providerName.split(' ')[0]}`} value={brl(pedido.dailyRate - comissao)} strong />
        </Card>

        <View style={{ marginTop: spacing(5) }}>
          <Notice tone="warning" icon="time-outline">
            Se você não responder, a conclusão é confirmada automaticamente em 24h.
          </Notice>
        </View>
      </Screen>

      <BottomBar>
        <Button label="Sim, foi concluído" icon="checkmark-circle-outline" onPress={confirmar} />
        <Button label="Não, algo deu errado" variant="ghost" onPress={() => router.replace(`/cliente/disputa?id=${pedido.id}`)} />
      </BottomBar>
    </View>
  );
}
