// src/navigation/AppNavigator.js

import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import PlanScreen from '../screens/PlanScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProgressScreen from '../screens/ProgressScreen';
import RecipesScreen from '../screens/RecipesScreen';
import { FavoritesProvider } from '../contexts/FavoritesContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <FavoritesProvider>    
        <Stack.Navigator
        initialRouteName="PlanScreen"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="PlanScreen" component={PlanScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
        <Stack.Screen name="RecipesScreen" component={RecipesScreen} />
      </Stack.Navigator>
    </FavoritesProvider>

  );
};

export default AppNavigator;
