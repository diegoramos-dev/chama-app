import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/theme';
import { useApp } from '@/store/app';
import { BackHeader, Card, EmptyState, Row, Screen } from '@/components/ui';

/** Notificações do prestador (novos pedidos, pagamentos, nível). */
export default function NotificacoesPrestador() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const lista = notifications.filter((n) => n.audience === 'prestador');
  const naoLidas = lista.filter((n) => !n.read).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader
        title="Notificações"
        subtitle={naoLidas > 0 ? `${naoLidas} não lidas` : 'tudo em dia'}
        right={
          naoLidas > 0 ? (
            <Pressable onPress={markAllNotificationsRead} hitSlop={10}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brand }}>Marcar todas</Text>
            </Pressable>
          ) : undefined
        }
      />
      <Screen scroll>
        {lista.length === 0 ? (
          <EmptyState icon="notifications-outline" title="Nenhuma notificação" body="Pedidos novos e pagamentos aparecem aqui." />
        ) : (
          <View style={{ marginTop: spacing(4), gap: spacing(2.5) }}>
            {lista.map((n) => (
              <Card
                key={n.id}
                onPress={() => markNotificationRead(n.id)}
                style={!n.read && { backgroundColor: colors.brandWash, borderColor: colors.brandLight }}
              >
                <Row gap={3}>
                  <View style={{
                    width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.bg,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Ionicons name={n.icon as any} size={19} color={colors.brand} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Row gap={2}>
                      <Text style={[font.bodyStrong, { flex: 1 }]}>{n.title}</Text>
                      {!n.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand }} />}
                    </Row>
                    <Text style={[font.small, { marginTop: 3, lineHeight: 19 }]}>{n.body}</Text>
                    <Text style={[font.tiny, { marginTop: spacing(2) }]}>{n.when}</Text>
                  </View>
                </Row>
              </Card>
            ))}
          </View>
        )}
      </Screen>
    </View>
  );
}
