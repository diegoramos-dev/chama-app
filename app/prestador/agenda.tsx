import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, cap} from '@/theme';
import { scheduleDays } from '@/data/mock';
import { useApp } from '@/store/app';
import { BackHeader, Card, Notice, Row, Screen, SectionTitle, Chip } from '@/components/ui';

const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

/** Tela 48 — agenda e disponibilidade do prestador. */
export default function AgendaPrestador() {
  const { providerOrders } = useApp();
  const [dia, setDia] = useState(scheduleDays[0].iso);
  const [livres, setLivres] = useState<string[]>(['09:00', '10:00', '11:00', '14:00', '16:00']);

  const alternar = (h: string) =>
    setLivres((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]));

  const doDia = providerOrders.filter(
    (o) => o.isoDate === dia && ['aceito', 'em_andamento'].includes(o.status),
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Minha agenda" subtitle="Marque os horários em que você atende" />
      <Screen scroll>
        <Row gap={2} style={{ flexWrap: 'wrap', marginTop: spacing(4) }}>
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

        {doDia.length > 0 && (
          <>
            <SectionTitle>Já agendado neste dia</SectionTitle>
            {doDia.map((o) => (
              <Card key={o.id} style={{ marginBottom: spacing(2.5), backgroundColor: colors.brandWash, borderColor: colors.brandLight }}>
                <Row gap={3}>
                  <Ionicons name="calendar" size={19} color={colors.brand} />
                  <View style={{ flex: 1 }}>
                    <Text style={font.bodyStrong}>{o.time} · {o.providerName}</Text>
                    <Text style={[font.small, { marginTop: 2 }]}>{cap(o.categoryName)}</Text>
                  </View>
                </Row>
              </Card>
            ))}
          </>
        )}

        <SectionTitle>Horários que você atende</SectionTitle>
        <Row gap={2} style={{ flexWrap: 'wrap' }}>
          {HORARIOS.map((h) => {
            const ocupado = doDia.some((o) => o.time === h);
            return (
              <Chip
                key={h}
                label={ocupado ? `${h} · ocupado` : h}
                active={!ocupado && livres.includes(h)}
                tone={ocupado ? 'warning' : 'neutral'}
                onPress={ocupado ? undefined : () => alternar(h)}
              />
            );
          })}
        </Row>

        <View style={{ marginTop: spacing(6) }}>
          <Notice tone="info" icon="bulb-outline">
            Quanto mais horários abertos, mais pedidos você recebe. Horários já agendados ficam bloqueados
            automaticamente para os clientes.
          </Notice>
        </View>
      </Screen>
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
});
