import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { useApp } from '@/store/app';
import { Header, EmptyState, Button, Row, Chip } from '@/components/ui';
import { OrderCard } from '@/components/domain';

const ATIVOS = ['aguardando', 'aceito', 'em_andamento', 'aguardando_confirmacao'];

/** Tela 26 — meus agendamentos, aba Agenda. */
export default function Agenda() {
  const { orders } = useApp();
  const [aba, setAba] = useState<'proximos' | 'anteriores'>('proximos');

  const proximos = orders.filter((o) => ATIVOS.includes(o.status));
  const anteriores = orders.filter((o) => !ATIVOS.includes(o.status));
  const lista = aba === 'proximos' ? proximos : anteriores;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="Minha agenda" subtitle={`${proximos.length} serviço(s) a caminho`} />

      <Row gap={2} style={{ padding: spacing(4), paddingBottom: spacing(2) }}>
        <Chip label={`Próximos (${proximos.length})`} active={aba === 'proximos'} onPress={() => setAba('proximos')} />
        <Chip label={`Anteriores (${anteriores.length})`} active={aba === 'anteriores'} onPress={() => setAba('anteriores')} />
      </Row>

      <ScrollView contentContainerStyle={{ padding: spacing(4), paddingTop: spacing(2) }} showsVerticalScrollIndicator={false}>
        {lista.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title={aba === 'proximos' ? 'nada agendado ainda' : 'nenhum serviço anterior'}
            body={
              aba === 'proximos'
                ? 'Quando você agendar um serviço, ele aparece aqui com data, hora e o status do pedido.'
                : 'Serviços concluídos e cancelados ficam guardados aqui.'
            }
            action={aba === 'proximos' ? <Button label="Encontrar um profissional" onPress={() => router.push('/cliente/(tabs)')} /> : undefined}
          />
        ) : (
          lista.map((o) => <OrderCard key={o.id} order={o} />)
        )}
      </ScrollView>
    </View>
  );
}
