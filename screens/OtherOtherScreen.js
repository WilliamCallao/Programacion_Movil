// OtherOtherScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OtherOtherScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla 3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8E2FD',
  },
  text: {
    fontSize: 16,
    color: '#000'
  },
});
