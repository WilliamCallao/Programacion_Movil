import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../services/firebase';
import { actualizarUsuario } from '../services/usuarioService';
import MultiSelect from 'react-native-multiple-select';

const GoalsScreen = ({ navigation }) => {
  const [preferenciasDietarias, setPreferenciasDietarias] = useState([]);
  const [tipoObjetivo, setTipoObjetivo] = useState('');

  const opcionesDietarias = [
    { id: 'vegetariano', name: 'Vegetariano' },
    { id: 'vegano', name: 'Vegano' },
    { id: 'gluten-free', name: 'Gluten-Free' },
    { id: 'low sodium', name: 'Low Sodium' },
    { id: 'lower carb', name: 'Lower Carb' },
    { id: 'high in fiber', name: 'High in Fiber' },
  ];

  const handleFinish = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const datosActualizados = {
          'preferencias.preferencias_dietarias': preferenciasDietarias,
          'objetivo_peso.tipo_objetivo': tipoObjetivo,
        };
        await actualizarUsuario(user.uid, datosActualizados);
        console.log('Datos del usuario actualizados en Firebase.');
        navigation.navigate('AppNavigator', { screen: 'PlanScreen' }); // Navega a PlanScreen dentro de AppNavigator
      }
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error.message);
    }
  };

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