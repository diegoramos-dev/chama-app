import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, font, radius, spacing } from '@/theme';
import { useApp } from '@/store/app';
import {
  BackHeader, BottomBar, Button, Card, EmptyState, Field,
  Notice, Row, Screen, SectionTitle, Sheet, SheetOption, Toast, useToast,
} from '@/components/ui';
import { categoryPhoto } from '@/data/assets';
import { Ionicons } from '@expo/vector-icons';

const MOTIVOS = [
  'O profissional não apareceu',
  'O serviço não foi concluído',
  'O resultado não ficou como combinado',
  'Cobrança diferente do combinado',
  'Houve um problema de conduta',
];

/** Tela 24 — abrir disputa (um dos 3 caminhos da conclusão). */
export default function Disputa() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, disputeOrder } = useApp();
  const pedido = getOrder(id ?? '');
  const [motivo, setMotivo] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState('');
  const [aberta, setAberta] = useState(false);
  const [anexos, setAnexos] = useState<string[]>([]);
  const [sheet, setSheet] = useState(false);
  const toast = useToast();

  const anexar = (id: string) => {
    setAnexos((a) => [...a, id]);
    setSheet(false);
    toast.show('foto anexada');
  };

  if (!pedido) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Disputa" />
        <EmptyState icon="alert-circle-outline" title="Pedido não encontrado" />
      </View>
    );
  }

  if (aberta) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Disputa aberta" />
        <Screen scroll>
          <EmptyState
            icon="shield-checkmark-outline"
            title="Recebemos seu relato"
            body="O valor continua retido enquanto a gente analisa. Nossa equipe responde em até 24h pelo chat do app."
            action={<Button label="Voltar ao pedido" onPress={() => router.replace(`/cliente/pedido/${pedido.id}`)} />}
          />
        </Screen>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Algo deu errado" subtitle={`Pedido #${pedido.id}`} />
      <Screen scroll>
        <View style={{ marginTop: spacing(4) }}>
          <Notice tone="warning" icon="lock-closed-outline">
            Enquanto a disputa estiver aberta, o valor de {pedido.total.toFixed(2).replace('.', ',')} continua retido — o profissional não recebe.
          </Notice>
        </View>

        <SectionTitle>O que aconteceu?</SectionTitle>
        <View style={{ gap: spacing(2.5) }}>
          {MOTIVOS.map((m) => {
            const ativo = motivo === m;
            return (
              <Card key={m} onPress={() => setMotivo(m)} style={ativo && { borderColor: colors.brand, borderWidth: 1.5 }}>
                <Row gap={3}>
                  <Ionicons
                    name={ativo ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={ativo ? colors.brand : colors.textFaint}
                  />
                  <Text style={[font.body, { flex: 1 }]}>{m}</Text>
                </Row>
              </Card>
            );
          })}
        </View>

        <SectionTitle>Conta os detalhes</SectionTitle>
        <Field
          value={detalhe}
          onChangeText={setDetalhe}
          placeholder="Quanto mais detalhes, mais rápido a gente resolve..."
          multiline
        />

        {anexos.length > 0 && (
          <Row gap={2.5} style={{ flexWrap: 'wrap', marginBottom: spacing(3) }}>
            {anexos.map((id, i) => (
              <View key={i}>
                <Image source={categoryPhoto(id)} style={s.anexo} />
                <Pressable
                  style={s.remover}
                  onPress={() => setAnexos((a) => a.filter((_, j) => j !== i))}
                  hitSlop={6}
                >
                  <Ionicons name="close" size={12} color={colors.onBrand} />
                </Pressable>
              </View>
            ))}
          </Row>
        )}
        <Button
          label={anexos.length > 0 ? 'anexar outra foto' : 'anexar fotos'}
          variant="secondary"
          icon="camera-outline"
          onPress={() => setSheet(true)}
        />
        <Text style={[font.tiny, { marginTop: spacing(2) }]}>
          fotos ajudam a resolver a disputa mais rápido
        </Text>
      </Screen>

      <BottomBar>
        <Button
          label="Abrir disputa"
          variant="danger"
          disabled={!motivo}
          onPress={() => { disputeOrder(pedido.id, motivo!); setAberta(true); }}
        />
      </BottomBar>

      <Sheet visible={sheet} onClose={() => setSheet(false)} title="Anexar foto">
        <SheetOption
          icon="camera-outline"
          label="Tirar foto"
          sublabel="Registrar agora com a câmera"
          onPress={() => anexar('marido-aluguel')}
        />
        <SheetOption
          icon="images-outline"
          label="Escolher da galeria"
          sublabel="Usar uma foto que você já tem"
          onPress={() => anexar('diarista')}
        />
      </Sheet>

      <Toast message={toast.message ?? ''} visible={toast.visible} />
    </View>
  );
}

const s = StyleSheet.create({
  anexo: { width: 88, height: 88, borderRadius: radius.md },
  remover: {
    position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.bg,
  },
});
