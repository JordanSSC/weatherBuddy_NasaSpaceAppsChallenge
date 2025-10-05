import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

// Define los tipos para las props
type PickerItem = {
  label: string;
  value: string | number;
};

type StyledPickerProps = {
  label: string;
  items: PickerItem[];
  selectedValue: string | number;
  onValueChange: (itemValue: string | number, itemIndex: number) => void;
};

export const StyledPicker = ({ label, items, selectedValue, onValueChange }: StyledPickerProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
        {/* El ícono de flecha no es necesario en iOS porque ya lo muestra nativamente */}
        {Platform.OS === 'android' && <Ionicons name="chevron-down" size={20} color="#888" style={styles.icon} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    // En iOS, el contenedor debe tener una altura fija para que el picker se vea bien
    height: Platform.OS === 'ios' ? 44 : undefined,
  },
  picker: {
    // El estilo del picker es muy limitado, especialmente en iOS donde es 100% nativo.
    // La mayor parte del estilo se aplica al contenedor.
    // En iOS, para evitar que el texto esté centrado por defecto, lo movemos
    ...Platform.select({
      ios: {
        height: '100%',
        width: '100%',
      },
    }),
  },
  icon: {
    position: 'absolute',
    right: 16,
  },
});