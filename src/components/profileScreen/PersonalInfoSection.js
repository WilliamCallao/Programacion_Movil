// components/PersonalInfoSection.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/ProfileStyles';

const PersonalInfoSection = ({ userInfo, onEdit, getLabelForValue }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Información Personal</Text>
      {['nombre', 'correo', 'fechaNacimiento', 'genero', 'altura', 'peso'].map((field) => (
        <TouchableOpacity
          key={field}
          style={styles.option}
          onPress={() => onEdit(field)}
        >
          <View style={styles.optionContent}>
            <Ionicons
              name={
                field === 'fechaNacimiento' ? 'calendar-outline' : 'person-outline'
              }
              size={24}
              color="#000"
            />
            <Text style={styles.optionText}>
              {field === 'fechaNacimiento'
                ? 'Fecha de Nacimiento'
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </Text>
          </View>
          <Text style={styles.optionValue}>
            {field === 'fechaNacimiento'
              ? userInfo.fechaNacimiento.toLocaleDateString()
              : field === 'altura'
              ? `${userInfo.altura} cm`
              : field === 'peso'
              ? `${userInfo.peso} kg`
              : field === 'genero'
              ? getLabelForValue(field, userInfo[field])
              : userInfo[field]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PersonalInfoSection;
