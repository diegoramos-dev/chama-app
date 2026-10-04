import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@/theme';
import { useApp } from '@/store/app';
import { BackHeader, Button, Chip, EmptyState, Row } from '@/components/ui';
import { OrderCard } from '@/components/domain';

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'ativos', label: 'Em andamento' },
  { key: 'concluidos', label: 'Concluídos' },
  { key: 'cancelados', label: 'Cancelados' },
] as const;

const ATIVOS = ['aguardando', 'aceito', 'em_andamento', 'aguardando_confirmacao', 'disputa'];

/** Tela 29 — histórico completo de pedidos. */
export default function Pedidos() {
  const { orders } = useApp();
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]['key']>('todos');

  const lista = orders.filter((o) => {
    if (filtro === 'ativos') return ATIVOS.includes(o.status);
    if (filtro === 'concluidos') return o.status === 'concluido' || o.status === 'avaliado';
    if (filtro === 'cancelados') return o.status === 'cancelado';
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Meus pedidos" subtitle={`${orders.length} no total`} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ padding: spacing(4), gap: spacing(2) }}>
        {FILTROS.map((f) => (
          <Chip key={f.key} label={f.label} active={filtro === f.key} onPress={() => setFiltro(f.key)} />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing(4), paddingBottom: spacing(8) }} showsVerticalScrollIndicator={false}>
        {lista.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title="Nenhum pedido por aqui"
            body="Assim que você contratar alguém, o pedido aparece nesta lista."
            action={<Button label="Encontrar um profissional" onPress={() => router.push('/cliente/(tabs)')} />}
          />
        ) : (
          lista.map((o) => <OrderCard key={o.id} order={o} />)
        )}
      </ScrollView>
    </View>
  );
}
