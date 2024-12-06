// components/ActivityLevelSection.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActivityLevelSection = ({ userInfo, onEdit, getLabelForValue }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Nivel de Actividad</Text>
      <TouchableOpacity
        style={styles.option}
        onPress={() => onEdit('nivelActividad')}
      >
        <View style={styles.optionContent}>
          <Ionicons name="walk-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Nivel de Actividad</Text>
        </View>
        <Text style={styles.optionValue}>
          {getLabelForValue('nivelActividad', userInfo.nivelActividad)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Importar estilos desde ProfileStyles.js
import { styles } from '../styles/ProfileStyles';

export default ActivityLevelSection;
