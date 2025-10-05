import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps'; // Se elimina PROVIDER_GOOGLE de los imports
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyledButton } from '../components/StyledButton';
import { StyledPicker } from '../components/StyledPicker';
import Colors from '../constants/COLORS';
import { analyzeHistoricalWeather } from '../lib/weatherApi';

const months = Array.from({ length: 12 }, (_, i) => ({
  label: new Date(2000, i).toLocaleString('es-ES', { month: 'long' }),
  value: i + 1,
}));
function getDaysInMonth(month: number, year = 2000) {
  // month: 1-12
  return new Date(year, month, 0).getDate();
}

const DEFAULT_REGION: Region = {
  latitude: -1.8312,
  longitude: -78.1834,
  latitudeDelta: 15,
  longitudeDelta: 15,
};

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ reset?: string }>();

  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Generar la lista de días según el mes seleccionado
  const days = Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  // Ajustar el día seleccionado si el mes cambia y el día actual queda fuera de rango
  useEffect(() => {
    const maxDays = getDaysInMonth(selectedMonth);
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays);
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (params.reset === 'true') {
      setSelectedCoords(null);
      setSelectedMonth(1);
      setSelectedDay(1);
    }
  }, [params.reset]);

  const handleAnalyze = async () => {
    if (!selectedCoords) {
      Alert.alert('Selección Requerida', 'Por favor, selecciona una ubicación en el mapa.');
      return;
    }
    setIsLoading(true);
    try {
      const weatherData = await analyzeHistoricalWeather(
        selectedCoords.latitude,
        selectedCoords.longitude,
        selectedDay,
        selectedMonth
      );
      router.push({
        pathname: '/report',
        params: { data: JSON.stringify(weatherData) },
      });
    } catch (error: any) {
      Alert.alert('Error en el Análisis', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal transparent={true} animationType="fade" visible={isLoading}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={Colors.light.tint} />
            <Text style={styles.modalText}>
              Analizando datos históricos...{'\n'}Esto puede tardar un momento.
            </Text>
          </View>
        </View>
      </Modal>

      <Stack.Screen options={{ title: 'Seleccionar Ubicación y Fecha' }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Define tu Búsqueda</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Selecciona una ubicación en el mapa</Text>
          <MapView
            style={styles.map}
            // --- MEJORA PRINCIPAL ---
            // Se elimina `provider={PROVIDER_GOOGLE}`.
            // Esto hace que la app use los mapas nativos de cada plataforma (Apple Maps en iOS,
            // y el mapa por defecto en Android), lo cual es más rápido y no requiere API keys.
            initialRegion={DEFAULT_REGION}
            onPress={(e) => setSelectedCoords(e.nativeEvent.coordinate)}
          >
            {selectedCoords && (
              <Marker
                key={`${selectedCoords.latitude}_${selectedCoords.longitude}`}
                coordinate={selectedCoords}
                tracksViewChanges={false}
              />
            )}
          </MapView>
          <Text style={styles.coordsDisplay}>
            {selectedCoords
              ? `Lat: ${selectedCoords.latitude.toFixed(4)}, Lon: ${selectedCoords.longitude.toFixed(4)}`
              : 'Haz clic en el mapa para seleccionar un punto.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Selecciona una fecha</Text>
          <View style={styles.datePickerContainer}>
            <StyledPicker
              label="Mes"
              items={months}
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue as number)}
            />
            <StyledPicker
              label="Día"
              items={days}
              selectedValue={selectedDay}
              // --- CORRECCIÓN DE ERROR ---
              // Se corrigió el typo de 'onValue-Change' a 'onValueChange'.
              onValueChange={(itemValue) => setSelectedDay(itemValue as number)}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <StyledButton label="Analizar Clima" onPress={handleAnalyze} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F7' },
  scrollContainer: { padding: 24 },
  header: { fontFamily: 'Inter-Bold', fontSize: 28, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'Inter-SemiBold', fontSize: 18, marginBottom: 12 },
  map: { width: '100%', height: 300, borderRadius: 12, overflow: 'hidden' },
  coordsDisplay: { marginTop: 8, fontFamily: 'Inter-Regular', fontSize: 14, color: '#666', textAlign: 'center' },
  datePickerContainer: { flexDirection: 'row', gap: 16 },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#E5E5E5', backgroundColor: '#FFF' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 24, alignItems: 'center', gap: 16, width: '80%' },
  modalText: { fontFamily: 'Inter-Regular', fontSize: 16, textAlign: 'center', color: '#333' },
});