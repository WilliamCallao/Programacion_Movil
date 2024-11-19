// screens/GoalsScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';
import { actualizarUsuario } from '../services/usuarioService';

const GoalsScreen = () => {
  const [metaCalorias, setMetaCalorias] = useState('');
  const [carbohidratos, setCarbohidratos] = useState('');
  const [proteinas, setProteinas] = useState('');
  const [grasas, setGrasas] = useState('');
  const [pesoObjetivo, setPesoObjetivo] = useState('');
  const [tipoObjetivo, setTipoObjetivo] = useState('');
  const navigation = useNavigation();

  const handleFinish = async () => {
    const user = auth.currentUser;
    if (user) {
      const datosActualizados = {
        'objetivos.meta_calorias': parseFloat(metaCalorias),
        'objetivos.distribucion_macronutrientes.carbohidratos': parseFloat(carbohidratos),
        'objetivos.distribucion_macronutrientes.proteinas': parseFloat(proteinas),
        'objetivos.distribucion_macronutrientes.grasas': parseFloat(grasas),
        'objetivo_peso.peso_objetivo_kg': parseFloat(pesoObjetivo),
        'objetivo_peso.tipo_objetivo': tipoObjetivo,
      };
      await actualizarUsuario(user.uid, datosActualizados);
      navigation.navigate('AppNavigator');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Objetivos</Text>
        <TextInput
          style={styles.input}
          value={metaCalorias}
          onChangeText={setMetaCalorias}
          placeholder="Meta de Calorías"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={carbohidratos}
          onChangeText={setCarbohidratos}
          placeholder="Carbohidratos (%)"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={proteinas}
          onChangeText={setProteinas}
          placeholder="Proteínas (%)"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={grasas}
          onChangeText={setGrasas}
          placeholder="Grasas (%)"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={pesoObjetivo}
          onChangeText={setPesoObjetivo}
          placeholder="Peso Objetivo (kg)"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={tipoObjetivo}
          onChangeText={setTipoObjetivo}
          placeholder="Tipo de Objetivo"
        />
        <View style={styles.buttonContainer}>
          <Button title="Finalizar" onPress={handleFinish} color="#3498db" />
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

export default GoalsScreen;