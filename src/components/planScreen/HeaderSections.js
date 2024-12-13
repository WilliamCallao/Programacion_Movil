import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const SECTION_HEIGHT_PERCENTAGES = [5, 10, 4];

export default function HeaderSections({ dia = "Lunes", calorias = 2805 }) {
  const { height } = Dimensions.get('window'); 

  return (
    <View>
      <View style={[styles.section1, { height: (height * SECTION_HEIGHT_PERCENTAGES[0]) / 100 }]} />

      <View
        style={[styles.section2, { height: (height * SECTION_HEIGHT_PERCENTAGES[1]) / 100, paddingVertical: 5 }]}>
        <View style={styles.avatarCircle}> 
          <Ionicons name="person" size={30} color="white" />
        </View>
      </View>

      <View style={[styles.section3, { height: (height * SECTION_HEIGHT_PERCENTAGES[2]) / 100 }]}> {/* Información principal */}
        <View style={styles.inlineRow}> 
          <Ionicons name="calendar-outline" size={22} color="#333" />
          <Text style={styles.inlineText}>{dia},</Text>
          <MaterialCommunityIcons name="fire" size={22} color="#FF6B6B" style={{ marginLeft: 8 }} />
          <Text style={styles.inlineText}>{calorias} kcal</Text>
        </View>
        <View style={styles.underline} /> {/* Línea decorativa */}
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#777',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
