// components/profileScreen/HealthConditionSection.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/ProfileStyles';

const HealthConditionSection = ({ userInfo, onEdit, getLabelForValue }) => {
  // Obtener todas las condiciones de salud actuales
  const currentConditions = userInfo.condicionesSalud || [];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Condiciones de Salud</Text>
      <TouchableOpacity
        style={styles.option}
        onPress={() => onEdit('condicionesSalud')}
      >
        <View style={styles.optionContent}>
          <Ionicons name="heart-circle-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Condición de Salud</Text>
        </View>
        <Text style={styles.optionValue}>
          {currentConditions.length > 0
            ? getLabelForValue('condicionesSalud', currentConditions)
            : 'Ninguna'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HealthConditionSection;
