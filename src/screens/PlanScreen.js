// MainScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import HeaderSections from '../components/HeaderSections';
import PlanSelector from '../components/PlanSelector';

const SECTION_HEIGHT_PERCENTAGES = [5, 10, 8, 10, 17];
const COLORS = ['#FFF', '#33FF57', '#3357FF', '#FF33A6', '#F3FF33', '#33FFF5'];

export default function MainScreen() {
  const { height } = Dimensions.get('window');
  const totalUsedHeightPercentage = SECTION_HEIGHT_PERCENTAGES.reduce((sum, percentage) => sum + percentage, 0);
  const remainingHeightPercentage = 100 - totalUsedHeightPercentage;

  const [selectedButton, setSelectedButton] = useState('Hoy');

  const handleButtonPress = (button) => {
    setSelectedButton(button);
  };

  return (
    <View style={styles.container}>
      {/* Secciones 1, 2 y 3 */}
      <HeaderSections />

      {/* Sección 4 */}
      <PlanSelector selectedButton={selectedButton} onButtonPress={handleButtonPress} />

      {/* Secciones 5, 6 y 7 */}
      {selectedButton === 'Semanal' ? (
        <View style={[styles.section7, { backgroundColor: COLORS[4], height: (height * (SECTION_HEIGHT_PERCENTAGES[4] + remainingHeightPercentage)) / 100 }]}>
          <Text style={styles.text}>Sección 7</Text>
        </View>
      ) : (
        <>
          <View style={[styles.section5, { backgroundColor: COLORS[4], height: (height * SECTION_HEIGHT_PERCENTAGES[4]) / 100 }]}>
            <Text style={styles.text}>Sección 5</Text>
          </View>
          <View style={[styles.section6, { backgroundColor: COLORS[5], height: (height * remainingHeightPercentage) / 100 }]}>
            <Text style={styles.text}>Sección 6</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section5: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section6: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section7: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
    fontFamily: 'Poppins_500Medium',
  },
});
