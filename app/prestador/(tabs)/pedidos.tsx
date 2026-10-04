import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { colors, spacing } from '@/theme';
import { useApp } from '@/store/app';
import { Header, Chip, EmptyState, Row } from '@/components/ui';
import { OrderCard } from '@/components/domain';

const FILTROS = [
  { key: 'novos', label: 'Novos' },
  { key: 'ativos', label: 'Em andamento' },
  { key: 'concluidos', label: 'Concluídos' },
  { key: 'todos', label: 'Todos' },
] as const;

/** Tela 45 — histórico de pedidos do prestador. */
export default function PedidosPrestador() {
  const { providerOrders } = useApp();
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]['key']>('novos');

  const lista = providerOrders.filter((o) => {
    if (filtro === 'novos') return o.status === 'aguardando';
    if (filtro === 'ativos') return ['aceito', 'em_andamento', 'aguardando_confirmacao'].includes(o.status);
    if (filtro === 'concluidos') return ['concluido', 'avaliado'].includes(o.status);
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="Meus pedidos" subtitle={`${providerOrders.length} no total`} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ padding: spacing(4), gap: spacing(2) }}>
        {FILTROS.map((f) => (
          <Chip key={f.key} label={f.label} active={filtro === f.key} onPress={() => setFiltro(f.key)} />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing(4), paddingBottom: spacing(8) }} showsVerticalScrollIndicator={false}>
        {lista.length === 0 ? (
          <EmptyState
            icon="briefcase-outline"
            title="Nada nesta aba"
            body="Quando um cliente agendar com você, o pedido aparece aqui."
          />
        ) : (
          lista.map((o) => <OrderCard key={o.id} order={o} perspective="prestador" />)
        )}
      </ScrollView>
    </View>
  );
}
