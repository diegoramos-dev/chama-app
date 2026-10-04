import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { colors, font, radius, spacing, brlShort, cap} from '@/theme';
import { categories, currentUser, providers } from '@/data/mock';
import { categoryPhoto } from '@/data/assets';
import { Button, Chip, Row, Sheet } from '@/components/ui';
import { SubChip } from '@/components/blocks';

const PAD = spacing(4.5);

type Ordem = 'melhor' | 'proximos' | 'baratos' | 'notas';

const FILTROS: { key: Ordem; label: string; icon?: any }[] = [
  { key: 'melhor', label: 'Melhor opção', icon: 'flame' },
  { key: 'proximos', label: 'Mais próximos' },
  { key: 'baratos', label: 'Mais baratos' },
  { key: 'notas', label: 'Melhores notas' },
];

/** Tela 9 — resultados da busca. */
export default function Resultados() {
  const { categoria } = useLocalSearchParams<{ categoria?: string }>();
  const [ativa, setAtiva] = useState(categoria ?? '');
  const [ordem, setOrdem] = useState<Ordem>('melhor');
  const [termo, setTermo] = useState('');

  // filtros do painel
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [precoMax, setPrecoMax] = useState<number | null>(null);
  const [distMax, setDistMax] = useState<number | null>(null);
  const [notaMin, setNotaMin] = useState<number | null>(null);
  const [soVerificados, setSoVerificados] = useState(false);

  const filtrosAtivos =
    (precoMax ? 1 : 0) + (distMax ? 1 : 0) + (notaMin ? 1 : 0) + (soVerificados ? 1 : 0);

  const limparFiltros = () => {
    setPrecoMax(null); setDistMax(null); setNotaMin(null); setSoVerificados(false);
  };

  const cat = categories.find((c) => c.id === ativa);

  const encontrados = useMemo(() => {
    const base = providers.filter((p) =>
      (!ativa || p.categoryId === ativa) &&
      p.name.toLowerCase().includes(termo.toLowerCase().trim()) &&
      (precoMax === null || p.dailyRate <= precoMax) &&
      (distMax === null || p.distanceKm <= distMax) &&
      (notaMin === null || p.rating >= notaMin) &&
      (!soVerificados || p.verified),
    );
    const copia = [...base];
    switch (ordem) {
      case 'proximos': return copia.sort((a, b) => a.distanceKm - b.distanceKm);
      case 'baratos': return copia.sort((a, b) => a.dailyRate - b.dailyRate);
      case 'notas': return copia.sort((a, b) => b.rating - a.rating);
      default:
        return copia.sort((a, b) => (b.rating * 2 - b.distanceKm * 0.1) - (a.rating * 2 - a.distanceKm * 0.1));
    }
  }, [ativa, ordem, termo, precoMax, distMax, notaMin, soVerificados]);

  // Chama triste só quando não há ninguém na categoria — não quando o filtro zerou a lista.
  if (encontrados.length === 0 && !termo && filtrosAtivos === 0) {
    return <Redirect href={`/cliente/sem-profissional?categoria=${ativa}`} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }} />

      <View style={{ paddingHorizontal: PAD, paddingTop: spacing(2) }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Pressable onPress={() => router.back()} style={s.circleBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>
              {cat ? cap(cat.name) : 'Profissionais'}
            </Text>
            <Text style={[font.tiny, { marginTop: 1 }]}>perto de {currentUser.city}</Text>
          </View>
          <Pressable style={[s.circleBtn, { backgroundColor: colors.brand }]} onPress={() => setFiltroAberto(true)}>
            <Ionicons name="options-outline" size={19} color={colors.onBrand} />
            {filtrosAtivos > 0 && (
              <View style={s.filtroBadge}>
                <Text style={s.filtroBadgeTxt}>{filtrosAtivos}</Text>
              </View>
            )}
          </Pressable>
        </Row>

        <Row gap={2.5} style={s.busca}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <TextInput
            value={termo}
            onChangeText={setTermo}
            placeholder="Buscar profissional..."
            placeholderTextColor={colors.textFaint}
            style={{ flex: 1, fontSize: 14, color: colors.text }}
          />
        </Row>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing(8) }} showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: PAD, gap: spacing(3), paddingTop: spacing(5) }}
        >
          {categories.slice(0, 8).map((c) => (
            <SubChip key={c.id} id={c.id} nome={cap(c.name)} ativo={ativa === c.id} onPress={() => setAtiva(c.id)} />
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: PAD, gap: spacing(2), paddingTop: spacing(5) }}
        >
          {FILTROS.map((f) => (
            <Chip
              key={f.key}
              label={f.label}
              icon={ordem === f.key ? f.icon : undefined}
              active={ordem === f.key}
              onPress={() => setOrdem(f.key)}
            />
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: PAD, marginTop: spacing(5), gap: spacing(4) }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={font.small}>{encontrados.length} profissional(is) disponível(is)</Text>
            {filtrosAtivos > 0 && (
              <Pressable onPress={limparFiltros} hitSlop={8}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brand }}>Limpar filtros</Text>
              </Pressable>
            )}
          </Row>

          {encontrados.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing(10) }}>
              <Ionicons name="search-outline" size={34} color={colors.brandLight} />
              <Text style={[font.bodyStrong, { marginTop: spacing(3) }]}>
                {filtrosAtivos > 0 ? 'nada com esses filtros' : 'ninguém com esse nome'}
              </Text>
              {filtrosAtivos > 0 && (
                <Button
                  label="Limpar filtros"
                  variant="secondary"
                  full={false}
                  style={{ marginTop: spacing(4) }}
                  onPress={limparFiltros}
                />
              )}
            </View>
          ) : (
            encontrados.map((p) => (
              <Pressable key={p.id} style={s.card} onPress={() => router.push(`/cliente/prestador/${p.id}`)}>
                <View>
                  <Image source={categoryPhoto(p.categoryId)} style={s.cardImg} resizeMode="cover" />
                  <View style={s.tag}>
                    <Text style={s.tagTxt}>{brlShort(p.dailyRate)}</Text>
                  </View>
                  {p.bestOption && (
                    <View style={s.best}>
                      <Ionicons name="flame" size={11} color={colors.onBrand} />
                      <Text style={s.bestTxt}>Melhor opção</Text>
                    </View>
                  )}
                </View>

                <View style={{ padding: spacing(4) }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>{cap(p.categoryName)}</Text>
                  <Row gap={1} style={{ marginTop: spacing(1.5) }}>
                    <Ionicons name="star" size={13} color={colors.star} />
                    <Text style={[font.small, { fontWeight: '700', color: colors.text }]}>
                      {p.rating.toFixed(1).replace('.', ',')}
                    </Text>
                    <Text style={[font.small, { color: colors.textFaint }]}>({p.reviewCount})</Text>
                    <Text style={[font.small, { color: colors.textFaint }]}>
                      · {p.distanceKm.toString().replace('.', ',')} km
                    </Text>
                  </Row>

                  <Row gap={2.5} style={s.rodape}>
                    <View style={s.av}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.brand }}>{p.initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Row gap={1}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>{p.name}</Text>
                        {p.verified && <Ionicons name="checkmark-circle" size={13} color={colors.info} />}
                      </Row>
                      <Text style={[font.tiny, { fontSize: 11 }]}>Profissional</Text>
                    </View>
                    <Ionicons name="arrow-forward-circle" size={26} color={colors.brand} />
                  </Row>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      <Sheet
        visible={filtroAberto}
        onClose={() => setFiltroAberto(false)}
        title="Filtrar"
        subtitle={`${encontrados.length} profissional(is) com os filtros atuais`}
        footer={
          <>
            <Button label="Ver resultados" onPress={() => setFiltroAberto(false)} />
            {filtrosAtivos > 0 && <Button label="Limpar tudo" variant="ghost" onPress={limparFiltros} />}
          </>
        }
      >
        <Text style={s.grupo}>Preço máximo por diária</Text>
        <Row gap={2} style={{ flexWrap: 'wrap' }}>
          {[100, 200, 300, 500].map((v) => (
            <Chip
              key={v}
              label={`Até ${brlShort(v)}`}
              active={precoMax === v}
              onPress={() => setPrecoMax(precoMax === v ? null : v)}
            />
          ))}
        </Row>

        <Text style={s.grupo}>Distância máxima</Text>
        <Row gap={2} style={{ flexWrap: 'wrap' }}>
          {[2, 5, 10].map((v) => (
            <Chip
              key={v}
              label={`Até ${v} km`}
              active={distMax === v}
              onPress={() => setDistMax(distMax === v ? null : v)}
            />
          ))}
        </Row>

        <Text style={s.grupo}>Nota mínima</Text>
        <Row gap={2} style={{ flexWrap: 'wrap' }}>
          {[4.0, 4.5, 4.8].map((v) => (
            <Chip
              key={v}
              label={`${v.toFixed(1).replace('.', ',')}+`}
              icon="star"
              active={notaMin === v}
              onPress={() => setNotaMin(notaMin === v ? null : v)}
            />
          ))}
        </Row>

        <Text style={s.grupo}>Verificação</Text>
        <Chip
          label="Só profissionais verificados"
          icon="checkmark-circle"
          active={soVerificados}
          onPress={() => setSoVerificados(!soVerificados)}
        />
      </Sheet>
    </View>
  );
}

const s = StyleSheet.create({
  grupo: {
    fontSize: 14, fontWeight: '700', color: colors.text,
    marginTop: spacing(5), marginBottom: spacing(3),
  },
  filtroBadge: {
    position: 'absolute', top: -3, right: -3, minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4, borderWidth: 2, borderColor: colors.bg,
  },
  filtroBadgeTxt: { fontSize: 10, fontWeight: '800', color: colors.onBrand },
  circleBtn: {
    width: 42, height: 42, borderRadius: radius.round, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  busca: {
    height: 50, borderRadius: radius.lg, backgroundColor: colors.surface,
    paddingHorizontal: spacing(4), marginTop: spacing(5),
  },
  card: {
    borderRadius: radius.xl, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  cardImg: { width: '100%', height: 168 },
  tag: {
    position: 'absolute', right: spacing(3.5), bottom: spacing(3.5),
    backgroundColor: colors.brand, borderRadius: radius.pill,
    paddingHorizontal: spacing(3.5), paddingVertical: spacing(1.5),
  },
  tagTxt: { fontSize: 14, fontWeight: '800', color: colors.onBrand },
  best: {
    position: 'absolute', left: spacing(3.5), top: spacing(3.5), flexDirection: 'row',
    alignItems: 'center', gap: 4, backgroundColor: 'rgba(212,86,42,0.94)',
    borderRadius: radius.pill, paddingHorizontal: spacing(2.5), paddingVertical: spacing(1),
  },
  bestTxt: { fontSize: 10.5, fontWeight: '700', color: colors.onBrand },
  rodape: {
    marginTop: spacing(3.5), paddingTop: spacing(3.5),
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  av: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center',
  },
});
