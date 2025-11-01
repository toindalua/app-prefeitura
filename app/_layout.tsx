import 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import '@/global.css';
import { config } from '@/gluestack-ui.config';
import { AlertProvider } from '@/hooks/use-alert';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { Redirect, Slot, useRootNavigationState, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export const unstable_settings = {
  anchor: 'home/index',
}

function AppContent() {
  const { token, loading } = useAuth(); // É vital usar o estado de carregamento do Auth!
  const segments = useSegments();

  const rootNavigation = useRootNavigationState();
  const isReady = !!rootNavigation?.key;

  // 1. Mostrar carregamento inicial
  if (!isReady || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Obter o primeiro segmento da rota, que geralmente é a pasta de nível superior
  const isAuthRoute = segments[0] === 'auth';

  // LÓGICA DE REDIRECIONAMENTO COM <Redirect />
  
  // Caso 1: Usuário DESLOGADO e TENTANDO ACESSAR ROTA PROTEGIDA
  if (!token && !isAuthRoute) {
    // Redireciona para a tela de login
    return <Redirect href="/auth/login" />;
  }

  // Caso 2: Usuário LOGADO e TENTANDO ACESSAR ROTA DE AUTENTICAÇÃO (Login/Cadastro)
  if (token && isAuthRoute) {
    // Redireciona para a tela inicial (evita que o usuário logado veja a tela de login)
    return <Redirect href="/home" />;
  }

  // Se nenhuma das regras de redirecionamento acima for acionada, renderize a rota atual
  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <AuthProvider>
      <GluestackUIProvider config={config}>
        <AlertProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AppContent />
            <StatusBar style="auto" />
          </ThemeProvider>
        </AlertProvider>
      </GluestackUIProvider>
    </AuthProvider>
  )
}