import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, brl, brlShort, cap} from '@/theme';
import { providers, scheduleDays, monthLabel, SERVICE_FEE_RATE } from '@/data/mock';
import { useApp } from '@/store/app';
import {
  Avatar, BackHeader, BottomBar, Button, Card, Divider,
  EmptyState, MoneyRow, Row, Screen,
} from '@/components/ui';

/** Tela 16 — escolher dia, horário e endereço do serviço. */
export default function Agendar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addresses, draft, setDraft } = useApp();
  const p = providers.find((x) => x.id === id);

  const enderecoAtual = addresses.find((a) => a.id === draft.addressId)
    ?? addresses.find((a) => a.isDefault)
    ?? addresses[0];

  const [dia, setDia] = useState(draft.isoDate ?? scheduleDays[3].iso);
  const [hora, setHora] = useState<string | undefined>(draft.time);

  if (!p) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Agendar" />
        <EmptyState icon="calendar-outline" title="Profissional não encontrado" />
      </View>
    );
  }

  const taxa = Math.round(p.dailyRate * SERVICE_FEE_RATE * 100) / 100;
  const total = p.dailyRate + taxa;
  const podeSeguir = Boolean(dia && hora);

  const seguir = () => {
    const d = scheduleDays.find((x) => x.iso === dia)!;
    const mes = monthLabel[d.iso.split('-')[1]];
    setDraft({
      providerId: p.id,
      isoDate: dia,
      dateLabel: `${d.weekday}, ${d.day} de ${mes}`,
      time: hora,
      addressId: enderecoAtual?.id,
    });
    router.push('/cliente/pagamento');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Agendar" />

      <Screen scroll>
        <Card style={{ marginTop: spacing(4), backgroundColor: colors.surface, borderColor: colors.surface }}>
          <Row gap={3}>
            <Avatar initials={p.initials} size={42} flame={p.flame} />
            <View style={{ flex: 1 }}>
              <Text style={font.bodyStrong}>{p.name}</Text>
              <Text style={[font.small, { marginTop: 2 }]}>
                {cap(p.categoryName)} · {brlShort(p.dailyRate)}/diária
              </Text>
            </View>
          </Row>
        </Card>

        <Text style={[font.h3, { marginTop: spacing(6), marginBottom: spacing(3) }]}>Escolha o dia</Text>
        <Row gap={2} style={{ flexWrap: 'wrap' }}>
          {scheduleDays.map((d) => {
            const ativo = dia === d.iso;
            return (
              <Pressable key={d.iso} onPress={() => setDia(d.iso)} style={[s.day, ativo && s.dayActive]}>
                <Text style={[font.tiny, ativo && { color: 'rgba(255,255,255,0.85)' }]}>{d.weekday}</Text>
                <Text style={[s.dayNum, ativo && { color: colors.onBrand }]}>{d.day}</Text>
              </Pressable>
            );
          })}
        </Row>

        <Text style={[font.h3, { marginTop: spacing(6), marginBottom: spacing(3) }]}>Escolha o horário</Text>
        <Row gap={2} style={{ flexWrap: 'wrap' }}>
          {p.availableHours.map((h) => {
            const ativo = hora === h;
            return (
              <Pressable key={h} onPress={() => setHora(h)} style={[s.hour, ativo && s.dayActive]}>
                <Text style={[font.bodyStrong, ativo && { color: colors.onBrand }]}>{h}</Text>
              </Pressable>
            );
          })}
        </Row>

        <Pressable style={s.addressRow} onPress={() => router.push('/cliente/escolher-endereco')}>
          <Ionicons name="location-outline" size={17} color={colors.textMuted} />
          <Text style={font.small}>No seu endereço ·</Text>
          <Text style={[font.small, { fontWeight: '700', color: colors.text, flex: 1 }]} numberOfLines={1}>
            {enderecoAtual ? enderecoAtual.city : 'escolher endereço'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
        </Pressable>

        <Card style={{ marginTop: spacing(5), backgroundColor: colors.surface, borderColor: colors.surface }}>
          <MoneyRow label="Diária" value={brl(p.dailyRate)} />
          <MoneyRow label="Taxa de serviço" value={brl(taxa)} />
          <Divider />
          <MoneyRow label="Total" value={brl(total)} strong />
        </Card>
      </Screen>

      <BottomBar>
        <Button label="Confirmar agendamento" onPress={seguir} disabled={!podeSeguir} />
        {!podeSeguir && (
          <Text style={[font.tiny, { textAlign: 'center' }]}>Escolha o dia e o horário para continuar</Text>
        )}
      </BottomBar>
    </View>
  );
}

const s = StyleSheet.create({
  day: {
    width: 54, height: 62, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
  dayActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  dayNum: { fontSize: 18, fontWeight: '700', color: colors.text },
  hour: {
    minWidth: 92, height: 50, paddingHorizontal: spacing(4), borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  addressRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(2),
    marginTop: spacing(5), paddingVertical: spacing(3),
  },
});
