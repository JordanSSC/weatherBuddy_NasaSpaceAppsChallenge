# Recursos de Presentación
[Accede aquí](https://drive.google.com/drive/folders/1Gqx7h-pmePtiBASFv8kEGhzqSGgWj5NV?usp=sharing)

# WeatherBuddy: Nasa Space Apps Challenge

## Descripción del desafío

WeatherBuddy permite consultar la probabilidad de condiciones adversas (muy caluroso, muy frío, muy lluvioso, muy ventoso, incómodo) para cualquier ubicación y fecha, usando datos de observación terrestre (NASA POWER API).

## Funcionalidades principales

- Selección de ubicación en el mapa 
- Selección de fecha personalizada (día y mes).
- Consulta de probabilidades de calor, frío, lluvia, viento y condiciones incómodas.
- Reporte visual y gráfico histórico de temperaturas.
- Chat personalizado para recomendaciones según el clima.

## Pasos para probar la app

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Iniciar el proyecto Expo**

   ```bash
   npx expo start --tunnel
   ```

3. **Abrir en dispositivo móvil**

   - Instala la app [Expo Go](https://expo.dev/go) en tu teléfono Android o iOS.
   - Escanea el código QR que aparece en la terminal o navegador tras iniciar Expo.
   - La app se abrirá en tu dispositivo y podrás interactuar con todas las funciones.

4. **Probar funcionalidades**

   - Selecciona una ubicación en el mapa (puedes buscar cualquier parte del mundo).
   - Elige el día y mes para tu evento.
   - Consulta el reporte: verás probabilidades de calor, frío, lluvia, viento y condiciones incómodas, adaptadas a la zona y fecha.
   - Accede al gráfico histórico y al chat para recomendaciones personalizadas.

## Observaciones

- La app funciona en Expo Go, Android y iOS.
- Los datos meteorológicos se obtienen en tiempo real de la NASA POWER API.
- El reporte se adapta dinámicamente según la ubicación y fecha seleccionada.

## Recursos útiles

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [NASA POWER API](https://power.larc.nasa.gov/docs/services/api/temporal/daily/point/)

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

