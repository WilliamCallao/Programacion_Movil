import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Animated, Easing, TouchableOpacity, ActivityIndicator } from 'react-native';
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
    if (!tipoObjetivo) return;
    setIsGeneratingPlan(true);
    const finishSuccess = await handleFinish();
    if (finishSuccess) {
      await handleGenerarPlan();
    }
    setIsGeneratingPlan(false);
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
        <Text style={styles.label}>Tipo de Dieta <Text style={styles.optional}>(Opcional)</Text></Text>
        <Picker
          selectedValue={tipoDieta}
          style={[styles.picker, styles.pickerOptional]}
          onValueChange={(itemValue) => setTipoDieta(itemValue)}
        >
          <Picker.Item label="Selecciona tu tipo de dieta" value="" enabled={false} />
          <Picker.Item label="No restrictiva" value="" />
          <Picker.Item label="Vegana" value="vegana" />
          <Picker.Item label="Vegetariana" value="vegetariana" />
        </Picker>
        <Text style={styles.label}>Condiciones de Salud <Text style={styles.optional}>(Opcional)</Text></Text>
        <Picker
          selectedValue={condicionSalud}
          style={[styles.picker, styles.pickerOptional]}
          onValueChange={(itemValue) => setCondicionSalud(itemValue)}
        >
          <Picker.Item label="Selecciona tu condición de salud" value="" enabled={false} />
          <Picker.Item label="Diabetes tipo 1" value="diabetes_tipo_1" />
          <Picker.Item label="Diabetes tipo 2" value="diabetes_tipo_2" />
          <Picker.Item label="Resistencia a la insulina" value="resistencia_insulina" />
          <Picker.Item label="Celiaco" value="celiaco" />
          <Picker.Item label="Sobrepeso" value="sobrepeso" />
          <Picker.Item label="Presión alta" value="presion_alta" />
          <Picker.Item label="Insuficiencia cardiaca" value="insuficiencia_cardiaca" />
          <Picker.Item label="Problemas renales" value="problemas_renales" />
        </Picker>
        <Text style={styles.label}>Tipo de Objetivo</Text>
        <Picker
          selectedValue={tipoObjetivo}
          style={[styles.picker, styles.pickerRequired]}
          onValueChange={(itemValue) => setTipoObjetivo(itemValue)}
        >
          <Picker.Item label="Selecciona tu objetivo" value="" enabled={false} />
          <Picker.Item label="Perder Peso" value="perder_peso" />
          <Picker.Item label="Mantener Peso" value="mantener_peso" />
          <Picker.Item label="Ganar Peso" value="ganar_peso" />
        </Picker>
        <TouchableOpacity
          style={[styles.button, (!tipoObjetivo || isGeneratingPlan) && styles.buttonDisabled]}
          onPress={handleFinishAndGeneratePlan}
          disabled={!tipoObjetivo || isGeneratingPlan}
        >
          {isGeneratingPlan ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Finalizar y Generar Plan</Text>
          )}
        </TouchableOpacity>
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
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  optional: {
    fontSize: 12,
    color: '#999',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#d3d3d3',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerOptional: {
    backgroundColor: '#fff',
    color: '#000',
  },
  pickerRequired: {
    backgroundColor: '#d3d3d3',
    color: '#000',
  },
  button: {
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoalsScreen;
