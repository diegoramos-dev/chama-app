import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { useApp } from '@/store/app';
import { BackHeader, EmptyState, PhotoBox, Row, Screen, Notice } from '@/components/ui';

/** Tela 22 — fotos que o profissional enviou como prova do serviço. */
export default function Provas() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder } = useApp();
  const pedido = getOrder(id ?? '');
  const fotos = pedido?.proofPhotos ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Provas do serviço" subtitle={pedido?.providerName} />
      <Screen scroll>
        {fotos.length === 0 ? (
          <EmptyState
            icon="camera-outline"
            title="Nenhuma prova enviada ainda"
            body="O profissional envia fotos do trabalho ao finalizar o serviço. Elas aparecem aqui."
          />
        ) : (
          <>
            <View style={{ marginTop: spacing(4), gap: spacing(2.5) }}>
              {Array.from({ length: Math.ceil(fotos.length / 2) }).map((_, linha) => (
                <Row key={linha} gap={2.5}>
                  {fotos.slice(linha * 2, linha * 2 + 2).map((c, i) => <PhotoBox key={i} color={c} />)}
                  {fotos.slice(linha * 2, linha * 2 + 2).length === 1 && <View style={{ flex: 1 }} />}
                </Row>
              ))}
            </View>

            <View style={{ marginTop: spacing(5) }}>
              <Notice tone="info" icon="information-circle-outline">
                As fotos ficam guardadas no pedido. Se você abrir uma disputa, elas fazem parte da análise.
              </Notice>
            </View>
          </>
        )}
      </Screen>
    </View>
  );
}
