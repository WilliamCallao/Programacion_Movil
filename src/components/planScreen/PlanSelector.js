// components/PlanSelector.js

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlanSelector({ selectedButton, onButtonPress }) {
  const { width } = Dimensions.get('window');

  return (
    <View style={styles.section4}>
      <View style={styles.buttonContainer}>
        {/* Botón Hoy */}
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Hoy' && styles.buttonSelected,
          ]}
          onPress={() => onButtonPress('Hoy')}
        >
          <Ionicons
            name="sunny-outline"
            size={23}
            color={selectedButton === 'Hoy' ? '#fff' : '#929292'}
          />
          <Text
            style={selectedButton === 'Hoy' ? styles.buttonTextSelected : styles.buttonText}
            numberOfLines={1}
          >
            Hoy
          </Text>
        </TouchableOpacity>

        {/* Botón Mañana */}
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Mañana' && styles.buttonSelected,
          ]}
          onPress={() => onButtonPress('Mañana')}
        >
          <Ionicons
            name="time-outline"
            size={23}
            color={selectedButton === 'Mañana' ? '#fff' : '#929292'}
          />
          <Text
            style={selectedButton === 'Mañana' ? styles.buttonTextSelected : styles.buttonText}
            numberOfLines={1}
          >
            Mañana
          </Text>
        </TouchableOpacity>

        {/* Botón Plan Semanal */}
        <TouchableOpacity
          style={[
            styles.button,
            styles.semanaButton,
            selectedButton === 'Semana' && styles.buttonSelected,
          ]}
          onPress={() => onButtonPress('Semana')}
        >
          <Ionicons
            name="calendar-outline"
            size={23}
            color={selectedButton === 'Semana' ? '#fff' : '#929292'}
          />
          <Text
            style={selectedButton === 'Semana' ? styles.buttonTextSelected : styles.buttonText}
            numberOfLines={1}
          >
            Semana
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section4: {
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingRight: 5,
    paddingLeft: 15,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#C7C6C6',
    marginRight: 10,
  },
  semanaButton: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonSelected: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  buttonText: {
    color: '#929292',
    fontSize: 13,
    marginLeft: 4,
    fontFamily: 'DMSans_400Medium',
    textAlign: 'center',
  },
  buttonTextSelected: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
    fontFamily: 'DMSans_500Medium',
    textAlign: 'center',
  },
});
