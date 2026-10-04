import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, brlShort, cap} from '@/theme';
import { currentProvider } from '@/data/mock';
import { useApp } from '@/store/app';
import { Avatar, Card, ListRow, Row, Stat } from '@/components/ui';
import { FlameBadge } from '@/components/domain';
import { SectionHead } from '@/components/blocks';

/** Tela 49 — perfil do prestador (editar dados e configurações). */
export default function PerfilPrestador() {
  const { providerOrders, notifications } = useApp();
  const concluidos = providerOrders.filter((o) => ['concluido', 'avaliado'].includes(o.status)).length;
  const naoLidas = notifications.filter((n) => !n.read && n.audience === 'prestador').length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing(4.5), paddingTop: spacing(3), paddingBottom: spacing(8) }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: colors.text }}>Meu perfil</Text>

        <Card style={{ marginTop: spacing(5) }}>
          <Row gap={3.5}>
            <Avatar initials={currentProvider.initials} size={60} flame="chama" />
            <View style={{ flex: 1 }}>
              <Row gap={1.5}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>{currentProvider.name}</Text>
                <Ionicons name="checkmark-circle" size={15} color={colors.info} />
              </Row>
              <Text style={[font.small, { marginTop: 2 }]}>
                {cap(currentProvider.category)} · {currentProvider.city}
              </Text>
              <Text style={[font.tiny, { marginTop: 3 }]}>{currentProvider.memberSince}</Text>
            </View>
          </Row>
        </Card>
        <Row gap={2.5} style={{ marginTop: spacing(4) }}>
          <Stat value={currentProvider.rating.toFixed(1).replace('.', ',')} label="Nota média" tone={colors.star} />
          <Stat value={String(concluidos)} label="Concluídos" />
          <Stat value={brlShort(currentProvider.dailyRate)} label="Diária" tone={colors.brand} />
        </Row>

        <Card style={{ marginTop: spacing(4) }}>
          <Row gap={3.5} style={{ alignItems: 'flex-start' }}>
            <View style={s.nivelIcone}>
              <Ionicons name="flame" size={20} color={colors.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Row gap={2}>
                <Text style={font.bodyStrong}>Seu nível</Text>
                <FlameBadge level="chama" />
              </Row>
              <Text style={[font.small, { marginTop: 3, lineHeight: 19 }]}>
                Nota acima de 4,8 mantém você no topo das buscas e com a borda em chama.
              </Text>
            </View>
          </Row>
        </Card>

        <SectionHead title="Meu trabalho" />
        <Card padded={false}>
          <ListRow icon="person-outline" label="Editar meus dados" onPress={() => router.push('/prestador/cadastro/dados')} />
          <ListRow icon="pricetag-outline" label="Serviços e valores" onPress={() => router.push('/prestador/cadastro/servicos')} />
          <ListRow icon="calendar-outline" label="Agenda e disponibilidade" onPress={() => router.push('/prestador/agenda')} />
          <ListRow icon="star-outline" label="Minhas avaliações" onPress={() => router.push('/prestador/avaliacoes')} />
          <ListRow
            icon="notifications-outline" label="Notificações"
            sublabel={naoLidas > 0 ? `${naoLidas} não lidas` : undefined}
            onPress={() => router.push('/prestador/notificacoes')}
          />
          <ListRow icon="document-text-outline" label="Meus documentos" sublabel="Verificado" onPress={() => router.push('/prestador/cadastro/documentos')} last />
        </Card>

        <SectionHead title="Conta" />
        <Card padded={false}>
          <ListRow icon="help-circle-outline" label="Ajuda" onPress={() => router.push('/cliente/conta/ajuda')} />
          <ListRow icon="swap-horizontal-outline" label="Mudar para modo cliente" onPress={() => router.replace('/cliente/(tabs)')} />
          <ListRow icon="log-out-outline" label="Sair" tone={colors.danger} onPress={() => router.replace('/')} last />
        </Card>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  nivelIcone: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center',
  },
});
