import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, brlShort, cap} from '@/theme';
import { categoryIcon, categoryPhoto, heroPro } from '@/data/assets';
import type { Provider } from '@/data/types';
import { Row } from './ui';

/**
 * Componentes do redesign (lab). Vivem separados dos componentes atuais
 * para não quebrar nenhuma das 50 telas enquanto a direção é validada.
 */

/* ------------------------------------------------------- cabeçalho leve */

export function WelcomeHeader({
  nome, iniciais, naoLidas, onSino,
}: {
  nome: string; iniciais: string; naoLidas: number; onSino?: () => void;
}) {
  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <Row gap={3}>
        <View style={s.avatarBadge}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brand }}>{iniciais}</Text>
        </View>
        <View>
          <Text style={[font.small, { fontSize: 12 }]}>Bem-vinda,</Text>
          <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 1 }}>
            👋 {nome}
          </Text>
        </View>
      </Row>
      <Pressable onPress={onSino} hitSlop={10} style={s.bell}>
        <Ionicons name="notifications-outline" size={20} color={colors.text} />
        {naoLidas > 0 && <View style={s.bellDot} />}
      </Pressable>
    </Row>
  );
}

/* ------------------------------------------------------- banner promo */

export function PromoBanner({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={s.promo}>
      <View style={{ flex: 1, paddingRight: spacing(2) }}>
        <Row gap={1.5}>
          <Text style={s.promoPct}>2%</Text>
          <Ionicons name="flame" size={20} color="#FFD9A0" />
        </Row>
        <Text style={s.promoTitle}>É tudo que a gente cobra</Text>
        <Text style={s.promoSub}>
          Sem mensalidade e sem taxa por orçamento. Você paga só quando o serviço acontece.
        </Text>
      </View>
      <Image source={heroPro} style={s.promoImg} resizeMode="contain" />
      <View style={s.promoGlow} pointerEvents="none" />
    </Pressable>
  );
}

/* -------------------------------------------------------- busca + botão */

export function SearchRow({ local, onBuscar }: { local: string; onBuscar?: () => void }) {
  return (
    <Row gap={2.5}>
      <Pressable onPress={onBuscar} style={s.searchField}>
        <Ionicons name="location" size={17} color={colors.brand} />
        <Text style={[font.body, { color: colors.textMuted, flex: 1 }]} numberOfLines={1}>
          {local}
        </Text>
        <Ionicons name="locate-outline" size={17} color={colors.textFaint} />
      </Pressable>
      <Pressable onPress={onBuscar} style={s.searchBtn}>
        <Ionicons name="search" size={20} color={colors.onBrand} />
      </Pressable>
    </Row>
  );
}

/* --------------------------------------------------- cabeçalho de seção */

export function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <Row style={{ justifyContent: 'space-between', marginTop: spacing(7), marginBottom: spacing(3.5) }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brand }}>{action}</Text>
        </Pressable>
      ) : null}
    </Row>
  );
}

/* ------------------------------------------------ grade de categorias */

export function CategoryGridItem({
  id, nome, destaque, onPress, largura,
}: {
  id: string; nome: string; destaque?: boolean; onPress?: () => void;
  /** por padrão ocupa 31% (grade de 3 colunas); passe '100%' se o pai já posiciona */
  largura?: any;
}) {
  return (
    <Pressable onPress={onPress} style={[s.gridItem, largura ? { width: largura } : null, destaque && s.gridItemOn]}>
      <Image source={categoryIcon[id]} style={s.gridIcon} resizeMode="contain" />
      <Text
        style={[s.gridLabel, destaque && { color: colors.onBrand }]}
        numberOfLines={1}
      >
        {nome}
      </Text>
    </Pressable>
  );
}

/* ------------------------------------------------- card com foto grande */

export function ServiceCard({
  provider, largura = 240, onPress,
}: {
  provider: Provider; largura?: number; onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[s.svcCard, { width: largura }]}>
      <View>
        <Image source={categoryPhoto(provider.categoryId)} style={s.svcImg} resizeMode="cover" />
        <View style={s.priceTag}>
          <Text style={s.priceTagText}>{brlShort(provider.dailyRate)}</Text>
        </View>
      </View>
      <View style={{ padding: spacing(3.5) }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }} numberOfLines={1}>
          {cap(provider.categoryName)}
        </Text>
        <Row gap={1} style={{ marginTop: spacing(1.5) }}>
          <Ionicons name="star" size={13} color={colors.star} />
          <Text style={[font.small, { fontWeight: '700', color: colors.text }]}>
            {provider.rating.toFixed(1).replace('.', ',')}
          </Text>
          <Text style={[font.small, { color: colors.textFaint }]}>({provider.reviewCount})</Text>
        </Row>
        <Row gap={2} style={{ marginTop: spacing(3), paddingTop: spacing(3), borderTopWidth: 1, borderTopColor: colors.border }}>
          <View style={s.miniAvatar}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.brand }}>{provider.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }} numberOfLines={1}>
              {provider.name}
            </Text>
            <Text style={[font.tiny, { fontSize: 10 }]}>Profissional</Text>
          </View>
          {provider.verified && <Ionicons name="checkmark-circle" size={14} color={colors.info} />}
        </Row>
      </View>
    </Pressable>
  );
}

