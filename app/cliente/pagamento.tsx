import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/theme';
import { useApp } from '@/store/app';
import {
  BackHeader, BottomBar, Button, Card, Notice, Row, Screen,
} from '@/components/ui';

/** Tela 18 — escolher a forma de pagamento do pedido. */
export default function Pagamento() {
  const { payments, draft, setDraft, placeOrder } = useApp();
  const [selecionado, setSelecionado] = useState(
    draft.paymentMethodId ?? payments.find((p) => p.isDefault)?.id ?? payments[0]?.id,
  );

  const confirmar = () => {
    setDraft({ paymentMethodId: selecionado });
    const pedido = placeOrder();
    router.replace(`/cliente/confirmacao?orderId=${pedido.id}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Forma de pagamento" />
      <Screen scroll>
        <Text style={[font.h3, { marginTop: spacing(4), marginBottom: spacing(3) }]}>Cartões salvos</Text>

        <View style={{ gap: spacing(3) }}>
          {payments.map((pm) => {
            const ativo = selecionado === pm.id;
            return (
              <Card key={pm.id} onPress={() => setSelecionado(pm.id)} style={ativo && s.ativo}>
                <Row gap={3}>
                  <Ionicons
                    name={pm.kind === 'pix' ? 'qr-code-outline' : 'card-outline'}
                    size={22}
                    color={ativo ? colors.brand : colors.textMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={font.bodyStrong}>
                      {pm.kind === 'pix' ? 'Pix' : `${pm.brand} •••• ${pm.last4}`}
                    </Text>
                    <Text style={[font.small, { marginTop: 2 }]}>
                      {pm.kind === 'pix' ? pm.note : `Vence ${pm.expiry}`}
                    </Text>
                  </View>
                  <Ionicons
                    name={ativo ? 'radio-button-on' : 'radio-button-off'}
                    size={21}
                    color={ativo ? colors.brand : colors.textFaint}
                  />
                </Row>
              </Card>
            );
          })}
        </View>

        <Button
          label="Adicionar cartão"
          variant="secondary"
          icon="add"
          style={{ marginTop: spacing(4) }}
          onPress={() => router.push('/cliente/adicionar-cartao')}
        />

        <View style={{ marginTop: spacing(5) }}>
          <Notice tone="warning" icon="lock-closed-outline">
            pagamento protegido. o valor fica retido até o serviço terminar.
          </Notice>
        </View>
      </Screen>

      <BottomBar>
        <Button label="Usar esta forma" onPress={confirmar} disabled={!selecionado} />
      </BottomBar>
    </View>
  );
}

const s = StyleSheet.create({
  ativo: { borderColor: colors.brand, borderWidth: 1.5 },
});
