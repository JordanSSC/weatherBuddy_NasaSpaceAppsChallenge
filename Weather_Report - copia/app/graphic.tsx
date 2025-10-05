import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StyledButton } from '../components/StyledButton';
import { TimeSeries } from '../lib/weatherApi';

export default function GraphicScreen() {
  const router = useRouter();
  const { timeSeries: timeSeriesString, averageTemp } =
    useLocalSearchParams<{ timeSeries: string; averageTemp: string }>();
  const [modalVisible, setModalVisible] = useState(false);

  // --- Parseo seguro ---
  const timeSeries = useMemo<TimeSeries | null>(() => {
    if (!timeSeriesString) return null;
    try {
      return JSON.parse(timeSeriesString);
    } catch (e) {
      console.error('❌ Error al parsear timeSeries:', e);
      return null;
    }
  }, [timeSeriesString]);

  // --- Chart sin labels X ---
  const chartDataMinimal = useMemo(() => {
    if (!timeSeries) return null;
    return {
      labels: timeSeries.years.map(() => ''),
      datasets: [{ data: timeSeries.temperatures }],
    };
  }, [timeSeries]);

  // --- Chart completo (con años) ---
  const chartDataFull = useMemo(() => {
    if (!timeSeries) return null;
    return {
      labels: timeSeries.years,
      datasets: [{ data: timeSeries.temperatures }],
    };
  }, [timeSeries]);

  if (!timeSeries || !chartDataMinimal || !chartDataFull) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          ⚠️ Error al cargar los datos del gráfico.
        </Text>
      </SafeAreaView>
    );
  }

  const startYear = timeSeries.years[0];
  const endYear = timeSeries.years[timeSeries.years.length - 1];

  const chartWidth = Math.max(
    Dimensions.get('window').width,
    timeSeries.years.length * 60
  );

  // --- Eje Y dinámico ---
  const minY = Math.min(...timeSeries.temperatures);
  const maxY = Math.max(...timeSeries.temperatures);
  const step = (maxY - minY) / 4;
  const yAxisLabels = Array.from({ length: 5 }, (_, i) =>
    (maxY - i * step).toFixed(1)
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{ title: 'Gráfico Histórico', headerBackTitle: 'Reporte' }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- Gráfico principal --- */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>
            Temperatura Máxima Histórica (°C)
          </Text>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <LineChart
              data={chartDataMinimal}
              width={Dimensions.get('window').width - 32}
              height={220}
              yAxisSuffix="°C"
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </TouchableOpacity>

          <Text style={styles.chartFooter}>
            Temperatura {startYear} - {endYear} {'\n'}
            <Text style={styles.chartHint}>(Toca para ver detalle)</Text>
          </Text>
        </View>

        {/* --- Resumen --- */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Resumen</Text>
          <Text style={styles.infoLabel}>Promedio Histórico:</Text>
          <Text style={styles.infoValue}>
            {parseFloat(averageTemp || '0').toFixed(1)}°C
          </Text>

          <StyledButton
            label="Volver a Analizar"
            onPress={() => router.replace('/home')}
          />
        </View>
      </ScrollView>

      {/* --- Modal con eje Y que se mueve --- */}
     <Modal visible={modalVisible} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>
        Temperatura {startYear} - {endYear}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* Eje Y fijo */}
        <LineChart
          data={chartDataFull}
          width={60} // ancho solo para mostrar eje Y
          height={Dimensions.get('window').height * 0.6}
          yAxisSuffix="°C"
          chartConfig={{
            ...chartConfig,
            propsForBackgroundLines: { stroke: 'transparent' }, // ocultamos grid
          }}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLabels={true}
          withVerticalLabels={false} // no mostrar labels X
          style={{ marginRight: -10 }} // solapar con el gráfico principal
        />

        {/* Gráfico desplazable */}
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <LineChart
            data={chartDataFull}
            width={chartWidth}
            height={Dimensions.get('window').height * 0.6}
            yAxisSuffix="°C"
            chartConfig={chartConfig}
            bezier
            withHorizontalLabels={false} //
            style={styles.chart}
          />
        </ScrollView>
      </View>

      <StyledButton label="Cerrar" onPress={() => setModalVisible(false)} />
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
}

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(185, 28, 28, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
  fillShadowGradient: '#FEE2E2',
  fillShadowGradientOpacity: 0.5,
  propsForDots: { r: '4', strokeWidth: '2', stroke: '#B91C1C' },
  propsForBackgroundLines: { stroke: 'rgba(0, 0, 0, 0.05)' },
  propsForLabels: { fontFamily: 'Inter-Regular' },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F7' },
  scrollContainer: { padding: 16 },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#B91C1C',
    fontFamily: 'Inter-SemiBold',
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  chart: { borderRadius: 12 },
  chartFooter: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  chartHint: { fontSize: 12, color: '#666' },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 16,
    color: '#111',
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#111',
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '95%',
    maxHeight: '85%',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#111',
    textAlign: 'center',
  },
});
