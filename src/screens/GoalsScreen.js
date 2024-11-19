// screens/GoalsScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';
import { actualizarUsuario } from '../services/usuarioService';
import { Picker } from '@react-native-picker/picker';
import AppNavigator from '../navigation/AppNavigator';

const GoalsScreen = ({navigation}) => {
  const [metaCalorias, setMetaCalorias] = useState('');
  const [carbohidratos, setCarbohidratos] = useState('');
  const [proteinas, setProteinas] = useState('');
  const [grasas, setGrasas] = useState('');
  const [pesoObjetivoEntero, setPesoObjetivoEntero] = useState('35');
  const [pesoObjetivoDecimal, setPesoObjetivoDecimal] = useState('0');
  const [tipoObjetivo, setTipoObjetivo] = useState('');

  const handleFinish = async () => {
    try {
    const user = auth.currentUser;
    if (user) {
      const pesoObjetivo = parseFloat(`${pesoObjetivoEntero}.${pesoObjetivoDecimal}`);
      const datosActualizados = {
        'objetivos.meta_calorias': parseFloat(metaCalorias),
        'objetivos.distribucion_macronutrientes.carbohidratos': parseFloat(carbohidratos),
        'objetivos.distribucion_macronutrientes.proteinas': parseFloat(proteinas),
        'objetivos.distribucion_macronutrientes.grasas': parseFloat(grasas),
        'objetivo_peso.peso_objetivo_kg': pesoObjetivo,
        'objetivo_peso.tipo_objetivo': tipoObjetivo,
      };
      await actualizarUsuario(user.uid, datosActualizados);
      console.log('Datos del usuario actualizados en Firebase.');
      navigation.navigate('AppNavigator'); // Navega a AppNavigator
    }
  } catch (error) {
    console.error('Error al actualizar datos del usuario:', error.message);
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
        <Text style={styles.label}>Peso Objetivo (kg)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pesoObjetivoEntero}
            style={styles.picker}
            onValueChange={(itemValue) => setPesoObjetivoEntero(itemValue)}
          >
            {Array.from({ length: 191 }, (_, i) => i + 35).map((value) => (
              <Picker.Item key={value} label={`${value}`} value={`${value}`} />
            ))}
          </Picker>
          <Text style={styles.decimalSeparator}>.</Text>
          <Picker
            selectedValue={pesoObjetivoDecimal}
            style={styles.picker}
            onValueChange={(itemValue) => setPesoObjetivoDecimal(itemValue)}
          >
            {Array.from({ length: 10 }, (_, i) => i).map((value) => (
              <Picker.Item key={value} label={`${value}`} value={`${value}`} />
            ))}
          </Picker>
        </View>
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
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  decimalSeparator: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  buttonContainer: {
    marginBottom: 16,
  },
});

export default GoalsScreen;