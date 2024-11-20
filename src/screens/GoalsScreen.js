// src/screens/GoalsScreen.js

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { actualizarUsuario, generarYAsignarPlanAlimenticio } from '../services/usuarioService';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const GoalsScreen = ({ navigation }) => {
  const [preferenciasDietarias, setPreferenciasDietarias] = useState([]);
  const [tipoObjetivo, setTipoObjetivo] = useState('');

  // Función para obtener y mostrar el documento del usuario sin formatear
  const fetchUserDocument = async () => {
    try {
      const userId = await AsyncStorage.getItem('usuarioId');
      if (userId) {
        const userDocRef = doc(db, 'usuarios', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          console.log('Documento del usuario:', JSON.stringify(userDoc.data(), null, 2));
          Alert.alert('Información', 'Consulta exitosa en la consola.');
        } else {
          console.log('No se encontró el documento del usuario.');
          Alert.alert('Error', 'No se encontró el documento del usuario.');
        }
      } else {
        console.log('No se encontró usuarioId en AsyncStorage.');
        Alert.alert('Error', 'No se encontró usuarioId en AsyncStorage.');
      }
    } catch (error) {
      console.error('Error al obtener el documento del usuario:', error.message);
      Alert.alert('Error', 'Hubo un problema al obtener el documento del usuario.');
    }
  };

  const handleLogUsuario = async () => {
    try {
      const userId = await AsyncStorage.getItem('usuarioId');
      if (userId) {
        const userDocRef = doc(db, 'usuarios', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
  
          // Construir el objeto 'usuario' en la estructura deseada
          const usuario = {
            informacionPersonal: {
              nombre: data.informacion_personal.nombre,
              correo: data.informacion_personal.correo,
              genero: data.informacion_personal.genero,
              fechaNacimiento: data.informacion_personal.fecha_nacimiento, // Ya es una cadena
              fotoPerfilUrl: data.informacion_personal.foto_perfil_url,
            },
            medidasFisicas: {
              pesoKg: data.medidas_fisicas.peso_kg,
              alturaCm: data.medidas_fisicas.altura_cm,
              nivelActividad: data.medidas_fisicas.nivel_actividad,
            },
            objetivoPersonal: {
              tipoObjetivo: data.objetivo_peso.tipo_objetivo,
            },
            preferencias: {
              preferencias_dietarias: data.preferencias.preferencias_dietarias,
              condiciones_salud: data.preferencias.condiciones_salud,
            },
          };
  
          console.log('Usuario Formateado:', JSON.stringify(usuario, null, 2));
          Alert.alert('Información', 'Usuario logueado en la consola.');
        } else {
          console.log('No se encontró el documento del usuario.');
          Alert.alert('Error', 'No se encontró el documento del usuario.');
        }
      } else {
        console.log('No se encontró usuarioId en AsyncStorage.');
        Alert.alert('Error', 'No se encontró usuarioId en AsyncStorage.');
      }
    } catch (error) {
      console.error('Error al loguear el usuario:', error.message);
      Alert.alert('Error', 'Hubo un problema al loguear el usuario.');
    }
  };

  // Función para actualizar las preferencias y objetivos del usuario
  const handleFinish = async () => {
    try {
      const userId = await AsyncStorage.getItem('usuarioId');
      if (userId) {
        const datosActualizados = {
          'preferencias.preferencias_dietarias': preferenciasDietarias,
          'objetivo_peso.tipo_objetivo': tipoObjetivo,
        };
        await actualizarUsuario(userId, datosActualizados);
        console.log('Datos del usuario actualizados en Firebase.');
        Alert.alert('Éxito', 'Datos actualizados correctamente.');
      } else {
        console.log('No se encontró usuarioId en AsyncStorage.');
        Alert.alert('Error', 'No se encontró usuarioId en AsyncStorage.');
      }
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error.message);
      Alert.alert('Error', 'Hubo un problema al actualizar los datos del usuario.');
    }
  };

  // Función para generar y asignar el plan alimenticio
  const handleGenerarPlan = async () => {
    try {
      const userId = await AsyncStorage.getItem('usuarioId');
      if (userId) {
        await generarYAsignarPlanAlimenticio(userId);
        Alert.alert('Éxito', 'Plan alimenticio generado y asignado al usuario.');
      } else {
        console.log('No se encontró usuarioId en AsyncStorage.');
        Alert.alert('Error', 'No se encontró usuarioId en AsyncStorage.');
      }
    } catch (error) {
      console.error('Error al generar el plan alimenticio:', error.message);
      Alert.alert('Error', 'Hubo un problema al generar el plan alimenticio.');
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
          <Button title="Finalizar" onPress={handleFinish} color="#3498db" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Ver Documento" onPress={fetchUserDocument} color="#2ecc71" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Log Usuario" onPress={handleLogUsuario} color="#e67e22" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Generar Plan Alimenticio" onPress={handleGenerarPlan} color="#9b59b6" />
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
