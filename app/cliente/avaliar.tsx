import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing, cap} from '@/theme';
import { useApp } from '@/store/app';
import {
  Avatar, BackHeader, BottomBar, Button, Chip, EmptyState,
  Field, Row, Screen,
} from '@/components/ui';
import type { ReviewTag } from '@/data/types';

const LEGENDAS = ['', 'Foi ruim', 'Deu pra quebrar o galho', 'Foi ok', 'Muito bom!', 'Excelente!'];

const TAGS: ReviewTag[] = ['pontual', 'caprichoso', 'simpático', 'deixou tudo limpo', 'preço justo', 'resolveu rápido'];

/** Tela 25 — avaliar o profissional depois do serviço. */
export default function Avaliar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, rateOrder } = useApp();
  const pedido = getOrder(id ?? '');

  const [estrelas, setEstrelas] = useState(0);
  const [tags, setTags] = useState<ReviewTag[]>([]);
  const [texto, setTexto] = useState('');
  const [enviado, setEnviado] = useState(false);

  if (!pedido) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Avaliar serviço" />
        <EmptyState icon="star-outline" title="Pedido não encontrado" />
      </View>
    );
  }

  const alternarTag = (t: ReviewTag) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const enviar = () => {
    rateOrder(pedido.id, estrelas, tags, texto.trim());
    setEnviado(true);
  };

  if (enviado) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackHeader title="Obrigado!" />
        <Screen scroll>
          <EmptyState
            icon="flame-outline"
            title="Avaliação enviada"
            body={`Sua nota ajuda o ${pedido.providerName.split(' ')[0]} a subir de nível no Chama — e ajuda outras pessoas a escolherem bem.`}
            action={<Button label="Voltar ao início" onPress={() => router.replace('/cliente/(tabs)')} />}
          />
        </Screen>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Avaliar serviço" />

      <Screen scroll>
        <View style={{ alignItems: 'center', marginTop: spacing(5) }}>
          <Avatar initials={pedido.providerInitials} size={62} flame="chama" />
          <Text style={[font.h3, { marginTop: spacing(3) }]}>{pedido.providerName}</Text>
          <Text style={[font.small, { marginTop: 2 }]}>{cap(pedido.categoryName)} · {pedido.date}</Text>
        </View>

        <Text style={[font.body, { textAlign: 'center', marginTop: spacing(7) }]}>Como foi o serviço?</Text>

        <Row gap={2.5} style={{ justifyContent: 'center', marginTop: spacing(4) }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Pressable key={i} onPress={() => setEstrelas(i)} hitSlop={6}>
              <Ionicons
                name={estrelas >= i ? 'star' : 'star-outline'}
                size={38}
                color={estrelas >= i ? colors.star : colors.brandLight}
              />
            </Pressable>
          ))}
        </Row>

        <Text style={[font.bodyStrong, { textAlign: 'center', marginTop: spacing(3), color: colors.brand, minHeight: 22 }]}>
          {LEGENDAS[estrelas]}
        </Text>

        {estrelas > 0 && (
          <Row gap={2} style={{ flexWrap: 'wrap', justifyContent: 'center', marginTop: spacing(5) }}>
            {TAGS.map((t) => (
              <Chip key={t} label={cap(t)} active={tags.includes(t)} onPress={() => alternarTag(t)} />
            ))}
          </Row>
        )}

        <View style={{ marginTop: spacing(6) }}>
          <Field
            value={texto}
            onChangeText={setTexto}
            placeholder="Conte como foi o serviço (opcional)..."
            multiline
          />
        </View>
      </Screen>

      <BottomBar>
        <Button label="Enviar avaliação" onPress={enviar} disabled={estrelas === 0} />
      </BottomBar>
    </View>
  );
}
