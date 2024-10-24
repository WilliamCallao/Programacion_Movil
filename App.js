import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import FloatingNavbar from './src/components/BottomNavbar';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts as usePoppins, Poppins_100Thin, Poppins_200ExtraLight,
  Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold,
  Poppins_700Bold, Poppins_800ExtraBold, Poppins_900Black,
} from '@expo-google-fonts/poppins';
import {useFonts as useDMSans, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

export default function App() {
  let [poppinsLoaded] = usePoppins({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  let [dmSansLoaded] = useDMSans({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!poppinsLoaded || !dmSansLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <AppNavigator />
        <FloatingNavbar />
      </View>
    </NavigationContainer>
  );
}
