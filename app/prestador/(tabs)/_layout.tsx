import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

export default function PrestadorTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          borderTopColor: colors.border, height: 64, paddingTop: 8,
          paddingBottom: 10, backgroundColor: colors.bg,
        },
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="pedidos" options={{ title: 'Pedidos', tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="ganhos" options={{ title: 'Ganhos', tabBarIcon: ({ color, size }) => <Ionicons name="cash-outline" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size - 2} color={color} /> }} />
    </Tabs>
  );
}
