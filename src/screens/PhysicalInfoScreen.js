import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';
import { actualizarUsuario } from '../services/usuarioService';
import { Picker } from '@react-native-picker/picker';

const PhysicalInfoScreen = () => {
  const [pesoEntero, setPesoEntero] = useState('35');
  const [pesoDecimal, setPesoDecimal] = useState('0');
  const [altura, setAltura] = useState('120');
  const [nivelActividad, setNivelActividad] = useState('');
  const navigation = useNavigation();

  const handleNext = async () => {
    const user = auth.currentUser;
    if (user) {
      const peso = parseFloat(`${pesoEntero}.${pesoDecimal}`);
      const datosActualizados = {
        'medidas_fisicas.peso_kg': peso,
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
        <Text style={styles.label}>Peso (kg)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pesoEntero}
            style={styles.picker}
            onValueChange={(itemValue) => setPesoEntero(itemValue)}
          >
            {Array.from({ length: 191 }, (_, i) => i + 35).map((value) => (
              <Picker.Item key={value} label={`${value}`} value={`${value}`} />
            ))}
          </Picker>
          <Text style={styles.decimalSeparator}>.</Text>
          <Picker
            selectedValue={pesoDecimal}
            style={styles.picker}
            onValueChange={(itemValue) => setPesoDecimal(itemValue)}
          >
            {Array.from({ length: 10 }, (_, i) => i).map((value) => (
              <Picker.Item key={value} label={`${value}`} value={`${value}`} />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Altura (cm)</Text>
        <Picker
          selectedValue={altura}
          style={styles.picker}
          onValueChange={(itemValue) => setAltura(itemValue)}
        >
          {Array.from({ length: 101 }, (_, i) => i + 120).map((value) => (
            <Picker.Item key={value} label={`${value}`} value={`${value}`} />
          ))}
        </Picker>
        <Text style={styles.label}>Nivel de Actividad</Text>
        <Picker
          selectedValue={nivelActividad}
          style={styles.picker}
          onValueChange={(itemValue) => setNivelActividad(itemValue)}
        >
          <Picker.Item label="Selecciona tu nivel de actividad" value="" />
          <Picker.Item label="Sedentario" value="sedentario" />
          <Picker.Item label="Ligeramente Activo" value="ligeramente_activo" />
          <Picker.Item label="Moderadamente Activo" value="moderadamente_activo" />
          <Picker.Item label="Activo" value="activo" />
          <Picker.Item label="Muy Activo" value="muy_activo" />
        </Picker>
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
  label: {
    fontSize: 16,
    marginBottom: 8,
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

export default PhysicalInfoScreen;