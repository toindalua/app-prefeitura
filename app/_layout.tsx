// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import '@/global.css';
import { config } from '@/gluestack-ui.config';

import { AlertProvider } from '@/hooks/use-alert';
import { AuthProvider, useAuth } from '@/hooks/use-auth';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { GluestackUIProvider } from '@gluestack-ui/themed';

import { Redirect, Slot, useRootNavigationState, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { FormProvider } from '../context/FormContext';

export const unstable_settings = {
  anchor: '/home',
};

// --------------------------
// Componente que controla redirecionamento baseado no login
// --------------------------
function AppContent() {
  const { token, loading } = useAuth();
  const segments = useSegments();
  const rootNavigation = useRootNavigationState();
  const isReady = !!rootNavigation?.key;

  // Loading ou rootNavigation ainda não prontos
  if (!isReady || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isAuthRoute = segments[0] === 'auth';

  // Redireciona se não estiver logado
  if (!token && !isAuthRoute) return <Redirect href="/auth/login" />;
  
  // Redireciona se estiver logado e tentando acessar rota de login
  if (token && isAuthRoute) return <Redirect href="/home" />;

  // Caso esteja na rota correta
  return <Slot />;
}

// --------------------------
// Layout raiz
// --------------------------
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FormProvider>
      <GluestackUIProvider config={config}>
        <AlertProvider>
          {/* AuthProvider ÚNICO */}
          <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <AppContent />
              <StatusBar style="auto" />
            </ThemeProvider>
          </AuthProvider>
        </AlertProvider>
      </GluestackUIProvider>
    </FormProvider>
  );
}
