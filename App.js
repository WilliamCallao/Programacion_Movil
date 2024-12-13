// App.js
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { useFonts as usePoppins, Poppins_100Thin, Poppins_200ExtraLight,
  Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold,
  Poppins_700Bold, Poppins_800ExtraBold, Poppins_900Black,
} from '@expo-google-fonts/poppins';
import { useFonts as useDMSans, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold,
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
      <View style={styles.loaderContainer}>
        <Image
          source={require('./assets/img-splash.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  splashImage: {
    width: 180,
  },
});
