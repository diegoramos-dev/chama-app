import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, cap} from '@/theme';
import { categories, currentUser, providers } from '@/data/mock';
import { useApp } from '@/store/app';
import {
  WelcomeHeader, PromoBanner, SearchRow, SectionHead,
  CategoryGridItem, ServiceCard, PostRequestCard,
} from '@/components/blocks';

const PAD = spacing(4.5);

/** Tela 6 — home do cliente. */
export default function Home() {
  const { notifications } = useApp();
  const naoLidas = notifications.filter((n) => !n.read && n.audience === 'cliente').length;

  const seis = categories.slice(0, 6);
  const destaques = providers.filter((p) => p.bestOption).slice(0, 5);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }} />

      <ScrollView contentContainerStyle={{ paddingBottom: spacing(8) }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: PAD, paddingTop: spacing(2) }}>
          <WelcomeHeader
            nome={currentUser.name.split(' ')[0]}
            iniciais={currentUser.initials}
            naoLidas={naoLidas}
            onSino={() => router.push('/cliente/conta/notificacoes')}
          />

          <PromoBanner onPress={() => router.push('/cliente/conta/ajuda')} />

          <View style={{ marginTop: spacing(5) }}>
            <SearchRow local={currentUser.city} onBuscar={() => router.push('/cliente/busca')} />
          </View>

          <SectionHead
            title="Categorias"
            action="Ver todas"
            onAction={() => router.push('/cliente/categorias')}
          />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2.5) }}>
            {seis.map((c, i) => (
              <CategoryGridItem
                key={c.id}
                id={c.id}
                nome={cap(c.name)}
                destaque={i === 0}
                onPress={() => router.push(`/cliente/resultados?categoria=${c.id}`)}
              />
            ))}
          </View>

          <SectionHead
            title="Mais chamados"
            action="Ver todos"
            onAction={() => router.push('/cliente/resultados?categoria=churrasqueiro')}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: PAD, gap: spacing(3.5), paddingVertical: spacing(1) }}
        >
          {destaques.map((p) => (
            <ServiceCard
              key={p.id}
              provider={p}
              onPress={() => router.push(`/cliente/prestador/${p.id}`)}
            />
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: PAD }}>
          <PostRequestCard onPress={() => router.push('/cliente/lista-espera?categoria=pintor')} />
        </View>
      </ScrollView>
    </View>
  );
}
