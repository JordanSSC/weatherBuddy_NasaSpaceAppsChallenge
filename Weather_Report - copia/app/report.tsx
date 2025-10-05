import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatCard } from '../components/StatCard';
import { StyledButton } from '../components/StyledButton';
import { ProcessedWeatherData } from '../lib/weatherApi';

export default function ReportScreen() {
  const router = useRouter();
  const { data: dataString } = useLocalSearchParams<{ data: string }>();

  // Usamos useMemo para parsear los datos solo una vez
  const data: ProcessedWeatherData | null = useMemo(() => {
    if (!dataString) return null;
    try {
      return JSON.parse(dataString);
    } catch (e) {
      console.error("Failed to parse weather data:", e);
      return null;
    }
  }, [dataString]);

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.fallbackContainer}>
          <Text style={styles.subHeader}>No se pudieron cargar los datos del reporte.</Text>
          <StyledButton label="Volver" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleShowChart = () => {
    router.push({
      pathname: '/graphic',
      params: { 
        timeSeries: JSON.stringify(data.timeSeries),
        averageTemp: data.averageTemp.toString()
      },
    });
  };

  const monthName = new Date(2000, data.month - 1).toLocaleString('es-ES', { month: 'long' });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Reporte del Clima', headerBackTitle: 'Inicio' }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Resultados del Análisis</Text>
        <Text style={styles.subHeader}>
          {`Análisis para el ${data.day} de ${monthName} en la ubicación Lat ${data.lat}, Lon ${data.lon}`}
        </Text>

        <View style={styles.cardsContainer}>
          <StatCard 
            title="Muy Caluroso" 
            probability={data.hot.probability}
            description={`Probabilidad de condiciones > ${data.hot.threshold.toFixed(1)}°C`}
            backgroundColor="#FEE2E2"
            textColor="#B91C1C"
          />
          <StatCard 
            title="Muy Frío" 
            probability={data.cold.probability}
            description={`Probabilidad de condiciones < ${data.cold.threshold.toFixed(1)}°C`}
            backgroundColor="#DBEAFE"
            textColor="#1E40AF"
          />
        </View>
        <View style={styles.cardsContainer}>
          <StatCard 
            title="Muy Lluvioso" 
            probability={data.wet.probability}
            description={`Probabilidad de condiciones > ${data.wet.threshold.toFixed(2)} mm/día`}
            backgroundColor="#CFFAFE"
            textColor="#0E7490"
          />
          <StatCard 
            title="Muy Ventoso" 
            probability={data.windy.probability}
            description={`Probabilidad de condiciones > ${data.windy.threshold.toFixed(1)} m/s`}
            backgroundColor="#E5E7EB"
            textColor="#1F2937"
          />
        </View>

      {/* --- Botón para ver el gráfico en la nueva pantalla --- */}
        <View style={styles.chartButtonContainer}>
          <View style={{ marginBottom: 16 }}>
            <StyledButton 
              label="Ver Temperatura Máxima Histórica"
              onPress={handleShowChart}
            />
          </View>
          <StyledButton
            label="Reporte Personalizado"
            onPress={() => (router.push as any)({ pathname: '/custom-report-chat', params: { data: dataString } })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F7' },
  fallbackContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { padding: 24, paddingBottom: 40 },
  header: { fontFamily: 'Inter-Bold', fontSize: 28, marginBottom: 8 },
  subHeader: { fontFamily: 'Inter-Regular', fontSize: 16, color: '#666', marginBottom: 24 },
  cardsContainer: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  chartButtonContainer: {
    marginTop: 32,
  },
});