// src/navigation/RootNavigator.js

import React, { useContext } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import AuthNavigator from './AuthNavigator';
import UserInfoNavigator from './UserInfoNavigator';
import AppNavigator from './AppNavigator';
import FloatingNavbar from '../components/common/BottomNavbar';
import { AuthContext } from '../context/AuthContext';

const RootNavigator = () => {
  const { user, isRegistered, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Image
          source={require('../../assets/img-splash.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  if (user && !isRegistered) {
    return <UserInfoNavigator />;
  }

  return (
    <>
      <AppNavigator />
      <FloatingNavbar />
    </>
  );
};

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

export default RootNavigator;
