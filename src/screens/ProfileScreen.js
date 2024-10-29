import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('LoginScreen'); // Redirige a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
      <Button title="Cerrar Sesión" onPress={handleLogout} color="#e74c3c" />
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
    color: '#000',
    marginBottom: 20,
  },
});