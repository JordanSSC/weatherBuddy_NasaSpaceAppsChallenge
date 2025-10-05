import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // ¡Importar el hook de enrutamiento!
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PanResponder } from 'react-native';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyledButton } from '../components/StyledButton';
import Colors from '../constants/COLORS';

// --- Array con las frases para el slider ---
const subtitles = [
  "¡Hola! Echemos un vistazo a tu día.",
  "¿Listo para comenzar? Aquí está el clima de hoy.",
  'Tu compañero del clima está aquí. ¡Consulta el pronóstico!',
   "Encantado de verte! Aquí está tu informe del clima.",
];

// --- Componente para los puntos indicadores ---
// Se anima suavemente entre el estado activo e inactivo
const DotIndicator = ({ active }: { active: boolean }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active ? 1 : 0.4, { duration: 300 }),
      transform: [{ scale: withTiming(active ? 1.1 : 1, { duration: 300 }) }],
    };
  });
  return <Animated.View style={[styles.dot, animatedStyle]} />;
};


export default function WelcomeScreen() { // Cambiado el nombre para mayor claridad
  const router = useRouter(); // Inicializar el router
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [isAutoChange, setIsAutoChange] = useState(true);

  // PanResponder para detectar swipe horizontal
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 40) {
        setIsAutoChange(false);
        setCurrentSubtitleIndex((prevIndex) =>
          prevIndex === 0 ? subtitles.length - 1 : prevIndex - 1
        );
      } else if (gestureState.dx < -40) {
        setIsAutoChange(false);
        setCurrentSubtitleIndex((prevIndex) =>
          (prevIndex + 1) % subtitles.length
        );
      }
    },
  });

  // --- Lógica para cambiar la frase cada 5 segundos ---
  useEffect(() => {
    let interval: number;
    if (isAutoChange) {
      interval = setInterval(() => {
        setIsAutoChange(true);
        setCurrentSubtitleIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [currentSubtitleIndex, isAutoChange]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content} {...panResponder.panHandlers}>
        {/* Título en dos líneas: prefijo en la primera línea y 'Weather Buddy' en la segunda con gradiente vertical */}
        <View style={styles.titleContainer}>
          <Text style={styles.titlePrefix}>Bienvenido a</Text>

          <MaskedView
            maskElement={<Text style={styles.titleGradientMask}>Weather Buddy</Text>}
          >
            <LinearGradient
              colors={["#9BD3FF", "#000000"]}
              start={[0, 1]}
              end={[0, 0]}
              style={styles.gradientFill}
            />
          </MaskedView>
        </View>
        {/* Contenedor animado para el subtítulo */}
        {isAutoChange ? (
          <Animated.View
            key={currentSubtitleIndex}
            entering={FadeIn.duration(800)}
            exiting={FadeOut.duration(800)}
          >
            <Text style={styles.subtitle}>
              {subtitles[currentSubtitleIndex]}
            </Text>
          </Animated.View>
        ) : (
          <View>
            <Text style={styles.subtitle}>
              {subtitles[currentSubtitleIndex]}
            </Text>
          </View>
        )}

        {/* --- Contenedor para los puntos indicadores --- */}
        <View style={styles.indicatorContainer}>
          {subtitles.map((_, index) => (
            <DotIndicator key={index} active={index === currentSubtitleIndex} />
          ))}
        </View>

        <View style={styles.lottieContainer}>
          {/* --- Componente Lottie reemplazando el ícono --- */}
          <LottieView
            source={require('../assets/lottie/nube.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <StyledButton
          label="Verificar el clima actual"
          onPress={() => router.push('/home')} // ¡ACCIÓN DE NAVEGACIÓN!
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titlePrefix: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    color: Colors.light.text,
    marginBottom: 6,
  },
  titleGradientMask: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    // Texto opaco para que el gradiente se vea a través de la máscara
    color: 'black',
  },
  gradientFill: {
    // Aumentamos el ancho para evitar recortes de la segunda palabra y centramos
    width: 300,
    height: 44,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    color: '#666',
    marginBottom: 16, // Reducimos el margen para dar espacio a los puntos
    height: 50, // Altura fija para evitar saltos de layout
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24, // Espacio entre los puntos y la animación
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8E8E93', // Un gris neutro de iOS
    marginHorizontal: 5,
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150, // Espacio definido para la animación
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
});