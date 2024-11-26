

import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, Animated, Easing } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { actualizarUsuario, generarYAsignarPlanAlimenticio } from '../services/usuarioService';
import { FontAwesome5 } from '@expo/vector-icons';

const GoalsScreen = ({ navigation }) => {
  const [tipoDieta, setTipoDieta] = useState('');
  const [condicionSalud, setCondicionSalud] = useState('');
  const [tipoObjetivo, setTipoObjetivo] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const { completeRegistration } = useContext(AuthContext);

  const handleFinish = async () => {
    try {
      const userId = await AsyncStorage.getItem('usuarioId');
      if (userId) {
        if (!tipoObjetivo) {
          Alert.alert('Error', 'Por favor, selecciona un tipo de objetivo.');
          return false;
        }

        const preferenciasDietarias = [];
        if (tipoDieta === 'vegana') preferenciasDietarias.push('vegano');
        if (tipoDieta === 'vegetariana') preferenciasDietarias.push('vegetariano');
        if (condicionSalud === 'lower carb') preferenciasDietarias.push('lower-carb');
        if (condicionSalud === 'gluten-free') preferenciasDietarias.push('gluten-free');
        if (condicionSalud === 'high in fiber') preferenciasDietarias.push('high-in-fiber');
        if (condicionSalud === 'low sodium') preferenciasDietarias.push('low-sodium');

        const datosActualizados = {
          'preferencias.preferencias_dietarias': preferenciasDietarias,
          'objetivo_peso.tipo_objetivo': tipoObjetivo,
        };
        await actualizarUsuario(userId, datosActualizados);
        console.log('Datos del usuario actualizados en Firebase.');
        return true;
      } else {
        console.log('No se encontró usuarioId en AsyncStorage.');
        Alert.alert('Error', 'No se encontró el identificador del usuario. Por favor, inicia sesión nuevamente.');
        return false;
      }
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error.message);
      Alert.alert('Error', 'Ocurrió un error al actualizar tus datos. Por favor, intenta nuevamente.');
      return false;
    }
  };

  const handleGenerarPlan = async () => {
    try {
      const userId = await AsyncStorage.getItem('usuarioId');
      if (userId) {
        await generarYAsignarPlanAlimenticio(userId);
        await completeRegistration();
        Alert.alert('Éxito', 'Tu plan alimenticio ha sido generado exitosamente.');
      } else {
        console.log('No se encontró usuarioId en AsyncStorage.');
        Alert.alert('Error', 'No se encontró el identificador del usuario. Por favor, inicia sesión nuevamente.');
      }
    } catch (error) {
      console.error('Error al generar el plan alimenticio:', error.message);
      Alert.alert('Error', 'Ocurrió un error al generar tu plan alimenticio. Por favor, intenta nuevamente.');
    }
  };

  const handleFinishAndGeneratePlan = async () => {
    const finishSuccess = await handleFinish();
    if (finishSuccess) {
      setIsGeneratingPlan(true);
      await handleGenerarPlan();
      setIsGeneratingPlan(false);
    }
  };

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
        <FontAwesome5 name="bullseye" size={50} color="#fff" />
      </Animated.View>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Preferencias y Objetivos</Text>
        <Text style={styles.label}>Tipo de Dieta</Text>
        <Picker
          selectedValue={tipoDieta}
          style={styles.picker}
          onValueChange={(itemValue) => setTipoDieta(itemValue)}
        >
          <Picker.Item label="Selecciona tu tipo de dieta" value="" />
          <Picker.Item label="No restrictiva" value="" />
          <Picker.Item label="Vegana" value="vegana" />
          <Picker.Item label="Vegetariana" value="vegetariana" />
        </Picker>
        <Text style={styles.label}>Condiciones de Salud</Text>
        <Picker
          selectedValue={condicionSalud}
          style={styles.picker}
          onValueChange={(itemValue) => setCondicionSalud(itemValue)}
        >
          <Picker.Item label="Selecciona tu condición de salud" value="" />
          <Picker.Item label="Diabetes tipo 1" value="lower carb" />
          <Picker.Item label="Diabetes tipo 2" value="lower carb" />
          <Picker.Item label="Resistencia a la insulina" value="lower carb" />
          <Picker.Item label="Celiaco" value="gluten-free" />
          <Picker.Item label="Sobrepeso" value="high in fiber" />
          <Picker.Item label="Presión alta" value="low sodium" />
          <Picker.Item label="Insuficiencia cardiaca" value="low sodium" />
          <Picker.Item label="Problemas renales" value="low sodium" />
        </Picker>
        <Text style={styles.label}>Tipo de Objetivo</Text>
        <Picker
          selectedValue={tipoObjetivo}
          style={styles.picker}
          onValueChange={(itemValue) => setTipoObjetivo(itemValue)}
        >
          <Picker.Item label="Selecciona tu objetivo" value="" />
          <Picker.Item label="Perder Peso" value="perder_peso" />
          <Picker.Item label="Mantener Peso" value="mantener_peso" />
          <Picker.Item label="Ganar Peso" value="ganar_peso" />
        </Picker>
        <View style={styles.buttonContainer}>
          <Button
            title={isGeneratingPlan ? "Generando Plan..." : "Finalizar y Generar Plan"}
            onPress={handleFinishAndGeneratePlan}
            color="#9b59b6"
            disabled={isGeneratingPlan}
          />
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
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonContainer: {
    marginBottom: 16,
  },
});

export default GoalsScreen;