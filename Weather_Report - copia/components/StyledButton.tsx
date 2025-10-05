import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Colors from '../constants/COLORS';

// Definimos las propiedades que nuestro botón aceptará
type StyledButtonProps = {
  label: string;
  onPress?: () => void;
  loading?: boolean;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

export function StyledButton({ label, loading, ...pressableProps }: StyledButtonProps) {
  return (
    <Pressable
      {...pressableProps}
      // El estilo del botón cambia si está siendo presionado (feedback táctil)
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: Colors.light.tint,
          opacity: pressed ? 0.8 : 1,
        },
        pressableProps.disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12, // Bordes redondeados, clave en el diseño iOS
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600', // Un peso de fuente semibold es muy común
    fontFamily: 'Inter-SemiBold',
  },
  disabled: {
    backgroundColor: '#A9A9A9', // Estilo para cuando el botón está deshabilitado
  },
});