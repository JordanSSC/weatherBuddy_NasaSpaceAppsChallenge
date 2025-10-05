import React, { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Base de conocimiento de Respuestas Demo ---
const responses = {
  Recomendaciones: [
    "Hoy el día pide a gritos ropa cómoda y fresca. ¡No te olvides de ponerte protector solar, sobre todo si vas a estar fuera!",
    "Asegúrate de tomar suficiente agua durante el día. Un sombrero o una gorra también serían una excelente idea para protegerte del sol.",
    "Hoy es un buen día para usar lentes de sol. Además, si tienes plantas, recuerda regarlas un poco más por el calor que se espera.",
    "Para un día cálido y seco, es vital mantenerse hidratado. Usa ropa ligera de algodón y no olvides el protector solar, incluso si está nublado.",
    "Aprovecha para usar ese sombrero que tanto te gusta. Además de protegerte, te verás genial. ¡Acompaña tu día con agua de frutas frescas!",
    "Te sugiero buscar la sombra durante las horas pico de sol (11 a.m. a 4 p.m.). Es un día ideal para disfrutar de bebidas refrescantes como un té helado o limonada."
  ],
  Evitar: [
    "Mejor deja las tareas pesadas de jardinería para otro día, el sol va a estar bastante intenso al mediodía.",
    "Intenta no hacer ejercicio fuerte al aire libre entre las 11 a.m. y las 4 p.m., que es cuando el calor aprieta más.",
    "Si vas a manejar, ten cuidado con dejar objetos de valor a la vista. Con el sol, el interior del auto se calienta mucho y puede llamar la atención.",
    "Evita las actividades físicas intensas al aire libre, especialmente al mediodía. El calor seco puede causar deshidratación rápidamente.",
    "Hoy no es el mejor día para comidas pesadas y calientes. Opta por ensaladas, frutas y platos frescos para mantener tu cuerpo ligero.",
    "Ten cuidado con dejar a niños o mascotas en el coche, ni siquiera por un minuto. La temperatura interior puede subir a niveles peligrosos muy rápido."
  ],
  Resumen: [
    "Tendremos un día mayormente soleado con algunas nubes pasajeras por la tarde. La temperatura estará agradable, ideal para disfrutar.",
    "Se espera un cielo despejado durante la mañana y un poco de viento fresco por la tarde. No hay señales de lluvia, así que ¡a disfrutar!",
    "El día empieza con una sensación fresca, pero irá calentando hasta alcanzar una máxima agradable. La humedad será baja, sintiéndose un ambiente seco.",
    "El pronóstico indica un día soleado con muy baja humedad. Se espera una temperatura máxima de 32°C. No hay probabilidad de lluvia.",
    "Hoy tendremos un clima cálido y seco, con cielos despejados durante toda la jornada. La brisa será ligera, así que la sensación térmica será alta.",
    "Se espera un día típico de clima seco: mucho sol, temperaturas elevadas y ambiente con poca humedad. Ideal para secar la ropa, pero cuida tu piel."
  ],
  Actividades: [
    "Es una tarde perfecta para una caminata tranquila por el parque o para juntarse con amigos en una terraza.",
    "¿Qué tal un picnic? El clima está ideal para extender una manta en el césped y disfrutar de algo rico al aire libre.",
    "Un paseo en bicicleta por la mañana temprano o al atardecer sería genial para aprovechar la temperatura más fresca y mover el cuerpo.",
    "Es un día perfecto para visitar un museo, ir al cine o disfrutar de un centro comercial con aire acondicionado. ¡Mantente fresco!",
    "Si prefieres estar al aire libre, te recomiendo un paseo temprano por la mañana o al atardecer, cuando la temperatura es más agradable.",
    "¿Qué tal una tarde de piscina? Es una excelente manera de refrescarse y disfrutar del sol de forma segura. ¡No olvides reaplicar el bloqueador!"
  ]
};

const PRESET_OPTIONS = [
  { label: 'Recomendaciones', responseKey: 'Recomendaciones', text: 'Recomiéndame algo para el día de hoy basado en el clima' },
  { label: 'Evitar', responseKey: 'Evitar', text: 'Cosas a evitar el día de hoy' },
  { label: 'Resumen', responseKey: 'Resumen', text: 'Resumen del clima' },
  { label: 'Actividades', responseKey: 'Actividades', text: 'Sugiérreme actividades al aire libre basadas en el tiempo' },
];

type Message = {
  id: number;
  sender: 'ai' | 'user';
  text: string;
};

export default function CustomReportChat() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: '¡Hola! Soy tu asistente climático POL-AI. Puedes tocar una de las opciones sugeridas para empezar o escribir tu propia pregunta.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const addNewMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const generateAiResponse = (key: keyof typeof responses | null = null) => {
    setIsTyping(true);
    setTimeout(() => {
      let aiText = 'Gracias';
      if (key && responses[key]) {
        const possibleResponses = responses[key];
        const randomIndex = Math.floor(Math.random() * possibleResponses.length);
        aiText = possibleResponses[randomIndex];
      }
      addNewMessage({ id: Date.now() + 1, sender: 'ai', text: aiText });
      setIsTyping(false);
    }, 1100);
  };

  const handlePresetSelect = (option: typeof PRESET_OPTIONS[0]) => {
    addNewMessage({ id: Date.now(), sender: 'user', text: option.text });
    generateAiResponse(option.responseKey as keyof typeof responses);
  };

  const handleSend = () => {
    const userMsgText = input.trim();
    if (!userMsgText) return;
    addNewMessage({ id: Date.now(), sender: 'user', text: userMsgText });
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      addNewMessage({ id: Date.now() + 1, sender: 'ai', text: 'Gracias' });
      setIsTyping(false);
    }, 1100);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Título de la ventana */}
      <Stack.Screen options={{ title: 'ChatBot Climático', headerBackTitle: 'Volver' }} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg) => (
              <View key={msg.id} style={msg.sender === 'ai' ? styles.aiBubbleWrapper : styles.userBubbleWrapper}>
                {msg.sender === 'ai' && (
                  <Image
                    source={require('../assets/images/POL-AI.jpeg')}
                    style={styles.aiImage}
                  />
                )}
                <View style={msg.sender === 'ai' ? styles.aiBubble : styles.userBubble}>
                  <Text style={msg.sender === 'ai' ? styles.aiBubbleText : styles.userBubbleText}>{msg.text}</Text>
                </View>
              </View>
            ))}

            {isTyping && (
              <View style={styles.aiBubbleWrapper}>
                <Image source={require('../assets/images/POL-AI.jpeg')} style={styles.aiImage} />
                <View style={styles.aiBubble}>
                  <ActivityIndicator size="small" color="#4F46E5" />
                </View>
              </View>
            )}

            {!isTyping && (
              <View style={styles.presetOptionsGroup}>
                {PRESET_OPTIONS.map((option, index) => (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      styles.presetButtonIOS,
                      index < PRESET_OPTIONS.length - 1 && styles.presetButtonSeparator,
                    ]}
                    onPress={() => handlePresetSelect(option)}
                  >
                    <Text style={styles.presetButtonTextIOS}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Input fijo, siempre visible sobre el teclado */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Escribe tu mensaje..."
                placeholderTextColor="#9CA3AF"
                onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isTyping}>
                <Text style={styles.sendButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  keyboardAvoidingContainer: { flex: 1 },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  aiBubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  userBubbleWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    maxWidth: '85%',
  },
  aiImage: {
    width: 36,
    height: 36,
    marginRight: 8,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopRightRadius: 4,
  },
  aiBubbleText: { fontSize: 16, color: '#111827', lineHeight: 22 },
  userBubbleText: { fontSize: 16, color: '#FFFFFF', lineHeight: 22 },
  presetOptionsGroup: {
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  presetButtonIOS: { paddingVertical: 14, paddingHorizontal: 16 },
  presetButtonSeparator: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  presetButtonTextIOS: { fontSize: 16, color: '#3B82F6', textAlign: 'center', fontWeight: '500' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
