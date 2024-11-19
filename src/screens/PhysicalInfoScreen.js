// screens/PhysicalInfoScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';
import { actualizarUsuario } from '../services/usuarioService';

const PhysicalInfoScreen = () => {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [nivelActividad, setNivelActividad] = useState('');
  const navigation = useNavigation();

  const handleNext = async () => {
    const user = auth.currentUser;
    if (user) {
      const datosActualizados = {
        'medidas_fisicas.peso_kg': parseFloat(peso),
        'medidas_fisicas.altura_cm': parseFloat(altura),
        'medidas_fisicas.nivel_actividad': nivelActividad,
      };
      await actualizarUsuario(user.uid, datosActualizados);
      navigation.navigate('GoalsScreen');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Información Física</Text>
        <TextInput
          style={styles.input}
          value={peso}
          onChangeText={setPeso}
          placeholder="Peso (kg)"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={altura}
          onChangeText={setAltura}
          placeholder="Altura (cm)"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={nivelActividad}
          onChangeText={setNivelActividad}
          placeholder="Nivel de Actividad"
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

export default PhysicalInfoScreen;