// components/DietTypeSection.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/ProfileStyles';

const DietTypeSection = ({ userInfo, onEdit, getLabelForValue, fieldKey = 'tipoDieta', displayName = 'Tipo de Dieta' }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{displayName}</Text>
      <TouchableOpacity
        style={styles.option}
        onPress={() => onEdit(fieldKey)}
      >
        <View style={styles.optionContent}>
          <Ionicons name="nutrition-outline" size={24} color="#000" />
          <Text style={styles.optionText}>{displayName}</Text>
        </View>
        <Text style={styles.optionValue}>
          {getLabelForValue(fieldKey, userInfo[fieldKey])}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DietTypeSection;
