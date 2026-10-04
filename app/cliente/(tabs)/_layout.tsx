import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ColorValue } from 'react-native';
import { colors } from '@/theme';

const icone = (nome: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={nome} size={size - 3} color={color as string} />
  );

export default function ClienteTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: colors.bg,
        },
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: icone('home') }} />
      <Tabs.Screen name="agenda" options={{ title: 'Pedidos', tabBarIcon: icone('reader-outline') }} />
      <Tabs.Screen name="categorias" options={{ title: 'Categorias', tabBarIcon: icone('grid-outline') }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: icone('chatbubble-outline') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icone('person-outline') }} />
    </Tabs>
  );
}
