import React from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing, brl } from '@/theme';
import { useApp } from '@/store/app';
import {
  Avatar, BackHeader, BottomBar, Button, Card, Divider, EmptyState,
  MoneyRow, Notice, PhotoBox, Row, Screen, SectionTitle,
} from '@/components/ui';
import { StatusPill, Timeline } from '@/components/domain';
import type { OrderStatus } from '@/data/types';

const PASSOS = [
  { label: 'Pedido enviado', detail: 'Aguardando o profissional aceitar' },
  { label: 'Profissional aceitou', detail: 'Data e horário confirmados' },
  { label: 'Serviço em andamento', detail: 'Profissional a caminho ou trabalhando' },
  { label: 'Conclusão confirmada', detail: 'Você confirma ou é automático em 24h' },
  { label: 'Pagamento liberado', detail: 'Profissional recebe, menos a comissão' },
];

const indiceDoStatus = (s: OrderStatus) =>
  ({
    aguardando: 0, aceito: 1, em_andamento: 2,
    aguardando_confirmacao: 3, concluido: 4, avaliado: 5,
    cancelado: 0, disputa: 3,
  }[s]);

/** Tela 21 — acompanhar o pedido do começo ao fim. */
export default function Pedido() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, advanceOrder, cancelOrder } = useApp();
  const pedido = getOrder(id ?? '');

  if (!pedido) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Pedido" />
        <EmptyState icon="receipt-outline" title="Pedido não encontrado" />
      </View>
    );
  }

  const cancelado = pedido.status === 'cancelado';
  const emDisputa = pedido.status === 'disputa';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title={`Pedido #${pedido.id}`} subtitle={pedido.createdAt} />

      <Screen scroll>
        <View style={{ alignSelf: 'flex-start', marginTop: spacing(4) }}>
          <StatusPill status={pedido.status} />
        </View>

        <Card style={{ marginTop: spacing(4) }}>
          <Row gap={3}>
            <Avatar initials={pedido.providerInitials} size={46} />
            <View style={{ flex: 1 }}>
              <Text style={font.bodyStrong}>{pedido.providerName}</Text>
              <Text style={[font.small, { marginTop: 2 }]}>{pedido.categoryName}</Text>
            </View>
            <Button
              label="Chat" variant="secondary" full={false}
              style={{ height: 40, paddingHorizontal: spacing(4) }}
              onPress={() => router.push(`/cliente/chat/${pedido.providerId}`)}
            />
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
        </Card>

        {!cancelado && (
          <>
            <SectionTitle>Andamento</SectionTitle>
            <Timeline steps={PASSOS} currentIndex={indiceDoStatus(pedido.status)} />
          </>
        )}

        {emDisputa && (
          <Notice tone="danger" icon="alert-circle-outline">
            Disputa aberta: "{pedido.disputeReason}". Nossa equipe responde em até 24h e o valor segue retido até lá.
          </Notice>
        )}

        {pedido.proofPhotos.length > 0 && (
          <>
            <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <SectionTitle>Provas do serviço</SectionTitle>
              <Text
                style={[font.small, { color: colors.brand, fontWeight: '700', marginBottom: spacing(3) }]}
                onPress={() => router.push(`/cliente/provas?id=${pedido.id}`)}
              >
                ver todas
              </Text>
            </Row>
            <Row gap={2.5}>
              {pedido.proofPhotos.slice(0, 3).map((c, i) => <PhotoBox key={i} color={c} />)}
            </Row>
          </>
        )}

        {pedido.clientRating ? (
          <>
            <SectionTitle>Sua avaliação</SectionTitle>
            <Card>
              <Row gap={1}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name={pedido.clientRating! >= i ? 'star' : 'star-outline'} size={17} color={colors.star} />
                ))}
              </Row>
              {pedido.clientReviewText ? (
                <Text style={[font.body, { marginTop: spacing(2.5), lineHeight: 21 }]}>{pedido.clientReviewText}</Text>
              ) : null}
            </Card>
          </>
        ) : null}

        <SectionTitle>Pagamento</SectionTitle>
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.surface }}>
          <MoneyRow label="Diária" value={brl(pedido.dailyRate)} />
          <MoneyRow label="Taxa de serviço" value={brl(pedido.serviceFee)} />
          <Divider />
          <MoneyRow label="Total" value={brl(pedido.total)} strong />
        </Card>
      </Screen>

      <BottomBar>
        <AcoesDoPedido
          status={pedido.status}
          onAvancar={(s) => advanceOrder(pedido.id, s)}
          onCancelar={() => cancelOrder(pedido.id)}
          onConfirmar={() => router.push(`/cliente/confirmar-conclusao?id=${pedido.id}`)}
          onDisputa={() => router.push(`/cliente/disputa?id=${pedido.id}`)}
          onAvaliar={() => router.push(`/cliente/avaliar?id=${pedido.id}`)}
          onSuporte={() => router.push(`/cliente/conta/suporte?assunto=${pedido.id}`)}
        />
      </BottomBar>
    </View>
  );
}

/**
 * Botões variam com o status. Os rótulos "simular" existem porque não há
 * backend: eles empurram o pedido para o próximo estado à mão.
 */
function AcoesDoPedido({
  status, onAvancar, onCancelar, onConfirmar, onDisputa, onAvaliar, onSuporte,
}: {
  status: OrderStatus;
  onAvancar: (s: OrderStatus) => void;
  onCancelar: () => void;
  onConfirmar: () => void;
  onDisputa: () => void;
  onAvaliar: () => void;
  onSuporte: () => void;
}) {
  switch (status) {
    case 'aguardando':
      return (
        <>
          <Button label="Simular: profissional aceitou" icon="play-outline" onPress={() => onAvancar('aceito')} />
          <Button label="Cancelar pedido" variant="ghost" onPress={onCancelar} />
        </>
      );
    case 'aceito':
      return (
        <>
          <Button label="Simular: serviço começou" icon="play-outline" onPress={() => onAvancar('em_andamento')} />
          <Button label="Cancelar pedido" variant="ghost" onPress={onCancelar} />
        </>
      );
    case 'em_andamento':
      return <Button label="Simular: serviço terminou" icon="play-outline" onPress={() => onAvancar('aguardando_confirmacao')} />;
    case 'aguardando_confirmacao':
      return (
        <>
          <Button label="Confirmar conclusão" icon="checkmark-circle-outline" onPress={onConfirmar} />
          <Button label="Algo deu errado" variant="ghost" onPress={onDisputa} />
        </>
      );
    case 'concluido':
      return <Button label="Avaliar o profissional" icon="star-outline" onPress={onAvaliar} />;
    case 'disputa':
      return (
        <Button
          label="Falar com o suporte"
          variant="secondary"
          icon="headset-outline"
          onPress={onSuporte}
        />
      );
    default:
      return <Button label="Voltar" variant="secondary" onPress={() => router.back()} />;
  }
}
