import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

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
    nivelActividad: 'moderadamente_activo', // Opciones: "sedentario", "ligeramente_activo", etc.
  },
  objetivoPersonal: {
    tipoObjetivo: 'mantener_peso', // Opciones: "perder_peso", "mantener_peso", "ganar_peso"
    pesoObjetivoKg: 75,
  },
  preferenciasDieteticas: {
    dietasPreferidas: ['vegetariano', 'gluten-free'],
    condicionesSalud: ['CKD No Diálisis', 'Kid Friendly'],
  }
};

export default function MainScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido, {usuario.informacionPersonal.nombre}</Text>
      <Text style={styles.sectionTitle}>Información Personal</Text>
      <Text>Correo: {usuario.informacionPersonal.correo}</Text>
      <Text>Género: {usuario.informacionPersonal.genero}</Text>
      <Text>Fecha de Nacimiento: {usuario.informacionPersonal.fechaNacimiento}</Text>

      <Text style={styles.sectionTitle}>Medidas Físicas</Text>
      <Text>Peso: {usuario.medidasFisicas.pesoKg} kg</Text>
      <Text>Altura: {usuario.medidasFisicas.alturaCm} cm</Text>
      <Text>Nivel de Actividad: {usuario.medidasFisicas.nivelActividad}</Text>

      <Text style={styles.sectionTitle}>Objetivo Personal</Text>
      <Text>Objetivo: {usuario.objetivoPersonal.tipoObjetivo}</Text>
      <Text>Peso Objetivo: {usuario.objetivoPersonal.pesoObjetivoKg} kg</Text>

      <Text style={styles.sectionTitle}>Preferencias Dietéticas</Text>
      <Text>Dietas Preferidas: {usuario.preferenciasDieteticas.dietasPreferidas.join(', ')}</Text>
      <Text>Condiciones de Salud: {usuario.preferenciasDieteticas.condicionesSalud.join(', ')}</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#555',
  }
});
