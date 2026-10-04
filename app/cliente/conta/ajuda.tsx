import React, { useState } from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { faq } from '@/data/mock';
import { BackHeader, Button, Card, Row, Screen, SectionTitle } from '@/components/ui';

/** Tela 34 — central de ajuda com FAQ. */
export default function Ajuda() {
  const [aberta, setAberta] = useState<string | null>(null);
  const perguntas = faq.filter((f) => f.audience === 'cliente' || f.audience === 'ambos');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Ajuda" subtitle="Dúvidas frequentes" />
      <Screen scroll>
        <View style={{ marginTop: spacing(4), gap: spacing(2.5) }}>
          {perguntas.map((f) => {
            const expandida = aberta === f.id;
            return (
              <Card key={f.id} onPress={() => setAberta(expandida ? null : f.id)}>
                <Row gap={3}>
                  <Text style={[font.bodyStrong, { flex: 1 }]}>{f.q}</Text>
                  <Ionicons name={expandida ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textFaint} />
                </Row>
                {expandida && (
                  <Text style={[font.body, { marginTop: spacing(3), lineHeight: 22, color: colors.textMuted }]}>
                    {f.a}
                  </Text>
                )}
              </Card>
            );
          })}
        </View>

        <SectionTitle>Ainda com dúvida?</SectionTitle>
        <Button
          label="Falar com o suporte"
          icon="chatbubble-ellipses-outline"
          onPress={() => router.push('/cliente/conta/suporte')}
        />
        <Button
          label="Ligar para o Chama"
          variant="secondary"
          icon="call-outline"
          style={{ marginTop: spacing(3) }}
          onPress={() => Linking.openURL('tel:08001234567')}
        />

        <Text style={[font.tiny, { textAlign: 'center', marginTop: spacing(6), lineHeight: 18 }]}>
          atendimento de segunda a sábado, das 8h às 20h{'\n'}disputas têm resposta em até 24h
        </Text>
      </Screen>
    </View>
  );
}
