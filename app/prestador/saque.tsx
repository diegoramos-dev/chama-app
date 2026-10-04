import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing, brl, cap} from '@/theme';
import { currentProvider } from '@/data/mock';
import { useApp } from '@/store/app';
import {
  BackHeader, BottomBar, Button, Card, Divider, EmptyState,
  Field, MoneyRow, Notice, Row, Screen, SectionTitle,
} from '@/components/ui';

const TIPOS_CHAVE = ['CPF', 'celular', 'e-mail', 'aleatória'];

/** Tela 47 — saque do saldo via Pix. */
export default function Saque() {
  const { earnings, withdraw } = useApp();
  const disponivel = earnings.filter((e) => e.status === 'disponivel').reduce((t, e) => t + e.net, 0);

  const [tipoChave, setTipoChave] = useState('CPF');
  const [chave, setChave] = useState(currentProvider.phone);
  const [feito, setFeito] = useState(false);

  if (feito) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Saque solicitado" />
        <Screen scroll>
          <EmptyState
            icon="checkmark-circle-outline"
            title="Dinheiro a caminho"
            body={`${brl(disponivel)} foi enviado para a chave ${tipoChave} ${chave}. Costuma cair na hora, mas pode levar até 1 dia útil.`}
            action={<Button label="Voltar aos ganhos" onPress={() => router.replace('/prestador/(tabs)/ganhos')} />}
          />
        </Screen>
      </View>
    );
  }

  if (disponivel <= 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Sacar" />
        <Screen scroll>
          <EmptyState
            icon="wallet-outline"
            title="Nenhum saldo disponível"
            body="Valores de serviços recém-concluídos ficam pendentes até o cliente confirmar a conclusão."
            action={<Button label="Voltar" variant="secondary" onPress={() => router.back()} />}
          />
        </Screen>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Sacar via Pix" />
      <Screen scroll>
        <Card style={{ marginTop: spacing(4), alignItems: 'center', backgroundColor: colors.successWash, borderColor: colors.successWash }}>
          <Text style={font.small}>Disponível para saque</Text>
          <Text style={{ fontSize: 34, fontWeight: '700', color: colors.success, marginTop: spacing(1) }}>
            {brl(disponivel)}
          </Text>
        </Card>

        <SectionTitle>Para qual chave Pix?</SectionTitle>
        <Row gap={2} style={{ flexWrap: 'wrap', marginBottom: spacing(4) }}>
          {TIPOS_CHAVE.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTipoChave(t)}
              style={{
                paddingHorizontal: spacing(3.5), paddingVertical: spacing(2), borderRadius: 999,
                borderWidth: 1,
                borderColor: tipoChave === t ? colors.brand : colors.border,
                backgroundColor: tipoChave === t ? colors.brand : colors.bg,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: tipoChave === t ? colors.onBrand : colors.text }}>{cap(t)}</Text>
            </Pressable>
          ))}
        </Row>

        <Field label={`Chave ${tipoChave}`} value={chave} onChangeText={setChave} placeholder="Digite sua chave" />

        <SectionTitle>Resumo</SectionTitle>
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.surface }}>
          <MoneyRow label="Valor do saque" value={brl(disponivel)} />
          <MoneyRow label="Taxa de saque" value="grátis" />
          <Divider />
          <MoneyRow label="Você recebe" value={brl(disponivel)} strong />
        </Card>

        <View style={{ marginTop: spacing(5) }}>
          <Notice tone="info" icon="flash-outline">
            Saques são gratuitos e ilimitados. O dinheiro costuma cair na hora, mas pode levar até 1 dia útil.
          </Notice>
        </View>
      </Screen>

      <BottomBar>
        <Button
          label={`Sacar ${brl(disponivel)}`}
          onPress={() => { withdraw(disponivel); setFeito(true); }}
          disabled={chave.trim().length < 5}
        />
      </BottomBar>
    </View>
  );
}
