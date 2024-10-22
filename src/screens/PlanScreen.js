import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../services/firebase';
// Datos iniciales del usuario
const usuario = {
  informacionPersonal: {
    nombre: 'Juan Pérez',
    correo: 'juan.perez@example.com',
    genero: 'masculino',
    fechaNacimiento: '1990-05-15',
  },
  medidasFisicas: {
    pesoKg: 75,
    alturaCm: 175,
    nivelActividad: 'moderadamente_activo',
  },
  objetivoPersonal: {
    tipoObjetivo: 'mantener_peso',
  },
};

// Calcular la edad del usuario
const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

// Calcular peso objetivo basado en el tipo de objetivo
const calcularPesoObjetivo = (pesoActual, tipoObjetivo) => {
  switch (tipoObjetivo) {
    case 'perder_peso':
      return pesoActual * 0.9;
    case 'ganar_peso':
      return pesoActual * 1.1;
    default:
      return pesoActual;
  }
};

// Definir distribución de macronutrientes según el objetivo
const obtenerDistribucionMacronutrientes = (tipoObjetivo) => {
  switch (tipoObjetivo) {
    case 'perder_peso':
      return { carbohidratos: 40, proteinas: 35, grasas: 25 };
    case 'ganar_peso':
      return { carbohidratos: 50, proteinas: 30, grasas: 20 };
    default:
      return { carbohidratos: 50, proteinas: 20, grasas: 30 };
  }
};

// Calcular calorías con la fórmula Harris-Benedict
const calcularCalorias = (peso, altura, edad, genero, nivelActividad) => {
  let tmb;
  if (genero === 'masculino') {
    tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
  } else {
    tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
  }

  const factorActividad = {
    sedentario: 1.2,
    ligeramente_activo: 1.375,
    moderadamente_activo: 1.55,
    muy_activo: 1.725,
    extra_activo: 1.9,
  };

  return Math.round(tmb * factorActividad[nivelActividad]);
};

// Calcular distribución de macronutrientes
const calcularMacronutrientes = (caloriasTotales, distribucion) => {
  const { carbohidratos, proteinas, grasas } = distribucion;
  const gramosCarbohidratos = (caloriasTotales * (carbohidratos / 100)) / 4;
  const gramosProteinas = (caloriasTotales * (proteinas / 100)) / 4;
  const gramosGrasas = (caloriasTotales * (grasas / 100)) / 9;

  return {
    carbohidratos: gramosCarbohidratos.toFixed(2),
    proteinas: gramosProteinas.toFixed(2),
    grasas: gramosGrasas.toFixed(2),
  };
};

// Guardar ID en AsyncStorage
const guardarIdEnAsyncStorage = async (usuarioId) => {
  try {
    await AsyncStorage.setItem('usuarioId', usuarioId);
    console.log(`ID de usuario guardado: ${usuarioId}`);
  } catch (error) {
    console.error('Error al guardar el ID en AsyncStorage:', error);
  }
};

// Crear un nuevo usuario en Firebase
const crearUsuario = async (datosUsuario) => {
  try {
    const usuarioRef = await addDoc(collection(db, 'usuarios'), datosUsuario);
    console.log('Usuario creado:', JSON.stringify(datosUsuario, null, 2));
    await guardarIdEnAsyncStorage(usuarioRef.id); // Guardar el ID en AsyncStorage
  } catch (error) {
    console.error('Error al crear el usuario:', error);
  }
};

export default function MainScreen() {
  const [calorias, setCalorias] = useState(null);
  const [macronutrientes, setMacronutrientes] = useState(null);

  const handleCalcular = () => {
    const edad = calcularEdad(usuario.informacionPersonal.fechaNacimiento);
    const pesoObjetivo = calcularPesoObjetivo(usuario.medidasFisicas.pesoKg, usuario.objetivoPersonal.tipoObjetivo);

    const distribucion = obtenerDistribucionMacronutrientes(usuario.objetivoPersonal.tipoObjetivo);

    const caloriasCalculadas = calcularCalorias(
      usuario.medidasFisicas.pesoKg,
      usuario.medidasFisicas.alturaCm,
      edad,
      usuario.informacionPersonal.genero,
      usuario.medidasFisicas.nivelActividad
    );

    setCalorias(caloriasCalculadas);

    const macros = calcularMacronutrientes(caloriasCalculadas, distribucion);
    setMacronutrientes(macros);

    const datosUsuarioFinal = {
      ...usuario,
      objetivoPersonal: {
        ...usuario.objetivoPersonal,
        pesoObjetivoKg: pesoObjetivo,
        metaCalorias: caloriasCalculadas,
        distribucionMacronutrientes: distribucion,
        macronutrientes: macros,
      },
    };

    crearUsuario(datosUsuarioFinal);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Calcular y Crear Usuario" onPress={handleCalcular} />
      {calorias && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Calorías Diarias: {calorias} kcal</Text>
          <Text>Carbohidratos: {macronutrientes.carbohidratos} g</Text>
          <Text>Proteínas: {macronutrientes.proteinas} g</Text>
          <Text>Grasas: {macronutrientes.grasas} g</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
});
