import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing, ActivityIndicator, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { actualizarUsuario } from '../../services/usuarioService';
import { auth } from '../../services/firebase';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const PhysicalInfoScreen = () => {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [nivelActividad, setNivelActividad] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleNext = async () => {
    const user = auth.currentUser;
    if (user && nivelActividad && peso && altura) {
      setLoading(true);
      const datosActualizados = {
        'medidas_fisicas.peso_kg': parseFloat(peso),
        'medidas_fisicas.altura_cm': parseFloat(altura),
        'medidas_fisicas.nivel_actividad': nivelActividad,
      };
      await actualizarUsuario(user.uid, datosActualizados);
      setLoading(false);
      navigation.navigate('GoalsScreen');
    } else {
      console.log('Faltan datos por completar.');
    }
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
        <FontAwesome5 name="dumbbell" size={50} color="#fff" />
      </Animated.View>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Información Física</Text>
        <Text style={styles.label}>Peso (kg)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            placeholder="Ingresa tu peso"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.label}>Altura (cm)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={altura}
            onChangeText={setAltura}
            placeholder="Ingresa tu altura"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.label}>Nivel de Actividad</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={nivelActividad}
            style={styles.picker}
            onValueChange={(itemValue) => setNivelActividad(itemValue)}
          >
            <Picker.Item label="Selecciona tu nivel de actividad" value="" enabled={false} />
            <Picker.Item label="Sedentario" value="sedentario" />
            <Picker.Item label="Ligeramente Activo" value="ligeramente_activo" />
            <Picker.Item label="Moderadamente Activo" value="moderadamente_activo" />
            <Picker.Item label="Activo" value="activo" />
            <Picker.Item label="Muy Activo" value="muy_activo" />
          </Picker>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.button, {
              backgroundColor: nivelActividad && peso && altura ? 'black' : '#555',
              borderColor: nivelActividad && peso && altura ? 'black' : '#555',
            }]}
            disabled={!nivelActividad || !peso || !altura || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Siguiente</Text>
            )}
          </TouchableOpacity>
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
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#d3d3d3',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  button: {
    borderRadius: 25,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: '#fff',
  },
});

export default PhysicalInfoScreen;
