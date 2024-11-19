// screens/PersonalInfoScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';
import { actualizarUsuario } from '../services/usuarioService';

const PersonalInfoScreen = () => {
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState('');
  const navigation = useNavigation();

  const handleNext = async () => {
    const user = auth.currentUser;
    if (user) {
      const datosActualizados = {
        'informacion_personal.nombre': nombre,
        'informacion_personal.fecha_nacimiento': fechaNacimiento,
        'informacion_personal.genero': genero,
      };
      await actualizarUsuario(user.uid, datosActualizados);
      navigation.navigate('PhysicalInfoScreen');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Información Personal</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
        />
        <TextInput
          style={styles.input}
          value={fechaNacimiento}
          onChangeText={setFechaNacimiento}
          placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
        />
        <TextInput
          style={styles.input}
          value={genero}
          onChangeText={setGenero}
          placeholder="Género"
        />
        <View style={styles.buttonContainer}>
          <Button title="Siguiente" onPress={handleNext} color="#3498db" />
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
});

export default PersonalInfoScreen;