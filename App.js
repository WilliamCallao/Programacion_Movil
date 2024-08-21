import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import MainScreen from './screens/MainScreen';
import OtherScreen from './screens/OtherScreen';
import FloatingNavbar from './FloatingNavbar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Stack.Navigator initialRouteName="MainScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name="OtherScreen" component={OtherScreen} />
        </Stack.Navigator>
        <FloatingNavbar />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
