import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CalendarProgress from '../components/progressScreen/ProgressCalendar';
import ButtonWeight from '../components/progressScreen/ButtonWeight';
import PesoActualCard from '../components/progressScreen/WeightCard';
import DiasCocinandoCard from '../components/progressScreen/DaysCard';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import WeightChart from '../components/progressScreen/graphCard';
import ButtonRecetaRealizada from '../components/progressScreen/ButtonDay';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Ajusta la ruta según tu proyecto

export default function ProgressScreen() {
  const [shouldReloadPesoCard, setShouldReloadPesoCard] = useState(false);

  useEffect(() => {
    const verificarPesoInicial = async () => {
      try {
        const usuarioId = await AsyncStorage.getItem('usuarioId');
        if (!usuarioId) return;

        const usuarioDocRef = doc(db, 'usuarios', usuarioId);
        const usuarioSnapshot = await getDoc(usuarioDocRef);

        if (usuarioSnapshot.exists()) {
          const datosUsuario = usuarioSnapshot.data();
          const medidas = datosUsuario.medidas_fisicas || {};
          const { peso_kg, peso_inicial } = medidas;

          // Si no existe peso_inicial y existe peso_kg, lo creamos
          if (peso_kg && peso_inicial === undefined) {
            await updateDoc(usuarioDocRef, {
              'medidas_fisicas.peso_inicial': peso_kg,
            });
            console.log('Peso inicial asignado al usuario');
            setShouldReloadPesoCard((prev) => !prev); // Fuerza la recarga
          }
        }
      } catch (error) {
        console.error('Error al verificar/crear el peso_inicial:', error);
      }
    };

    verificarPesoInicial();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.inlineText}>Control de objetivos</Text>
        <MaterialCommunityIcons name="trophy" size={22} color="#FFD700" style={styles.trophyIcon} />
      </View>
      <View style={styles.underline} />
      <PesoActualCard key={shouldReloadPesoCard} /> {/* El key fuerza el re-render */}
      <WeightChart />
      <View style={styles.buttonContainer}>
        <ButtonWeight />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.inlineText}>Racha de recetas</Text>
        <MaterialCommunityIcons name="pot-steam" size={30} color="#f4a020" style={styles.trophyIcon} />
      </View>
      <View style={styles.underline} />
      <DiasCocinandoCard />
      <CalendarProgress />
      <ButtonRecetaRealizada />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  underline: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  inlineText: {
    fontSize: 20,
    fontFamily: 'DMSans_500Medium',
    color: 'black',
    marginRight: 8,
    marginTop: 18,
  },
  trophyIcon: {
    marginLeft: 8,
    marginTop: 18,
  },
});
