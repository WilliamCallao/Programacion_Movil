// src/screens/GoalsScreen.js

import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { actualizarUsuario, generarYAsignarPlanAlimenticio } from '../services/usuarioService';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

const GoalsScreen = ({ navigation }) => {
  const [preferenciasDietarias, setPreferenciasDietarias] = useState([]);
  const [tipoObjetivo, setTipoObjetivo] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const { completeRegistration } = useContext(AuthContext);

  // preferencias y objetivos del usuario
  const handleFinish = async () => {
    try {
      const userId = await AsyncStorage.getItem('usuarioId');
      if (userId) {
        if (!tipoObjetivo) {
          Alert.alert('Error', 'Por favor, selecciona un tipo de objetivo.');
          return false;
        }

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

  // generar y asignar el plan alimenticio
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

  // finalizar y generar el plan
  const handleFinishAndGeneratePlan = async () => {
    const finishSuccess = await handleFinish();
    if (finishSuccess) {
      setIsGeneratingPlan(true);
      await handleGenerarPlan();
      setIsGeneratingPlan(false);
    }
  };

  const opcionesDietarias = [
    { id: 'Vegetariano', name: 'Vegetariano' },
    { id: 'Vegano', name: 'Vegano' },
    { id: 'Gluten-Free', name: 'Gluten-Free' },
    { id: 'Low Sodium', name: 'Low Sodium' },
    { id: 'Lower Carb', name: 'Lower Carb' },
    { id: 'High in Fiber', name: 'High in Fiber' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Preferencias y Objetivos</Text>
        <Text style={styles.label}>Preferencias Dietarias</Text>
        <MultiSelect
          items={opcionesDietarias}
          uniqueKey="id"
          onSelectedItemsChange={setPreferenciasDietarias}
          selectedItems={preferenciasDietarias}
          selectText="Selecciona tus preferencias"
          searchInputPlaceholderText="Buscar preferencias..."
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Seleccionar"
        />
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
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
});

export default GoalsScreen;
