import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';
import { actualizarUsuario } from '../services/usuarioService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const PersonalInfoScreen = () => {
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [genero, setGenero] = useState('');
  const navigation = useNavigation();

  const handleNext = async () => {
    const user = auth.currentUser;
    if (user) {
      const datosActualizados = {
        'informacion_personal.nombre': nombre,
        'informacion_personal.fecha_nacimiento': fechaNacimiento.toISOString().split('T')[0],
        'informacion_personal.genero': genero,
      };
      await actualizarUsuario(user.uid, datosActualizados);
      navigation.navigate('PhysicalInfoScreen');
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fechaNacimiento;
    setShowDatePicker(Platform.OS === 'ios');
    setFechaNacimiento(currentDate);
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
        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <Button onPress={showDatepicker} title={fechaNacimiento.toDateString()} />
        {showDatePicker && (
          <DateTimePicker
            value={fechaNacimiento}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <Text style={styles.label}>Género</Text>
        <Picker
          selectedValue={genero}
          style={styles.picker}
          onValueChange={(itemValue) => setGenero(itemValue)}
        >
          <Picker.Item label="Selecciona tu género" value="" />
          <Picker.Item label="Masculino" value="masculino" />
          <Picker.Item label="Femenino" value="femenino" />
          <Picker.Item label="Otro" value="otro" />
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
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
});

export default PersonalInfoScreen;