import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { Colors, serifFont } from '@/constants/theme'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.bg },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: serifFont },
          contentStyle: { backgroundColor: Colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="article/[slug]" options={{ title: '' }} />
      </Stack>
    </>
  )
}
