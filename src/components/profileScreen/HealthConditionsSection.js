// components/HealthConditionsSection.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HealthConditionsSection = ({ userInfo, onEdit, getLabelForValue }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Condiciones de Salud</Text>
      <TouchableOpacity
        style={styles.option}
        onPress={() => onEdit('condicionesSalud')}
      >
        <View style={styles.optionContent}>
          <Ionicons name="medkit-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Condiciones</Text>
        </View>
        <Text style={styles.optionValue}>
          {getLabelForValue('condicionesSalud', userInfo.condicionesSalud)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Importar estilos desde ProfileStyles.js
import { styles } from '../../styles/ProfileStyles';

export default HealthConditionsSection;
