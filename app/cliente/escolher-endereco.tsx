import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, cap} from '@/theme';
import { useApp } from '@/store/app';
import { BackHeader, Button, Card, Row, Screen, EmptyState } from '@/components/ui';

/** Tela 17 — escolher onde o serviço vai acontecer. */
export default function EscolherEndereco() {
  const { addresses, draft, setDraft } = useApp();
  const selecionado = draft.addressId ?? addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id;

  const escolher = (id: string) => {
    setDraft({ addressId: id });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Onde vai ser?" />
      <Screen scroll>
        {addresses.length === 0 ? (
          <EmptyState
            icon="location-outline"
            title="Nenhum endereço salvo"
            body="Cadastre um endereço para o profissional saber onde te encontrar."
            action={<Button label="Adicionar endereço" onPress={() => router.push('/cliente/conta/endereco-form')} />}
          />
        ) : (
          <View style={{ marginTop: spacing(4), gap: spacing(3) }}>
            {addresses.map((a) => {
              const ativo = selecionado === a.id;
              return (
                <Card key={a.id} onPress={() => escolher(a.id)} style={ativo && s.ativo}>
                  <Row gap={3}>
                    <Ionicons
                      name={ativo ? 'radio-button-on' : 'radio-button-off'}
                      size={21}
                      color={ativo ? colors.brand : colors.textFaint}
                    />
                    <View style={{ flex: 1 }}>
                      <Row gap={2}>
                        <Text style={font.bodyStrong}>{cap(a.label)}</Text>
                        {a.isDefault && (
                          <Text style={[font.tiny, { color: colors.brand, fontWeight: '700' }]}>Padrão</Text>
                        )}
                      </Row>
                      <Text style={[font.small, { marginTop: 3 }]}>{a.street}</Text>
                      <Text style={font.small}>{a.detail} · {a.city}</Text>
                    </View>
                  </Row>
                </Card>
              );
            })}
          </View>
        )}

        <Button
          label="Adicionar outro endereço"
          variant="secondary"
          icon="add"
          style={{ marginTop: spacing(5) }}
          onPress={() => router.push('/cliente/conta/endereco-form')}
        />
      </Screen>
    </View>
  );
}

const s = StyleSheet.create({
  ativo: { borderColor: colors.brand, borderWidth: 1.5, backgroundColor: colors.brandWash },
});
