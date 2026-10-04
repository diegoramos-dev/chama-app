import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing, brl, cap} from '@/theme';
import { COMMISSION_RATE } from '@/data/mock';
import { useApp } from '@/store/app';
import {
  Avatar, BackHeader, BottomBar, Button, Card, Divider, EmptyState,
  MoneyRow, Notice, PhotoBox, Row, Screen, SectionTitle,
} from '@/components/ui';
import { StatusPill } from '@/components/domain';

const CORES_PROVA = ['#F2C4A8', '#E8D5A8', '#F0B896', '#DCC0A0'];

/** Telas 43 e 44 — detalhe do pedido para o prestador: aceitar, recusar e enviar provas. */
export default function PedidoPrestador() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, acceptProviderOrder, startProviderOrder, declineProviderOrder, addProof, finishProviderOrder } = useApp();
  const pedido = getOrder(id ?? '');
  const [recusado, setRecusado] = useState(false);

  if (!pedido) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Pedido" />
        <EmptyState icon="briefcase-outline" title="Pedido não encontrado" />
      </View>
    );
  }

  const comissao = Math.round(pedido.dailyRate * COMMISSION_RATE * 100) / 100;
  const liquido = pedido.dailyRate - comissao;

  const recusar = () => {
    declineProviderOrder(pedido.id);
    setRecusado(true);
  };

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
              <Text style={[font.small, { marginTop: 2 }]}>Cliente</Text>
            </View>
            <Button
              label="Chat" variant="secondary" full={false}
              style={{ height: 40, paddingHorizontal: spacing(4) }}
              onPress={() => router.push('/cliente/chat/p1')}
            />
          </Row>

          <Divider />

          <Text style={font.bodyStrong}>{cap(pedido.categoryName)}</Text>
          <Row gap={2} style={{ marginTop: spacing(2.5) }}>
            <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
            <Text style={font.small}>{pedido.date} · {pedido.time}</Text>
          </Row>
          <Row gap={2} style={{ marginTop: spacing(2) }}>
            <Ionicons name="location-outline" size={15} color={colors.textMuted} />
            <Text style={font.small}>{pedido.addressLabel}</Text>
          </Row>
        </Card>

        <SectionTitle>Quanto você recebe</SectionTitle>
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.surface }}>
          <MoneyRow label="Valor do serviço" value={brl(pedido.dailyRate)} />
          <MoneyRow label={`Comissão Chama (${(COMMISSION_RATE * 100).toFixed(0)}%)`} value={`- ${brl(comissao)}`} />
          <Divider />
          <MoneyRow label="Líquido para você" value={brl(liquido)} strong />
        </Card>

        {pedido.status === 'em_andamento' && (
          <>
            <SectionTitle>Provas do serviço</SectionTitle>
            <Text style={[font.small, { marginBottom: spacing(3), lineHeight: 20 }]}>
              Fotos do trabalho protegem você numa eventual disputa. Envie pelo menos duas.
            </Text>
            {pedido.proofPhotos.length > 0 && (
              <Row gap={2.5} style={{ marginBottom: spacing(3), flexWrap: 'wrap' }}>
                {pedido.proofPhotos.map((c, i) => <PhotoBox key={i} color={c} size={94} />)}
              </Row>
            )}
            <Button
              label="Adicionar foto"
              variant="secondary"
              icon="camera-outline"
              onPress={() => addProof(pedido.id, CORES_PROVA[pedido.proofPhotos.length % CORES_PROVA.length])}
            />
          </>
        )}

        {pedido.status === 'aguardando_confirmacao' && (
          <View style={{ marginTop: spacing(5) }}>
            <Notice tone="warning" icon="time-outline">
              Serviço finalizado. O valor entra como pendente até o cliente confirmar — ou automaticamente em 24h.
            </Notice>
          </View>
        )}

        {recusado && (
          <View style={{ marginTop: spacing(5) }}>
            <Notice tone="danger" icon="close-circle-outline">
              Pedido recusado. Ele volta para a busca e outro profissional pode aceitar.
            </Notice>
          </View>
        )}
      </Screen>

      <BottomBar>
        {pedido.status === 'aguardando' && (
          <>
            <Button label={`Aceitar por ${brl(liquido)}`} icon="checkmark-circle-outline" onPress={() => acceptProviderOrder(pedido.id)} />
            <Row gap={2.5}>
              <Button label="Contraproposta" variant="secondary" full={false} style={{ flex: 1 }} onPress={() => router.push('/cliente/chat/p1')} />
              <Button label="Recusar" variant="danger" full={false} style={{ flex: 1 }} onPress={recusar} />
            </Row>
          </>
        )}
        {pedido.status === 'aceito' && (
          <Button label="Iniciar serviço" icon="play-outline" onPress={() => startProviderOrder(pedido.id)} />
        )}
        {pedido.status === 'em_andamento' && (
          <Button
            label="Finalizar serviço"
            icon="checkmark-done-outline"
            disabled={pedido.proofPhotos.length === 0}
            onPress={() => finishProviderOrder(pedido.id)}
          />
        )}
        {['aguardando_confirmacao', 'concluido', 'avaliado', 'cancelado'].includes(pedido.status) && (
          <Button label="Voltar" variant="secondary" onPress={() => router.back()} />
        )}
      </BottomBar>
    </View>
  );
}
