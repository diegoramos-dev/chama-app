import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, font, radius, spacing, brl, brlShort, cap} from '@/theme';
import { providers, SERVICE_FEE_RATE, flameLabel } from '@/data/mock';
import { categoryPhoto } from '@/data/assets';
import { useApp } from '@/store/app';
import { BackHeader, EmptyState, Row } from '@/components/ui';
import { DashedRow, SectionHead } from '@/components/blocks';

const PAD = spacing(4.5);

/** Tela 12 — perfil do prestador. */
export default function PerfilPrestador() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { favorites, toggleFavorite, setDraft } = useApp();
  const p = providers.find((x) => x.id === id);

  if (!p) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Profissional" />
        <EmptyState icon="person-outline" title="Profissional não encontrado" />
      </View>
    );
  }

  const favorito = favorites.includes(p.id);
  const taxa = Math.round(p.dailyRate * SERVICE_FEE_RATE * 100) / 100;

  const contratar = () => {
    setDraft({ providerId: p.id });
    router.push(`/cliente/agendar/${p.id}`);
  };

  const compartilhar = () =>
    Share.share({
      message:
        `${p.name} — ${p.categoryName} no Chama\n` +
        `${p.rating.toFixed(1).replace('.', ',')} estrelas em ${p.reviewCount} avaliações · ${brlShort(p.dailyRate)}/diária\n` +
        `chama://prestador/${p.id}`,
    }).catch(() => {});

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View>
          <Image source={categoryPhoto(p.categoryId)} style={s.capa} resizeMode="cover" />
          <SafeAreaView edges={['top']} style={s.capaTopo}>
            <Row style={{ justifyContent: 'space-between', paddingHorizontal: PAD, paddingTop: spacing(2) }}>
              <Pressable onPress={() => router.back()} style={s.capaBtn}>
                <Ionicons name="chevron-back" size={20} color={colors.text} />
              </Pressable>
              <Row gap={2.5}>
                <Pressable onPress={() => toggleFavorite(p.id)} style={s.capaBtn}>
                  <Ionicons
                    name={favorito ? 'heart' : 'heart-outline'}
                    size={19}
                    color={favorito ? colors.brand : colors.text}
                  />
                </Pressable>
                <Pressable style={s.capaBtn} onPress={compartilhar}>
                  <Ionicons name="share-social-outline" size={19} color={colors.text} />
                </Pressable>
              </Row>
            </Row>
          </SafeAreaView>
        </View>

        <View style={s.folha}>
          <Row gap={3.5}>
            <View style={{ width: 62, height: 62 }}>
              <View style={s.avatar}>
                <Text style={{ fontSize: 22, fontWeight: '800', color: colors.brand }}>{p.initials}</Text>
              </View>
              {p.verified && (
                <View style={s.verif}>
                  <Ionicons name="checkmark" size={11} color={colors.onBrand} />
                </View>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{p.name}</Text>
              <Text style={[font.small, { marginTop: 2 }]}>{cap(p.categoryName)}</Text>
              <Row gap={1} style={{ marginTop: spacing(2) }}>
                <Ionicons name="star" size={14} color={colors.star} />
                <Text style={[font.small, { fontWeight: '700', color: colors.text }]}>
                  {p.rating.toFixed(1).replace('.', ',')}
                </Text>
                <Text style={[font.small, { color: colors.textFaint }]}>({p.reviewCount})</Text>
              </Row>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: colors.brand }}>{brlShort(p.dailyRate)}</Text>
              <Text style={font.tiny}>/diária</Text>
            </View>
          </Row>

          <Row gap={2.5} style={{ marginTop: spacing(5) }}>
            <Metric icone="briefcase-outline" valor={String(p.jobsDone)} label="Serviços" />
            <Metric icone="calendar-outline" valor={`${p.yearsOnApp} ${p.yearsOnApp === 1 ? 'ano' : 'anos'}`} label="No app" />
            <Metric icone="flash-outline" valor="ativo" label={p.responseTime} tone={colors.success} />
          </Row>

          <SectionHead title="Sobre" />
          <Text style={[font.body, { lineHeight: 22, color: colors.textMuted }]}>{p.bio}</Text>

          <SectionHead title="Detalhes do serviço" />
          <View style={s.detalhes}>
            <DashedRow label="Distância" value={`${p.distanceKm.toString().replace('.', ',')} km de você`} />
            <DashedRow label="Nível no Chama" value={cap(flameLabel[p.flame])} tone={colors.brand} />
            <DashedRow label="Verificação" value={p.verified ? 'documentos ok' : 'em análise'} tone={p.verified ? colors.success : colors.warning} />
            <DashedRow label="Resposta" value={p.responseTime} />
            <DashedRow label="Cancelamento" value="grátis até 24h antes" />
          </View>

          <SectionHead title="Fotos dos trabalhos" action="Ver todas" onAction={() => router.push(`/cliente/fotos?id=${p.id}`)} />
          <Row gap={2.5}>
            {[0, 1, 2].map((i) => (
              <Pressable key={i} style={{ flex: 1 }} onPress={() => router.push(`/cliente/fotos?id=${p.id}`)}>
                <Image source={categoryPhoto(p.categoryId)} style={s.miniFoto} resizeMode="cover" />
              </Pressable>
            ))}
          </Row>

          <SectionHead title="O que dizem" action={`Ver as ${p.reviewCount}`} onAction={() => router.push(`/cliente/avaliacoes?id=${p.id}`)} />
          {p.reviews.slice(0, 2).map((r) => (
            <View key={r.id} style={s.review}>
              <Row gap={2.5}>
                <View style={s.revAv}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted }}>{r.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{r.author}</Text>
                  <Row gap={0} style={{ marginTop: 2 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Ionicons key={i} name={r.stars >= i ? 'star' : 'star-outline'} size={11} color={colors.star} />
                    ))}
                    <Text style={[font.tiny, { marginLeft: 5 }]}>{r.when}</Text>
                  </Row>
                </View>
              </Row>
              <Text style={[font.body, { marginTop: spacing(2.5), lineHeight: 21 }]}>{r.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={s.barra}>
        <Pressable onPress={() => router.push(`/cliente/chat/${p.id}`)} style={s.chatBtn}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.brand} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={font.tiny}>Total estimado</Text>
          <Text style={{ fontSize: 19, fontWeight: '800', color: colors.text }}>{brl(p.dailyRate + taxa)}</Text>
        </View>
        <Pressable style={s.cta} onPress={contratar}>
          <Ionicons name="flame" size={18} color={colors.onBrand} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.onBrand }}>Contratar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Metric({ icone, valor, label, tone }: { icone: any; valor: string; label: string; tone?: string }) {
  return (
    <View style={s.metric}>
      <Ionicons name={icone} size={17} color={tone ?? colors.brand} />
      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginTop: spacing(1.5) }}>{valor}</Text>
      <Text style={[font.tiny, { fontSize: 10.5, textAlign: 'center' }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  capa: { width: '100%', height: 250 },
  capaTopo: { position: 'absolute', left: 0, right: 0, top: 0 },
  capaBtn: {
    width: 42, height: 42, borderRadius: radius.round, backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
  },
  folha: {
    backgroundColor: colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -28, paddingHorizontal: PAD, paddingTop: spacing(5),
  },
  avatar: {
    width: 62, height: 62, borderRadius: radius.card, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.brand,
  },
  verif: {
    position: 'absolute', right: -3, bottom: -3, width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.info, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.bg,
  },
  metric: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    paddingVertical: spacing(3.5), paddingHorizontal: spacing(1), alignItems: 'center',
  },
  detalhes: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    paddingHorizontal: spacing(4), paddingVertical: spacing(2),
  },
  miniFoto: { width: '100%', height: 92, borderRadius: radius.lg },
  review: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
    padding: spacing(4), marginBottom: spacing(3),
  },
  revAv: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  barra: {
    position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row',
    alignItems: 'center', gap: spacing(3), backgroundColor: colors.bg,
    paddingHorizontal: PAD, paddingTop: spacing(3.5), paddingBottom: spacing(7),
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  chatBtn: {
    width: 52, height: 52, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing(2),
    backgroundColor: colors.brand, borderRadius: radius.lg, height: 52, paddingHorizontal: spacing(6),
  },
});
