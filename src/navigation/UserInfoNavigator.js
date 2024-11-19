// navigation/UserInfoNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import PhysicalInfoScreen from '../screens/PhysicalInfoScreen';
import GoalsScreen from '../screens/GoalsScreen';

const Stack = createStackNavigator();

const UserInfoNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
      <Stack.Screen name="PhysicalInfoScreen" component={PhysicalInfoScreen} />
      <Stack.Screen name="GoalsScreen" component={GoalsScreen} />
    </Stack.Navigator>
  );
};

export default UserInfoNavigator;