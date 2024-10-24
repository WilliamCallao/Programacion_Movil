// components/PlanSelector.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

export default function PlanSelector({ selectedButton, onButtonPress }) {
  const { height } = Dimensions.get('window');

  return (
    <View style={[styles.section4, { height: (height * 10) / 100 }]}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.largeButton,
            selectedButton === 'Semanal' && styles.buttonSelected,
          ]}
          onPress={() => onButtonPress('Semanal')}
        >
          <Text style={selectedButton === 'Semanal' ? styles.buttonTextSelected : styles.buttonText} numberOfLines={1}>Semanal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.smallButton,
            selectedButton === 'Hoy' && styles.buttonSelected,
          ]}
          onPress={() => onButtonPress('Hoy')}
        >
          <Text style={selectedButton === 'Hoy' ? styles.buttonTextSelected : styles.buttonText} numberOfLines={1}>Hoy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.mediumButton,
            selectedButton === 'Mañana' && styles.buttonSelected,
          ]}
          onPress={() => onButtonPress('Mañana')}
        >
          <Text style={selectedButton === 'Mañana' ? styles.buttonTextSelected : styles.buttonText} numberOfLines={1}>Mañana</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section4: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  button: {
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    paddingVertical: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  smallButton: {
    flex: 1,
  },
  mediumButton: {
    flex: 1.5,
  },
  largeButton: {
    flex: 2,
  },
  buttonSelected: {
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    paddingTop: 3,
  },
  buttonTextSelected: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
    paddingTop: 3,
  },
});
