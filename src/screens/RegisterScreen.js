import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../services/firebase';
import { doc, setDoc } from "firebase/firestore";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar datos iniciales del usuario en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        id_usuario: user.uid,
        informacion_personal: {
          nombre: nombre,
          correo: email,
          contraseña: password, // No es seguro guardar contraseñas en texto plano
          foto_perfil_url: "",
          fecha_nacimiento: null,
          genero: ""
        },
        medidas_fisicas: {
          peso_kg: null,
          altura_cm: null,
          nivel_actividad: ""
        },
        preferencias: {
          preferencias_dietarias: [],
          condiciones_salud: []
        },
        objetivos: {
          tipo_objetivo: ""
        }
      });

      console.log('User created successfully!');
      navigation.navigate('UserInfoNavigator'); // Navega a UserInfoNavigator
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Registrarse</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Correo Electrónico"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="Registrarse" onPress={handleRegister} color="#3498db" />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.toggleText} onPress={() => navigation.navigate('LoginScreen')}>
            ¿Ya tienes una cuenta? Inicia Sesión
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
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
});

export default RegisterScreen;