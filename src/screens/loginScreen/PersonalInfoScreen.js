import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Platform, TouchableOpacity, Animated, Easing, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../services/firebase';
import { actualizarUsuario } from '../../services/usuarioService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';

const PersonalInfoScreen = () => {
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [genero, setGenero] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();

  const handleNext = async () => {
    if (!nombre || !genero) return;
    setIsSubmitting(true);

    const user = auth.currentUser;
    if (user) {
      try {
        const datosActualizados = {
          'informacion_personal.nombre': nombre,
          'informacion_personal.fecha_nacimiento': fechaNacimiento.toISOString().split('T')[0],
          'informacion_personal.genero': genero,
        };
        await actualizarUsuario(user.uid, datosActualizados);
        navigation.navigate('PhysicalInfoScreen');
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('No se encontró usuario.');
      setIsSubmitting(false);
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

  // Animación para los iconos
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
        <FontAwesome5 name="lemon" size={50} color="#fff" />
      </Animated.View>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Información Personal</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
          placeholderTextColor="#888"
        />
        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <TouchableOpacity onPress={showDatepicker} style={[styles.dateButton, { borderRadius: 12 }]}>  
          <Text style={styles.dateButtonText}>{fechaNacimiento.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={fechaNacimiento}
            mode="date"
            display="default"
            onChange={onDateChange}
            style={styles.datePicker}
          />
        )}
        <Text style={styles.label}>Género</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={genero}
            style={styles.picker}
            onValueChange={(itemValue) => setGenero(itemValue)}
          >
            <Picker.Item label="Selecciona una opción" value="" enabled={false} />
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Femenino" value="femenino" />
            <Picker.Item label="Otro" value="otro" />
          </Picker>
        </View>
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.callToActionButton, (!nombre || !genero) && styles.disabledButton]}
          disabled={!nombre || !genero || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.callToActionText}>Siguiente</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEEF0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  authContainer: {
    width: '90%',
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
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#d3d3d3',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dateButton: {
    backgroundColor: '#d3d3d3',
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    color: '#2c3e50',
    textAlign: 'center',
    fontSize: 16,
  },
  datePicker: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  callToActionButton: {
    backgroundColor: 'black',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#555',
    borderColor: '#555',
  },
  callToActionText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
    textAlign: 'center',
  },
});

export default PersonalInfoScreen;
