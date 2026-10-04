import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, font, radius, spacing, brl } from '@/theme';
import { currentProvider } from '@/data/mock';
import { useApp } from '@/store/app';
import { Button, Card, EmptyState, Row, Stat } from '@/components/ui';
import { FlameBadge, OrderCard } from '@/components/domain';
import { SectionHead, WelcomeHeader } from '@/components/blocks';

const PAD = spacing(4.5);

/** Tela 42 — painel do prestador. */
export default function PainelPrestador() {
  const { providerOrders, earnings, notifications } = useApp();
  const [disponivel, setDisponivel] = useState(true);

  const novos = providerOrders.filter((o) => o.status === 'aguardando');
  const emAndamento = providerOrders.filter((o) => o.status === 'aceito' || o.status === 'em_andamento');
  const saldo = earnings.filter((e) => e.status === 'disponivel').reduce((t, e) => t + e.net, 0);
  const naoLidas = notifications.filter((n) => !n.read && n.audience === 'prestador').length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: spacing(8), paddingTop: spacing(2) }}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeHeader
          nome={currentProvider.name.split(' ')[0]}
          iniciais={currentProvider.initials}
          naoLidas={naoLidas}
          onSino={() => router.push('/prestador/notificacoes')}
        />

        <View style={s.status}>
          <View style={{ flex: 1 }}>
            <Row gap={2}>
              <View style={[s.pulso, !disponivel && { backgroundColor: 'rgba(255,255,255,0.5)' }]} />
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.onBrand }}>
                {disponivel ? 'você está disponível' : 'você está indisponível'}
              </Text>
            </Row>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: spacing(1.5), lineHeight: 17 }}>
              {disponivel
                ? 'aparecendo nas buscas da sua região'
                : 'você não recebe pedidos novos enquanto estiver assim'}
            </Text>
          </View>
          <Switch
            value={disponivel}
            onValueChange={setDisponivel}
            trackColor={{ true: 'rgba(255,255,255,0.5)', false: 'rgba(0,0,0,0.2)' }}
            thumbColor={colors.bg}
          />
        </View>

        <Row gap={2.5} style={{ marginTop: spacing(4) }}>
          <Stat value={currentProvider.rating.toFixed(1).replace('.', ',')} label="Sua nota" tone={colors.star} />
          <Stat value={brl(saldo)} label="Disponível" tone={colors.success} />
          <Stat value={String(novos.length)} label="Pedidos novos" tone={colors.brand} />
        </Row>

        <Pressable onPress={() => router.push('/prestador/avaliacoes')}>
          <Card style={{ marginTop: spacing(4) }}>
            <Row gap={3}>
              <View style={s.nivelIcone}>
                <Ionicons name="flame" size={22} color={colors.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Row gap={2}>
                  <Text style={font.bodyStrong}>Seu nível</Text>
                  <FlameBadge level="chama" />
                </Row>
                <Text style={[font.small, { marginTop: 3, lineHeight: 18 }]}>
                  seu avatar aparece com borda em chama para os clientes
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
            </Row>
          </Card>
        </Pressable>

        <SectionHead
          title={`Pedidos novos${novos.length > 0 ? ` (${novos.length})` : ''}`}
          action={novos.length > 0 ? 'ver todos' : undefined}
          onAction={() => router.push('/prestador/(tabs)/pedidos')}
        />
        {novos.length === 0 ? (
          <Card>
            <EmptyState
              icon="notifications-outline"
              title="Nenhum pedido novo"
              body="Assim que alguém quiser agendar com você, o pedido aparece aqui na hora."
            />
          </Card>
        ) : (
          novos.map((o) => <OrderCard key={o.id} order={o} perspective="prestador" />)
        )}

        {emAndamento.length > 0 && (
          <>
            <SectionHead title="Seus próximos trabalhos" />
            {emAndamento.map((o) => <OrderCard key={o.id} order={o} perspective="prestador" />)}
          </>
        )}

        <Button
          label="Minha agenda e disponibilidade"
          variant="secondary"
          icon="calendar-outline"
          style={{ marginTop: spacing(5) }}
          onPress={() => router.push('/prestador/agenda')}
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  status: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3),
    backgroundColor: colors.brand, borderRadius: radius.xl,
    padding: spacing(4.5), marginTop: spacing(5),
  },
  pulso: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#8BE6A8' },
  nivelIcone: {
    width: 44, height: 44, borderRadius: radius.lg, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center',
  },
});
