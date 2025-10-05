import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';

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
  const [modalVisible, setModalVisible] = useState(false);

  // Obtener fecha actual
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.toLocaleString('es-ES', { month: 'long' });

  // Determinar placeholder dinámico
  let placeholder = 'Selecciona';
  if (!selectedValue) {
    if (label.toLowerCase().includes('mes')) placeholder = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
    else if (label.toLowerCase().includes('día')) placeholder = currentDay.toString();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity
            style={styles.pickerContainer}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.selectedText}>
              {items.find((item) => item.value === selectedValue)?.label || placeholder}
            </Text>
            <Ionicons name="chevron-down" size={30} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContentIOS}>
                <Text style={styles.modalTitle}>
                  {label.toLowerCase().includes('mes')
                    ? 'Selecciona un mes'
                    : label.toLowerCase().includes('día')
                    ? 'Selecciona un día'
                    : `Selecciona ${label.toLowerCase()}`}
                </Text>
                <View style={styles.pickerIOSWrapper}>
                  <Picker
                    selectedValue={selectedValue}
                    onValueChange={(value, idx) => {
                      onValueChange(value, idx);
                      setModalVisible(false);
                    }}
                    style={styles.pickerIOS}
                  >
                    {items.map((item) => (
                      <Picker.Item key={item.value} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={[styles.picker, { fontSize: 18, minWidth: 120 }]}
          >
            {items.map((item) => (
              <Picker.Item key={item.value} label={item.label} value={item.value} />
            ))}
          </Picker>
          {/* Solo mostrar la flecha en iOS */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontFamily: 'Inter-Regular', fontSize: 14, color: '#333', marginBottom: 8 },

  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    position: 'relative',
    ...Platform.select({
      ios: {
        height: 44,
      },
      android: {
        height: 54,
        paddingVertical: 16,
        minWidth: 120,
      },
    }),
  },
  selectedText: { flex: 1, fontSize: 16, color: '#333' },
  picker: {
    flex: 1,
    height: 44,
    color: '#333',
    backgroundColor: 'transparent',
    ...Platform.select({
      android: {
        fontSize: 20,
        minWidth: 180,
        height: 54,
      },
    }),
  },
  icon: {
    position: 'absolute',
    right: 8,
    top: 12,
    ...Platform.select({
      android: {
        display: 'none',
      },
    }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentIOS: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 320,
    maxWidth: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  pickerIOSWrapper: {
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 12,
    marginVertical: 12,
    overflow: 'hidden',
  },
  pickerIOS: {
    width: '100%',
    height: 180,
    color: '#333',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButtonText: { color: '#333', fontSize: 16 },
});