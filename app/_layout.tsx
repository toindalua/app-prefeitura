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
  anchor: 'home/index',
}

function AppContent() {
  const { token, loading } = useAuth();
  const segments = useSegments();
  const rootNavigation = useRootNavigationState();
  const isReady = !!rootNavigation?.key;

  if (!isReady || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isAuthRoute = segments[0] === 'auth';

  if (!token && !isAuthRoute) return <Redirect href="/auth/login" />;
  if (token && isAuthRoute) return <Redirect href="/home" />;

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <FormProvider>
        <GluestackUIProvider config={config}>
          <AlertProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <AppContent />
              <StatusBar style="auto" />
            </ThemeProvider>
          </AlertProvider>
        </GluestackUIProvider>
      </FormProvider>
    </AuthProvider>
  );
}
