// components/ObjectiveSection.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ObjectiveSection = ({ userInfo, onEdit, getLabelForValue }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tipo de Objetivo</Text>
      <TouchableOpacity
        style={styles.option}
        onPress={() => onEdit('objetivo')}
      >
        <View style={styles.optionContent}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Objetivo</Text>
        </View>
        <Text style={styles.optionValue}>
          {getLabelForValue('objetivo', userInfo.objetivo)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Importar estilos desde ProfileStyles.js
import { styles } from '../styles/ProfileStyles';

export default ObjectiveSection;
