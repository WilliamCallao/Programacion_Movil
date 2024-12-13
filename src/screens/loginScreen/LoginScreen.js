import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Animated, Easing, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../services/firebase';
import { AuthContext } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const buttonDynamic = (isLoading) => ({
  backgroundColor: isLoading ? '#555' : 'black',
  borderColor: isLoading ? '#555' : 'black',
  borderWidth: 1,
  borderRadius: 8,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'center',
});

const textDynamic = (isLoading) => ({
  color: '#fff',
  fontSize: 14,
  fontFamily: 'DMSans_500Medium',
  textAlign: 'center',
  opacity: isLoading ? 0 : 1,
});

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para manejar el mensaje de error
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(''); // Limpiar cualquier error previo
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User signed in successfully!');

      try {
        await AsyncStorage.setItem('usuarioId', user.uid);
        console.log('Usuario ID almacenado en AsyncStorage:', user.uid);
      } catch (storageError) {
        console.error('Error al almacenar usuarioId en AsyncStorage:', storageError);
        setErrorMessage('No se pudo almacenar la información del usuario. Inténtalo nuevamente.');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      setErrorMessage('Credenciales incorrectas. Por favor, inténtalo de nuevo.'); // Actualiza el mensaje de error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <FontAwesome5 name="apple-alt" size={50} color="#fff" />
      </Animated.View>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Correo Electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.inputPass, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#929292"
            />
          </TouchableOpacity>
        </View>

        {/* Mostrar mensaje de error */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={[styles.dynamicButton, buttonDynamic(isLoading)]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={textDynamic(isLoading)}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
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
  inputPass: {
    height: 50,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingRight: 12,
    marginBottom: 16,
  },
  dynamicButton: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 20,
  },
});

export default LoginScreen;
