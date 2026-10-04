import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing, cap} from '@/theme';
import { useApp } from '@/store/app';
import { BackHeader, BottomBar, Button, Chip, Field, Row, Screen } from '@/components/ui';

const APELIDOS = ['casa', 'trabalho', 'outro'];

/** Tela 32 — adicionar ou editar endereço. */
export default function EnderecoForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { addresses, addAddress, updateAddress } = useApp();
  const existente = addresses.find((a) => a.id === id);

  const [label, setLabel] = useState(existente?.label ?? 'casa');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState(existente?.street ?? '');
  const [detail, setDetail] = useState(existente?.detail ?? '');
  const [city, setCity] = useState(existente?.city ?? '');
  const [padrao, setPadrao] = useState(existente?.isDefault ?? false);

  const valido = street.trim().length > 4 && city.trim().length > 2;

  const salvar = () => {
    if (existente) {
      updateAddress(existente.id, { label, street, detail, city, isDefault: padrao });
    } else {
      addAddress({ label, street, detail, city, isDefault: padrao });
    }
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title={existente ? 'editar endereço' : 'novo endereço'} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Screen scroll>
          <Text style={[font.small, { marginTop: spacing(5), marginBottom: spacing(2), fontWeight: '600', color: colors.text }]}>
            como você chama esse lugar?
          </Text>
          <Row gap={2} style={{ marginBottom: spacing(5) }}>
            {APELIDOS.map((a) => (
              <Chip key={a} label={cap(a)} active={label === a} onPress={() => setLabel(a)} />
            ))}
          </Row>

          <Field label="CEP" value={cep} onChangeText={(t) => setCep(t.replace(/\D/g, '').slice(0, 8))} placeholder="00000-000" keyboardType="numeric" hint="Mock: preencha os campos abaixo à mão" />
          <Field label="Rua e número" value={street} onChangeText={setStreet} placeholder="Rua Exemplo, 100" />
          <Field label="Complemento" value={detail} onChangeText={setDetail} placeholder="Apto, bloco, referência" />
          <Field label="Bairro e cidade" value={city} onChangeText={setCity} placeholder="Vila Mariana, SP" />

          <Pressable onPress={() => setPadrao(!padrao)}>
            <Row gap={2.5}>
              <Ionicons name={padrao ? 'checkbox' : 'square-outline'} size={22} color={padrao ? colors.brand : colors.textFaint} />
              <Text style={font.body}>Usar como endereço padrão</Text>
            </Row>
          </Pressable>
        </Screen>
      </KeyboardAvoidingView>

      <BottomBar>
        <Button label="Salvar endereço" onPress={salvar} disabled={!valido} />
      </BottomBar>
    </View>
  );
}
