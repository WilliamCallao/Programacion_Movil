// src/navigation/RootNavigator.js

import React, { useContext } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AuthNavigator from './AuthNavigator';
import UserInfoNavigator from './UserInfoNavigator';
import AppNavigator from './AppNavigator';
import FloatingNavbar from '../components/BottomNavbar';
import { AuthContext } from '../context/AuthContext';

const RootNavigator = () => {
  const { user, isRegistered, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#333" />
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
  },
});

export default RootNavigator;
