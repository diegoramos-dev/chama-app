import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing } from '@/theme';
import { useApp } from '@/store/app';
import { BackHeader, Button, Card, EmptyState, Notice, Row, Screen } from '@/components/ui';

/** Tela 30 — gerenciar formas de pagamento. */
export default function Pagamentos() {
  const { payments, removePayment, setDefaultPayment } = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Formas de pagamento" />
      <Screen scroll>
        {payments.length === 0 ? (
          <EmptyState
            icon="card-outline"
            title="Nenhuma forma cadastrada"
            body="Adicione um cartão para conseguir agendar serviços."
            action={<Button label="Adicionar cartão" onPress={() => router.push('/cliente/adicionar-cartao')} />}
          />
        ) : (
          <View style={{ marginTop: spacing(4), gap: spacing(3) }}>
            {payments.map((pm) => (
              <Card key={pm.id}>
                <Row gap={3}>
                  <Ionicons
                    name={pm.kind === 'pix' ? 'qr-code-outline' : 'card-outline'}
                    size={23}
                    color={colors.textMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <Row gap={2}>
                      <Text style={font.bodyStrong}>
                        {pm.kind === 'pix' ? 'Pix' : `${pm.brand} •••• ${pm.last4}`}
                      </Text>
                      {pm.isDefault && <Text style={[font.tiny, { color: colors.brand, fontWeight: '700' }]}>Padrão</Text>}
                    </Row>
                    <Text style={[font.small, { marginTop: 2 }]}>
                      {pm.kind === 'pix' ? pm.note : `Vence ${pm.expiry}`}
                    </Text>
                  </View>
                </Row>

                <Row gap={4} style={{ marginTop: spacing(3.5) }}>
                  {!pm.isDefault && (
                    <Pressable onPress={() => setDefaultPayment(pm.id)}>
                      <Text style={[font.small, { color: colors.brand, fontWeight: '700' }]}>Tornar padrão</Text>
                    </Pressable>
                  )}
                  {pm.kind === 'card' && (
                    <Pressable onPress={() => removePayment(pm.id)}>
                      <Text style={[font.small, { color: colors.danger, fontWeight: '700' }]}>Remover</Text>
                    </Pressable>
                  )}
                </Row>
              </Card>
            ))}
          </View>
        )}

        <Button
          label="Adicionar cartão"
          variant="secondary"
          icon="add"
          style={{ marginTop: spacing(5) }}
          onPress={() => router.push('/cliente/adicionar-cartao')}
        />

        <View style={{ marginTop: spacing(5) }}>
          <Notice tone="info" icon="shield-checkmark-outline">
            O valor de cada serviço fica retido e só é repassado ao profissional depois que você confirma a conclusão.
          </Notice>
        </View>
      </Screen>
    </View>
  );
}
