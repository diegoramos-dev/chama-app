import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, font, spacing, brlShort, brl, cap} from '@/theme';
import { categories, flameColor, flameLabel } from '@/data/mock';
import { categoryPhoto } from '@/data/assets';
import type { Order, OrderStatus, Provider } from '@/data/types';
import { Avatar, Card, Chip, Row } from './ui';

/* ------------------------------------------------------------ StatusPill */

const statusMap: Record<OrderStatus, { label: string; tone: 'neutral' | 'brand' | 'success' | 'warning' | 'danger'; icon: keyof typeof Ionicons.glyphMap }> = {
  aguardando: { label: 'Aguardando aceite', tone: 'warning', icon: 'time-outline' },
  aceito: { label: 'Confirmado', tone: 'success', icon: 'checkmark-circle-outline' },
  em_andamento: { label: 'Em andamento', tone: 'brand', icon: 'play-circle-outline' },
  aguardando_confirmacao: { label: 'Confirme a conclusão', tone: 'warning', icon: 'help-circle-outline' },
  concluido: { label: 'Concluído', tone: 'success', icon: 'checkmark-done-outline' },
  avaliado: { label: 'Avaliado', tone: 'neutral', icon: 'star-outline' },
  cancelado: { label: 'Cancelado', tone: 'danger', icon: 'close-circle-outline' },
  disputa: { label: 'Em disputa', tone: 'danger', icon: 'alert-circle-outline' },
};

export function StatusPill({ status }: { status: OrderStatus }) {
  const m = statusMap[status];
  return <Chip label={m.label} tone={m.tone} icon={m.icon} />;
}

export const statusLabel = (s: OrderStatus) => statusMap[s].label;

/* ------------------------------------------------------------ FlameBadge */

export function FlameBadge({ level }: { level: string }) {
  return (
    <View style={[s.flameBadge, { backgroundColor: flameColor[level] + '1A' }]}>
      <Ionicons name="flame" size={12} color={flameColor[level]} />
      <Text style={{ fontSize: 11, fontWeight: '700', color: flameColor[level] }}>{cap(flameLabel[level])}</Text>
    </View>
  );
}

/* ---------------------------------------------------------- ProviderCard */

export function ProviderCard({ provider, onPress }: { provider: Provider; onPress?: () => void }) {
  return (
    <Card
      onPress={onPress ?? (() => router.push(`/cliente/prestador/${provider.id}`))}
      style={{ marginBottom: spacing(3) }}
    >
      <Row gap={3}>
        <Avatar initials={provider.initials} size={46} flame={provider.flame} />
        <View style={{ flex: 1 }}>
          <Row gap={1}>
            <Text style={font.bodyStrong} numberOfLines={1}>{provider.name}</Text>
            {provider.verified && <Ionicons name="checkmark-circle" size={14} color={colors.info} />}
          </Row>
          <Row gap={2} style={{ marginTop: 3 }}>
            <Row gap={0.5}>
              <Ionicons name="star" size={12} color={colors.star} />
              <Text style={font.small}>{provider.rating.toFixed(1).replace('.', ',')}</Text>
              <Text style={[font.small, { color: colors.textFaint }]}>({provider.reviewCount})</Text>
            </Row>
            <Row gap={0.5}>
              <Ionicons name="location-outline" size={12} color={colors.textFaint} />
              <Text style={font.small}>{provider.distanceKm.toString().replace('.', ',')} km</Text>
            </Row>
          </Row>
          {provider.bestOption && (
            <View style={{ alignSelf: 'flex-start', marginTop: spacing(1.5) }}>
              <Chip label="Melhor opção" tone="brand" icon="flame" />
            </View>
          )}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={font.h3}>{brlShort(provider.dailyRate)}</Text>
          <Text style={font.tiny}>/diária</Text>
        </View>
      </Row>
    </Card>
  );
}

/* ------------------------------------------------------------- OrderCard */

