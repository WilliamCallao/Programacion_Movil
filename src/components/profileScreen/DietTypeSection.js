// components/DietTypeSection.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/ProfileStyles';

const DietTypeSection = ({ userInfo, onEdit, getLabelForValue }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tipo de Dieta</Text>
      <TouchableOpacity
        style={styles.option}
        onPress={() => onEdit('tipoDieta')}
      >
        <View style={styles.optionContent}>
          <Ionicons name="nutrition-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Tipo de Dieta</Text>
        </View>
        <Text style={styles.optionValue}>
          {getLabelForValue('tipoDieta', userInfo.tipoDieta)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DietTypeSection;
