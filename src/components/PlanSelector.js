// components/PlanSelector.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

export default function PlanSelector({ selectedButton, onButtonPress }) {
  const { height } = Dimensions.get('window');

  return (
    <View style={[styles.section4, { height: (height * 9) / 100 }]}>
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
    marginTop: 2,
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
    borderColor: '#C7C6C6',
    borderRadius: 30,
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
    backgroundColor: '#000',
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center',
    paddingVertical: 4,
    paddingBottom: 6,
  },
  buttonTextSelected: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
    textAlign: 'center',
    paddingVertical: 4,
    paddingBottom: 6,
  },
});
