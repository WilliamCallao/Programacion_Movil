// src/screens/MainScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { 
  calcularEdad, 
  calcularPesoObjetivo, 
  obtenerDistribucionMacronutrientes, 
  calcularCalorias, 
  calcularMacronutrientes, 
  crearUsuario 
} from '../services/usuarioService';

import { useNavigation } from '@react-navigation/native';

// Datos iniciales del usuario
const usuario = {
  informacionPersonal: {
    nombre: 'Jhon',
    correo: 'JhonDoe@example.com',
    genero: 'Masculino',
    fechaNacimiento: '2001-05-20',
  },
  medidasFisicas: {
    pesoKg: 75,
    alturaCm: 175,
    nivelActividad: 'moderadamente_activo',
  },
  objetivoPersonal: {
    tipoObjetivo: 'mantener_peso',
  },
  preferencias: {
    preferencias_dietarias: [ 
      // Tipos de dieta preferida (keys válidos):
      // "Vegetariano", "Vegano", "Gluten-Free", "Low Sodium", "Lower Carb", "High in Fiber"
      // "Vegetariano", 
      // "Gluten-Free"
    ], 
    condiciones_salud: [
      // Condiciones de salud (keys válidos):
      // "CKD Non-Dialysis", "CKD Dialysis", "Kid Friendly", "Kidney-Friendly"
      // "CKD Non-Dialysis",
      // "Kid Friendly"
    ],
  },
};

export default function MainScreen() {
  const [calorias, setCalorias] = useState(null);
  const [macronutrientes, setMacronutrientes] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigation = useNavigation();

  const handleCalcular = async () => {
    try {
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
        informacion_personal: {
          nombre: usuario.informacionPersonal.nombre,
          correo: usuario.informacionPersonal.correo,
          contraseña: 'password',
          foto_perfil_url: '',
          fecha_nacimiento: new Date(usuario.informacionPersonal.fechaNacimiento),
          genero: usuario.informacionPersonal.genero,
        },
        medidas_fisicas: {
          peso_kg: usuario.medidasFisicas.pesoKg,
          altura_cm: usuario.medidasFisicas.alturaCm,
          nivel_actividad: usuario.medidasFisicas.nivelActividad,
        },
        preferencias: {
          preferencias_dietarias: usuario.preferencias.preferencias_dietarias, 
          condiciones_salud: usuario.preferencias.condiciones_salud,
        },
        objetivos: {
          tipo_objetivo: usuario.objetivoPersonal.tipoObjetivo,
          peso_objetivo_kg: pesoObjetivo,
          meta_calorias: caloriasCalculadas,
          distribucion_macronutrientes: distribucion,
          macronutrientes: macros,
        },
        actividad: {
          recetas_favoritas: [],
          seguimiento_progreso: {
            historial_peso: [],
          },
        },
        planes_alimentacion: [],
      };

      await crearUsuario(datosUsuarioFinal);
      setMensaje('Usuario y plan alimenticio creados exitosamente.');
    } catch (error) {
      console.error(error);
      setMensaje('Error al crear el usuario y el plan alimenticio.');
    }
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
      {mensaje ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{mensaje}</Text>
        </View>
      ) : null}
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
  messageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: 'green',
  },
});
