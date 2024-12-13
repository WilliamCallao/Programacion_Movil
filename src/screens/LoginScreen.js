
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Animated, Easing } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../services/firebase';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User signed in successfully!');

      try {
        await AsyncStorage.setItem('usuarioId', user.uid);
        console.log('Usuario ID almacenado en AsyncStorage:', user.uid);
      } catch (storageError) {
        console.error('Error al almacenar usuarioId en AsyncStorage:', storageError);
        setError('No se pudo almacenar la información del usuario. Inténtalo nuevamente.');
      }

    } catch (error) {
      console.error('Authentication error:', error.message);
      setError('Error de Autenticación: ' + error.message);
    }
  };

  // Animación para los iconos
  const spinValue = new Animated.Value(0);
  Animated.loop(
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    )
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <FontAwesome5 name="apple-alt" size={50} color="#fff" />
      </Animated.View>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Correo Electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="Iniciar Sesión" onPress={handleLogin} color="#3498db" />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.toggleText} onPress={() => navigation.navigate('RegisterScreen')}>
            ¿Necesitas una cuenta? Regístrate
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2c3e50',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    elevation: 3,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;