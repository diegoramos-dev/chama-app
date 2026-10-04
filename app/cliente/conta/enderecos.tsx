import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing, cap} from '@/theme';
import { useApp } from '@/store/app';
import { BackHeader, Button, Card, EmptyState, Row, Screen } from '@/components/ui';

/** Tela 31 — meus endereços. */
export default function Enderecos() {
  const { addresses, removeAddress, setDefaultAddress } = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Meus endereços" />
      <Screen scroll>
        {addresses.length === 0 ? (
          <EmptyState
            icon="location-outline"
            title="Nenhum endereço salvo"
            body="Cadastre onde você quer receber os serviços."
            action={<Button label="Adicionar endereço" onPress={() => router.push('/cliente/conta/endereco-form')} />}
          />
        ) : (
          <View style={{ marginTop: spacing(4), gap: spacing(3) }}>
            {addresses.map((a) => (
              <Card key={a.id}>
                <Row gap={3}>
                  <Ionicons name="location-outline" size={21} color={colors.brand} />
                  <View style={{ flex: 1 }}>
                    <Row gap={2}>
                      <Text style={font.bodyStrong}>{cap(a.label)}</Text>
                      {a.isDefault && <Text style={[font.tiny, { color: colors.brand, fontWeight: '700' }]}>Padrão</Text>}
                    </Row>
                    <Text style={[font.small, { marginTop: 3 }]}>{a.street}</Text>
                    <Text style={font.small}>{a.detail} · {a.city}</Text>
                  </View>
                </Row>

                <Row gap={4} style={{ marginTop: spacing(3.5) }}>
                  <Pressable onPress={() => router.push(`/cliente/conta/endereco-form?id=${a.id}`)}>
                    <Text style={[font.small, { color: colors.brand, fontWeight: '700' }]}>Editar</Text>
                  </Pressable>
                  {!a.isDefault && (
                    <>
                      <Pressable onPress={() => setDefaultAddress(a.id)}>
                        <Text style={[font.small, { color: colors.brand, fontWeight: '700' }]}>Tornar padrão</Text>
                      </Pressable>
                      <Pressable onPress={() => removeAddress(a.id)}>
                        <Text style={[font.small, { color: colors.danger, fontWeight: '700' }]}>Remover</Text>
                      </Pressable>
                    </>
                  )}
                </Row>
              </Card>
            ))}
          </View>
        )}

        <Button
          label="Adicionar endereço"
          variant="secondary"
          icon="add"
          style={{ marginTop: spacing(5) }}
          onPress={() => router.push('/cliente/conta/endereco-form')}
        />
      </Screen>
    </View>
  );
}
