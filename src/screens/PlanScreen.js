// MainScreen.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

const SECTION_HEIGHT_PERCENTAGES = [5, 10, 10, 10, 17];
const COLORS = ['#FFF', '#33FF57', '#3357FF', '#FF33A6', '#F3FF33', '#33FFF5'];

export default function MainScreen() {
  const { height } = Dimensions.get('window');
  const totalUsedHeightPercentage = SECTION_HEIGHT_PERCENTAGES.reduce((sum, percentage) => sum + percentage, 0);
  const remainingHeightPercentage = 100 - totalUsedHeightPercentage;

  return (
    <View style={styles.container}>
      <View style={[styles.section1, { height: (height * SECTION_HEIGHT_PERCENTAGES[0]) / 100 }]}> 
      </View>
      <View style={[styles.section2, { height: (height * SECTION_HEIGHT_PERCENTAGES[1]) / 100, paddingHorizontal: 20, paddingVertical: 5 }]}> 
        <View style={styles.avatarCircle} />
      </View>
      <View style={[styles.section3, { height: (height * SECTION_HEIGHT_PERCENTAGES[2]) / 100 }]}> 
        <Text style={styles.section3Text}>Cada comida cuenta!</Text>
        <View style={styles.underline} />
      </View>
      <View style={[styles.section4, { backgroundColor: COLORS[3], height: (height * SECTION_HEIGHT_PERCENTAGES[3]) / 100 }]}> 
        <Text style={styles.text}>Sección 4</Text>
      </View>
      <View style={[styles.section5, { backgroundColor: COLORS[4], height: (height * SECTION_HEIGHT_PERCENTAGES[4]) / 100 }]}> 
        <Text style={styles.text}>Sección 5</Text>
      </View>
      <View style={[styles.section6, { backgroundColor: COLORS[5], height: (height * remainingHeightPercentage) / 100 }]}> 
        <Text style={styles.text}>Sección 6</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section3: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section4: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section5: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section6: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
    fontFamily: 'Poppins_500Medium',
  },
  section3Text: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Poppins_600SemiBold',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  underline: {
    width: '90%',
    height: 2,
    backgroundColor: '#818181',
    marginTop: 5,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'gray',
    marginRight: 20,
  },
});
