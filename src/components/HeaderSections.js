// components/HeaderSections.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const SECTION_HEIGHT_PERCENTAGES = [5, 10, 4];

export default function HeaderSections({ dia = "Lunes", calorias = 2805 }) {
  const { height } = Dimensions.get('window');

  return (
    <View>
      {/* Sección 1 */}
      <View style={[styles.section1, { height: (height * SECTION_HEIGHT_PERCENTAGES[0]) / 100 }]} />

      {/* Sección 2 */}
      <View style={[styles.section2, { height: (height * SECTION_HEIGHT_PERCENTAGES[1]) / 100, paddingVertical: 5 }]}>
        <View style={styles.avatarCircle} />
      </View>

      {/* Sección 3: Día y Calorías en una sola línea */}
      <View style={[styles.section3, { height: (height * SECTION_HEIGHT_PERCENTAGES[2]) / 100 }]}>
        <View style={styles.inlineRow}>
          <Ionicons name="calendar-outline" size={22} color="#333" />
          <Text style={styles.inlineText}>{dia},</Text>
          <MaterialCommunityIcons name="fire" size={22} color="#FF6B6B" style={{ marginLeft: 8 }} />
          <Text style={styles.inlineText}>{calorias} kcal</Text>
        </View>
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
    alignItems: 'flex-start',
    marginLeft: 15,
  },
  section3: {
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineText: {
    fontSize: 20,
    fontFamily: 'DMSans_500Medium',
    color: 'black',
    marginLeft: 4,
  },
  underline: {
    width: '90%',
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 8,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'gray',
  },
});
