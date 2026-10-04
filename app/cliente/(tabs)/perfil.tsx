import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/theme';
import { currentUser } from '@/data/mock';
import { useApp } from '@/store/app';
import { Avatar, Card, ListRow, Row, Stat } from '@/components/ui';
import { SectionHead } from '@/components/blocks';

const PAD = spacing(4.5);

/** Tela 28 — minha conta. */
export default function Perfil() {
  const { orders, favorites, notifications } = useApp();
  const naoLidas = notifications.filter((n) => !n.read && n.audience === 'cliente').length;
  const concluidos = orders.filter((o) => ['concluido', 'avaliado'].includes(o.status)).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: spacing(8), paddingTop: spacing(3) }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 26, fontWeight: '700', color: colors.text }}>Minha conta</Text>

        <Card style={{ marginTop: spacing(5) }}>
          <Row gap={3.5}>
            <View>
              <Avatar initials={currentUser.initials} size={60} />
              <View style={s.editDot}>
                <Ionicons name="pencil" size={10} color={colors.onBrand} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>{currentUser.name}</Text>
              <Text style={[font.small, { marginTop: 2 }]}>{currentUser.email}</Text>
              <Text style={[font.tiny, { marginTop: 3 }]}>
                {currentUser.city} · {currentUser.memberSince}
              </Text>
            </View>
          </Row>
        </Card>

        <Row gap={2.5} style={{ marginTop: spacing(4) }}>
          <Stat value={String(orders.length)} label="Pedidos" tone={colors.brand} />
          <Stat value={String(concluidos)} label="Concluídos" tone={colors.success} />
          <Stat value={String(favorites.length)} label="Favoritos" />
        </Row>

        <SectionHead title="Minha atividade" />
        <Card padded={false}>
          <ListRow icon="receipt-outline" label="Meus pedidos" sublabel={`${orders.length} no total`} onPress={() => router.push('/cliente/conta/pedidos')} />
          <ListRow icon="card-outline" label="Formas de pagamento" onPress={() => router.push('/cliente/conta/pagamentos')} />
          <ListRow icon="location-outline" label="Meus endereços" onPress={() => router.push('/cliente/conta/enderecos')} />
          <ListRow icon="heart-outline" label="Favoritos" sublabel={`${favorites.length} profissionais`} onPress={() => router.push('/cliente/conta/favoritos')} />
          <ListRow
            icon="notifications-outline" label="Notificações"
            sublabel={naoLidas > 0 ? `${naoLidas} não lidas` : undefined}
            onPress={() => router.push('/cliente/conta/notificacoes')} last
          />
        </Card>

        <SectionHead title="Conta" />
        <Card padded={false}>
          <ListRow icon="person-outline" label="Editar meus dados" onPress={() => router.push('/cliente/conta/editar')} />
          <ListRow icon="help-circle-outline" label="Ajuda" onPress={() => router.push('/cliente/conta/ajuda')} />
          <ListRow icon="swap-horizontal-outline" label="Mudar para modo prestador" onPress={() => router.push('/prestador/(tabs)')} />
          <ListRow icon="log-out-outline" label="Sair" tone={colors.danger} onPress={() => router.replace('/')} last />
        </Card>

        <Text style={[font.tiny, { textAlign: 'center', marginTop: spacing(6) }]}>Chama · versão 1.0.0 (mock)</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  editDot: {
    position: 'absolute', right: -2, bottom: -2, width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.bg,
  },
});
