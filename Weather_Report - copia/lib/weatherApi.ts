// lib/weatherApi.ts

// --- TIPOS DE DATOS ---
// Renombramos la interfaz a ProcessedWeatherData para que coincida con la importación en report.tsx
export interface TimeSeries {
  years: string[];
  temperatures: number[];
}

export interface ProcessedWeatherData {
  lat: string;
  lon: string;
  day: number;
  month: number;
  hot: { probability: number; threshold: number };
  cold: { probability: number; threshold: number };
  wet: { probability: number; threshold: number };
  windy: { probability: number; threshold: number };
  timeSeries: TimeSeries;
  averageTemp: number;
}

// --- LÓGICA PRINCIPAL ---
export async function analyzeHistoricalWeather(lat: number, lon: number, day: number, month: number): Promise<ProcessedWeatherData> {
  try {
    const rawData = await fetchWeatherData(lat, lon, day, month);
    const processedData = processApiData(rawData, lat, lon, day, month);
    return processedData;
  } catch (error) {
    console.error("Error en el análisis del clima:", error);
    throw error;
  }
}

// --- COMUNICACIÓN CON LA API ---
async function fetchWeatherData(lat: number, lon: number, day: number, month: number) {
  const endYear = new Date().getFullYear() - 1;
  const startYear = endYear - 20;
  
  const powerUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?start=${startYear}0101&end=${endYear}1231&latitude=${lat}&longitude=${lon}&community=RE&parameters=T2M_MAX,T2M_MIN,PRECTOTCORR,WS10M_MAX&format=JSON`;

  const response = await fetch(powerUrl);
  if (!response.ok) throw new Error("La fuente de datos (NASA POWER) falló.");
  
  const data = await response.json();
  if (!data?.properties?.parameter) throw new Error("No se recibieron datos válidos de la fuente.");

  const dayOfYear = getDayOfYear(new Date(2000, month - 1, day));
  const filteredData: { [key: string]: { [key: string]: number } } = {};

  for (const param in data.properties.parameter) {
    filteredData[param] = {};
    for (const dateStr in data.properties.parameter[param]) {
      const year = parseInt(dateStr.substring(0, 4));
      const currentDayOfYear = getDayOfYear(new Date(year, parseInt(dateStr.substring(4, 6)) - 1, parseInt(dateStr.substring(6, 8))));
      
      if (Math.abs(currentDayOfYear - dayOfYear) <= 1) {
        filteredData[param][dateStr] = data.properties.parameter[param][dateStr];
      }
    }
  }
  return { properties: { parameter: filteredData } };
}

// --- PROCESAMIENTO DE DATOS ---
function processApiData(apiData: any, lat: number, lon: number, day: number, month: number): ProcessedWeatherData {
  const params = apiData.properties.parameter;

  // Temperaturas máximas y mínimas, precipitación y viento para el día seleccionado y días cercanos
  const validMaxTemps = Object.values(params.T2M_MAX || {}).filter(v => typeof v === 'number' && v !== -999) as number[];
  const validMinTemps = Object.values(params.T2M_MIN || {}).filter(v => typeof v === 'number' && v !== -999) as number[];
  const validPrecip = Object.values(params.PRECTOTCORR || {}).filter(v => typeof v === 'number' && v !== -999) as number[];
  const validWinds = Object.values(params.WS10M_MAX || {}).filter(v => typeof v === 'number' && v !== -999) as number[];

  if (validMaxTemps.length < 5) {
    throw new Error("No hay suficientes datos históricos para un análisis fiable.");
  }

  // Umbrales fijos para condiciones desfavorables
  const hotThreshold = 30; // °C
  const coldThreshold = 0; // °C
  const wetThreshold = 10; // mm
  const windyThreshold = 10; // m/s

  // Probabilidad de condiciones desfavorables
  const hotProb = calculateProbability(validMaxTemps, hotThreshold, 'greater');
  const coldProb = calculateProbability(validMinTemps, coldThreshold, 'less');
  const wetProb = calculateProbability(validPrecip, wetThreshold, 'greater');
  const windyProb = calculateProbability(validWinds, windyThreshold, 'greater');

  // Para mostrar la serie de temperaturas máximas
  const years = Object.keys(params.T2M_MAX || {}).map(date => date.substring(0, 4));
  const timeSeries: TimeSeries = {
    years,
    temperatures: validMaxTemps
  };
  const averageTemp = validMaxTemps.reduce((a, b) => a + b, 0) / validMaxTemps.length;

  return {
    lat: lat.toFixed(4),
    lon: lon.toFixed(4),
    day,
    month,
    hot: { probability: hotProb, threshold: hotThreshold },
    cold: { probability: coldProb, threshold: coldThreshold },
    wet: { probability: wetProb, threshold: wetThreshold },
    windy: { probability: windyProb, threshold: windyThreshold },
    timeSeries,
    averageTemp,
  };
}

// --- FUNCIONES DE UTILIDAD ---

// Esta función es correcta para calcular el día del año, no requiere cambios.
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function calculatePercentile(arr: number[], percentile: number): number {
  if (arr.length === 0) return 0;
  const sortedArr = [...arr].sort((a, b) => a - b);
  const index = (percentile / 100) * (sortedArr.length - 1);
  const lower = Math.floor(index);
  const upper = lower + 1;
  const weight = index - lower;
  if (upper >= sortedArr.length) return sortedArr[lower];
  return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
}

function calculateProbability(arr: number[], threshold: number, condition: 'greater' | 'less'): number {
  if (arr.length === 0) return 0;
  const count = arr.filter(value => {
    if (condition === 'greater') return value > threshold;
    if (condition === 'less') return value < threshold;
    return false;
  }).length;
  return count / arr.length;
}
