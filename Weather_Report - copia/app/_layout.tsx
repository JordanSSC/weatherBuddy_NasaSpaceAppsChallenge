import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Evita que la pantalla de bienvenida se oculte automáticamente antes de que carguen los assets
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  // Oculta la pantalla de bienvenida cuando las fuentes han cargado
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null; // Muestra la pantalla de bienvenida mientras cargan las fuentes
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            // Título de la pantalla principal
            title: 'Weather Buddy',
            // Estilos del header que imitan a iOS
            headerLargeTitle: true,
            headerBlurEffect: 'regular',
            headerTransparent: true,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}