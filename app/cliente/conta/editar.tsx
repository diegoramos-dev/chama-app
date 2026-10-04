import React, { useState } from 'react';
import { View, Text, Image, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/theme';
import { currentUser } from '@/data/mock';
import { categoryPhoto } from '@/data/assets';
import {
  Avatar, BackHeader, BottomBar, Button, Field, Notice, Row,
  Screen, Sheet, SheetOption, Toast, useToast,
} from '@/components/ui';

/** Galeria falsa — no app real isso viria do rolo da câmera. */
const GALERIA = ['churrasqueiro', 'dog-walker', 'banho-tosa', 'diarista', 'marido-aluguel'];

/** Tela 35 — editar os dados da conta. */
export default function EditarConta() {
  const [nome, setNome] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [telefone, setTelefone] = useState(currentUser.phone);
  const [foto, setFoto] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);

  const [sheet, setSheet] = useState<'opcoes' | 'galeria' | null>(null);
  const toast = useToast();

  const escolher = (id: string) => {
    setFoto(id);
    setSheet(null);
    toast.show('foto atualizada');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackHeader title="Meus dados" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Screen scroll>
          <View style={{ alignItems: 'center', marginTop: spacing(5), marginBottom: spacing(6) }}>
            <Pressable onPress={() => setSheet('opcoes')}>
              {foto ? (
                <Image source={categoryPhoto(foto)} style={s.foto} />
              ) : (
                <Avatar initials={currentUser.initials} size={88} />
              )}
              <View style={s.cameraDot}>
                <Ionicons name="camera" size={14} color={colors.onBrand} />
              </View>
            </Pressable>
            <Button
              label={foto ? 'trocar foto' : 'adicionar foto'}
              variant="ghost"
              full={false}
              style={{ marginTop: spacing(2) }}
              onPress={() => setSheet('opcoes')}
            />
          </View>

          <Field label="Nome completo" value={nome} onChangeText={setNome} autoCapitalize="words" />
          <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Field label="Celular" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

          {salvo && (
            <Notice tone="success" icon="checkmark-circle-outline">
              Dados atualizados. (Mock: a alteração vale só enquanto o app estiver aberto.)
            </Notice>
          )}
        </Screen>
      </KeyboardAvoidingView>

      <BottomBar>
        <Button
          label="Salvar alterações"
          onPress={() => { setSalvo(true); toast.show('alterações salvas'); }}
        />
      </BottomBar>

      <Sheet visible={sheet === 'opcoes'} onClose={() => setSheet(null)} title="Foto do perfil">
        <SheetOption
          icon="camera-outline"
          label="Tirar foto"
          sublabel="Usar a câmera agora"
          onPress={() => escolher(GALERIA[0])}
        />
        <SheetOption
          icon="images-outline"
          label="Escolher da galeria"
          sublabel="Selecionar uma foto existente"
          onPress={() => setSheet('galeria')}
        />
        {foto && (
          <SheetOption
            icon="trash-outline"
            label="Remover foto"
            sublabel="Voltar para as iniciais"
            tone={colors.danger}
            onPress={() => { setFoto(null); setSheet(null); toast.show('foto removida'); }}
          />
        )}
      </Sheet>

      <Sheet
        visible={sheet === 'galeria'}
        onClose={() => setSheet('opcoes')}
        title="Escolher da galeria"
        subtitle="Toque em uma foto"
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2.5) }}>
          {GALERIA.map((id) => (
            <Pressable key={id} onPress={() => escolher(id)} style={{ width: '31%' }}>
              <Image source={categoryPhoto(id)} style={s.thumb} />
            </Pressable>
          ))}
        </View>
      </Sheet>

      <Toast message={toast.message ?? ''} visible={toast.visible} />
    </View>
  );
}

const s = StyleSheet.create({
  foto: { width: 88, height: 88, borderRadius: 44 },
  cameraDot: {
    position: 'absolute', right: -2, bottom: -2, width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: colors.bg,
  },
  thumb: { width: '100%', aspectRatio: 1, borderRadius: radius.md },
});