export function OrderCard({
  order, onPress, showStatus = true, perspective = 'cliente',
}: {
  order: Order; onPress?: () => void; showStatus?: boolean; perspective?: 'cliente' | 'prestador';
}) {
  const href = perspective === 'cliente' ? `/cliente/pedido/${order.id}` : `/prestador/pedido/${order.id}`;
  const foto = categoriaDaFoto(order.categoryName);
  return (
    <Card onPress={onPress ?? (() => router.push(href as any))} style={{ marginBottom: spacing(3) }} padded={false}>
      <View style={{ flexDirection: 'row', padding: spacing(3.5), gap: spacing(3.5) }}>
        <Image source={foto} style={s.orderThumb} resizeMode="cover" />
        <View style={{ flex: 1 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={font.bodyStrong} numberOfLines={1}>{order.providerName}</Text>
            <Text style={font.bodyStrong}>{brl(order.total)}</Text>
          </Row>
          <Text style={[font.small, { marginTop: 2 }]} numberOfLines={1}>{cap(order.categoryName)}</Text>

          <Row gap={1} style={{ marginTop: spacing(2) }}>
            <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
            <Text style={[font.small, { fontSize: 12 }]}>{order.date} · {order.time}</Text>
          </Row>
          <Row gap={1} style={{ marginTop: 3 }}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} />
            <Text style={[font.small, { fontSize: 12 }]} numberOfLines={1}>{order.addressLabel}</Text>
          </Row>

          {showStatus && (
            <View style={{ alignSelf: 'flex-start', marginTop: spacing(2.5) }}>
              <StatusPill status={order.status} />
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

/** O pedido guarda o nome da categoria, não o id — resolve a foto pelo nome. */
function categoriaDaFoto(categoryName: string) {
  const cat = categories.find((c) => categoryName.toLowerCase().includes(c.name));
  return categoryPhoto(cat?.id ?? 'churrasqueiro');
}

/* --------------------------------------------------------- CategoryTile */

export function CategoryTile({
  name, tagline, icon, onPress,
}: {
  name: string; tagline: string; icon: string; onPress: () => void;
}) {
  return (
    <Card onPress={onPress} style={{ marginBottom: spacing(3) }}>
      <Row gap={3}>
        <View style={s.catIcon}>
          <Ionicons name={icon as any} size={22} color={colors.brand} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={font.bodyStrong}>{cap(name)}</Text>
          <Text style={[font.small, { marginTop: 2 }]}>{cap(tagline)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
      </Row>
    </Card>
  );
}

/* ----------------------------------------------------------- ReviewItem */

export function ReviewItem({ review }: { review: { initials: string; author: string; stars: number; when: string; text: string; tags: string[] } }) {
  return (
    <View style={s.review}>
      <Row gap={2.5}>
        <Avatar initials={review.initials} size={34} color={colors.surface} textColor={colors.textMuted} />
        <View style={{ flex: 1 }}>
          <Text style={font.bodyStrong}>{review.author}</Text>
          <Row gap={1.5} style={{ marginTop: 2 }}>
            <Row gap={0}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name={review.stars >= i ? 'star' : 'star-outline'} size={11} color={colors.star} />
              ))}
            </Row>
            <Text style={font.tiny}>· {review.when}</Text>
          </Row>
        </View>
      </Row>
      <Text style={[font.body, { marginTop: spacing(2.5), lineHeight: 21 }]}>{review.text}</Text>
      {review.tags?.length ? (
        <Row gap={1.5} style={{ flexWrap: 'wrap', marginTop: spacing(2.5) }}>
          {review.tags.map((t) => <Chip key={t} label={cap(t)} tone="neutral" />)}
        </Row>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------- Timeline */

export function Timeline({
  steps, currentIndex,
}: {
  steps: { label: string; detail?: string }[]; currentIndex: number;
}) {
  return (
    <View>
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const tone = done ? colors.success : active ? colors.brand : colors.border;
        return (
          <View key={step.label} style={{ flexDirection: 'row', gap: spacing(3) }}>
            <View style={{ alignItems: 'center' }}>
              <View style={[s.dot, { backgroundColor: done || active ? tone : colors.bg, borderColor: tone }]}>
                {done && <Ionicons name="checkmark" size={11} color={colors.onBrand} />}
              </View>
              {i < steps.length - 1 && <View style={[s.line, { backgroundColor: done ? colors.success : colors.border }]} />}
            </View>
            <View style={{ flex: 1, paddingBottom: spacing(5) }}>
              <Text style={[font.bodyStrong, !done && !active && { color: colors.textFaint }]}>{step.label}</Text>
              {step.detail ? <Text style={[font.small, { marginTop: 2 }]}>{step.detail}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  flameBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: spacing(2.5), paddingVertical: spacing(1),
    borderRadius: radius.pill, alignSelf: 'flex-start',
  },
  orderThumb: { width: 76, height: 76, borderRadius: radius.md },
  catIcon: {
    width: 44, height: 44, borderRadius: radius.lg, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center',
  },
  review: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.card, padding: spacing(4), marginBottom: spacing(3),
  },
  dot: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  line: { width: 2, flex: 1, marginVertical: 2 },
});
