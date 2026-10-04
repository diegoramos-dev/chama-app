import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, brl } from '@/theme';
import { COMMISSION_RATE } from '@/data/mock';
import { useApp } from '@/store/app';
import { Card, Divider, EmptyState, Header, MoneyRow, Notice, Row, SectionTitle } from '@/components/ui';

const rotuloStatus = {
  disponivel: { label: 'Disponível', color: colors.success },
  pendente: { label: 'Pendente', color: colors.warning },
  sacado: { label: 'Sacado', color: colors.textFaint },
};

/** Tela 46 — extrato de ganhos com a comissão de 2%. */
export default function Ganhos() {
  const { earnings } = useApp();

  const disponivel = earnings.filter((e) => e.status === 'disponivel').reduce((t, e) => t + e.net, 0);
  const pendente = earnings.filter((e) => e.status === 'pendente').reduce((t, e) => t + e.net, 0);
  const totalBruto = earnings.reduce((t, e) => t + e.gross, 0);
  const totalComissao = earnings.reduce((t, e) => t + e.commission, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="Ganhos" subtitle="Extrato e saques" large />

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing(4.5), paddingBottom: spacing(8) }} showsVerticalScrollIndicator={false}>
        <View style={s.saldoCard}>
          <Text style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)' }}>Saldo disponível para saque</Text>
          <Text style={s.saldo}>{brl(disponivel)}</Text>
          <Row gap={2} style={{ marginTop: spacing(2) }}>
            <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
              {brl(pendente)} aguardando confirmação
            </Text>
          </Row>

          <Pressable style={s.sacarBtn} onPress={() => router.push('/prestador/saque')}>
            <Ionicons name="cash-outline" size={17} color={colors.brand} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brand }}>Sacar via Pix</Text>
          </Pressable>
        </View>
        <Card>
          <Text style={[font.h3, { marginBottom: spacing(2) }]}>Resumo geral</Text>
          <MoneyRow label="Total faturado" value={brl(totalBruto)} />
          <MoneyRow label={`Comissão Chama (${(COMMISSION_RATE * 100).toFixed(0)}%)`} value={`- ${brl(totalComissao)}`} />
          <Divider />
          <MoneyRow label="Líquido para você" value={brl(totalBruto - totalComissao)} strong />
        </Card>

        <SectionTitle>Extrato</SectionTitle>
        {earnings.length === 0 ? (
          <EmptyState icon="cash-outline" title="Nenhum ganho ainda" body="Cada serviço concluído aparece aqui com o valor líquido." />
        ) : (
          <View style={{ gap: spacing(2.5) }}>
            {earnings.map((e) => {
              const st = rotuloStatus[e.status];
              return (
                <Card key={e.id}>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={font.bodyStrong} numberOfLines={1}>{e.label}</Text>
                      <Text style={[font.small, { marginTop: 2 }]}>{e.date}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[font.bodyStrong, { color: colors.success }]}>+ {brl(e.net)}</Text>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: st.color, marginTop: 2 }}>{st.label}</Text>
                    </View>
                  </Row>
                  <Text style={[font.tiny, { marginTop: spacing(2) }]}>
                    bruto {brl(e.gross)} · comissão {brl(e.commission)}
                  </Text>
                </Card>
              );
            })}
          </View>
        )}

        <View style={{ marginTop: spacing(5) }}>
          <Notice tone="success" icon="information-circle-outline">
            O Chama cobra {(COMMISSION_RATE * 100).toFixed(0)}% só sobre serviços concluídos. Sem mensalidade e sem taxa por orçamento.
          </Notice>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  saldoCard: {
    backgroundColor: colors.brand, borderRadius: radius.xl,
    padding: spacing(5), marginBottom: spacing(5),
  },
  saldo: { fontSize: 34, fontWeight: '800', color: colors.onBrand, marginTop: spacing(1) },
  sacarBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing(2),
    backgroundColor: colors.bg, borderRadius: radius.lg, height: 50, marginTop: spacing(4.5),
  },
});
