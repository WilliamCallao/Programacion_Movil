import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'; // Cambiado a createStackNavigator
import { View, StyleSheet } from 'react-native';
import MainScreen from './screens/MainScreen';
import OtherScreen from './screens/OtherScreen';
import FloatingNavbar from './FloatingNavbar';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName="MainScreen"
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS, // Ahora esto debería funcionar correctamente
          }}
        >
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name="OtherScreen" component={OtherScreen} />
        </Stack.Navigator>
        <FloatingNavbar />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
