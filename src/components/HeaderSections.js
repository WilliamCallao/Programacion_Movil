// components/HeaderSections.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const SECTION_HEIGHT_PERCENTAGES = [5, 10, 8];

export default function HeaderSections() {
  const { height } = Dimensions.get('window');

  return (
    <View>
      {/* Sección 1 */}
      <View style={[styles.section1, { height: (height * SECTION_HEIGHT_PERCENTAGES[0]) / 100 }]}>
      </View>

      {/* Sección 2 */}
      <View style={[styles.section2, { height: (height * SECTION_HEIGHT_PERCENTAGES[1]) / 100, paddingHorizontal: 20, paddingVertical: 5 }]}>
        <View style={styles.avatarCircle} />
      </View>

      {/* Sección 3 */}
      <View style={[styles.section3, { height: (height * SECTION_HEIGHT_PERCENTAGES[2]) / 100 }]}>
        <Text style={styles.section3Text}>Cada comida cuenta!</Text>
        <View style={styles.underline} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section3: {
    marginTop: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  section3Text: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Poppins_600SemiBold',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  underline: {
    width: '90%',
    height: 2,
    backgroundColor: '#818181',
    // marginTop: 15,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'gray',
    marginRight: 20,
  },
});