/* ------------------------------------------------ chip de subcategoria */

export function SubChip({
  id, nome, ativo, onPress, icone,
}: {
  id?: string; nome: string; ativo?: boolean; onPress?: () => void; icone?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', width: 70 }}>
      <View style={[s.subCircle, ativo && { backgroundColor: colors.brand }]}>
        {id && categoryIcon[id] ? (
          <Image source={categoryIcon[id]} style={{ width: 34, height: 34 }} resizeMode="contain" />
        ) : (
          <Ionicons name={icone ?? 'flame'} size={22} color={ativo ? colors.onBrand : colors.brand} />
        )}
      </View>
      <Text style={[font.tiny, { marginTop: spacing(1.5), textAlign: 'center' }, ativo && { color: colors.brand, fontWeight: '700' }]} numberOfLines={1}>
        {nome}
      </Text>
    </Pressable>
  );
}

/* --------------------------------------------- linha de detalhe pontilhada */

export function DashedRow({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <View style={s.dashed}>
      <Text style={[font.small, { color: colors.textMuted }]}>{label}</Text>
      <View style={s.dashLine} />
      <Text style={{ fontSize: 13, fontWeight: '700', color: tone ?? colors.text }}>{value}</Text>
    </View>
  );
}

/* -------------------------------------------------- card "não achou?" */

export function PostRequestCard({ onPress }: { onPress?: () => void }) {
  return (
    <View style={s.postCard}>
      <Text style={[font.bodyStrong, { textAlign: 'center' }]}>Não achou o que precisa?</Text>
      <Text style={[font.small, { textAlign: 'center', marginTop: spacing(1.5), lineHeight: 19 }]}>
        Descreve o serviço que a gente avisa quando alguém aparecer na sua região.
      </Text>
      <Pressable onPress={onPress} style={s.postBtn}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.onBrand }}>Entrar na lista de espera</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  avatarBadge: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center',
  },
  bell: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute', top: 11, right: 12, width: 8, height: 8,
    borderRadius: 4, backgroundColor: colors.brand, borderWidth: 1.5, borderColor: colors.surface,
  },

  promo: {
    flexDirection: 'row', backgroundColor: colors.brand, borderRadius: 24,
    padding: spacing(4.5), marginTop: spacing(5), overflow: 'hidden', alignItems: 'center',
  },
  promoPct: { fontSize: 30, fontWeight: '800', color: colors.onBrand, letterSpacing: -0.5 },
  promoTitle: { fontSize: 15, fontWeight: '700', color: colors.onBrand, marginTop: 2 },
  promoSub: { fontSize: 11.5, color: 'rgba(255,255,255,0.88)', marginTop: spacing(2), lineHeight: 16 },
  promoImg: { width: 104, height: 104, marginRight: -spacing(2), marginBottom: -spacing(5) },
  promoGlow: {
    position: 'absolute', right: -30, top: -30, width: 150, height: 150,
    borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.08)',
  },

  searchField: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing(2.5),
    height: 54, borderRadius: 18, backgroundColor: colors.surface, paddingHorizontal: spacing(4),
  },
  searchBtn: {
    width: 54, height: 54, borderRadius: 18, backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },

  gridItem: {
    width: '31%', aspectRatio: 0.94, borderRadius: radius.tile, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing(1.5), gap: spacing(1),
  },
  gridItemOn: { backgroundColor: colors.brand },
  gridIcon: { width: 52, height: 52 },
  gridLabel: { fontSize: 11.5, fontWeight: '600', color: colors.text, textAlign: 'center' },

  svcCard: {
    borderRadius: 20, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  svcImg: { width: '100%', height: 130 },
  priceTag: {
    position: 'absolute', right: spacing(3), bottom: spacing(3),
    backgroundColor: colors.brand, borderRadius: radius.pill,
    paddingHorizontal: spacing(3), paddingVertical: spacing(1.5),
  },
  priceTagText: { fontSize: 13, fontWeight: '800', color: colors.onBrand },
  miniAvatar: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center',
  },

  subCircle: {
    width: 56, height: 56, borderRadius: 20, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },

  dashed: { flexDirection: 'row', alignItems: 'center', gap: spacing(2), paddingVertical: spacing(2.5) },
  dashLine: { flex: 1, height: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: colors.border },

  postCard: {
    backgroundColor: colors.brandWash, borderRadius: 20, padding: spacing(5), marginTop: spacing(6),
  },
  postBtn: {
    backgroundColor: colors.brand, borderRadius: 16, height: 48,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing(4),
  },
});
