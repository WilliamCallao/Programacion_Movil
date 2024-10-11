import React from 'react';
import { View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import FloatingNavbar from './src/components/BottomNavbar';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <AppNavigator />
        <FloatingNavbar />
      </View>
    </NavigationContainer>
  );
}
