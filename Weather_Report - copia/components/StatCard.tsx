import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Define los tipos para las props del componente
type StatCardProps = {
  title: string;
  probability: number;
  description: string;
  backgroundColor: string;
  textColor: string;
};

export const StatCard = ({ title, probability, description, backgroundColor, textColor }: StatCardProps) => {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={[styles.probability, { color: textColor }]}>
        {(probability * 100).toFixed(0)}%
      </Text>
      <Text style={[styles.description, { color: textColor, opacity: 0.8 }]}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    minWidth: '48%',
    gap: 4,
    // Sombra sutil estilo iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  probability: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    lineHeight: 40,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});