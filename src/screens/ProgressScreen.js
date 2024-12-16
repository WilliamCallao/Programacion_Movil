// screens/ProgressScreen.js
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import CalendarProgress from '../components/progressScreen/ProgressCalendar';
import ButtonWeight from '../components/progressScreen/ButtonWeight';
import PesoActualCard from '../components/progressScreen/WeightCard';
import DiasCocinandoCard from '../components/progressScreen/DaysCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WeightChart from '../components/progressScreen/graphCard';
import ButtonRecetaRealizada from '../components/progressScreen/ButtonDay';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { RefreshContext } from '../contexts/RefreshContext'; // Importa el contexto

export default function ProgressScreen() {
  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { refresh, triggerRefresh, resetRefresh } = useContext(RefreshContext);

  // Función para obtener los datos del usuario desde Firestore
  const fetchData = useCallback(async () => {
    try {
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId) {
        console.error('No se encontró el usuarioId en AsyncStorage.');
        setLoading(false);
        return;
      }

      const usuarioDocRef = doc(db, 'usuarios', usuarioId);
      const docSnapshot = await getDoc(usuarioDocRef);

      if (docSnapshot.exists()) {
        const datos = docSnapshot.data();
        const medidas = datos.medidas_fisicas || {};
        const { peso_kg, peso_inicial } = medidas;

        // Si no existe peso_inicial y existe peso_kg, lo creamos
        if (peso_kg && peso_inicial === undefined) {
          await updateDoc(usuarioDocRef, {
            'medidas_fisicas.peso_inicial': peso_kg,
          });
          console.log('Peso inicial asignado al usuario');
        }

        setUsuarioData(datos);
      } else {
        console.error('El documento del usuario no existe.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      setLoading(false);
    }
  }, []);

  // Obtener los datos cuando el componente se monta
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Escuchar el estado de refresco y recargar datos si es necesario
  useEffect(() => {
    if (refresh) {
      setLoading(true);
      fetchData();
      resetRefresh();
    }
  }, [refresh, fetchData, resetRefresh]);

  // Función para manejar el refresco manual (pulgar hacia abajo)
  const onRefresh = useCallback(() => {
    triggerRefresh();
  }, [triggerRefresh]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View style={styles.headerContainer}>
        <Text style={styles.inlineText}>Control de objetivos</Text>
        <MaterialCommunityIcons name="trophy" size={22} color="#FFD700" style={styles.trophyIcon} />
      </View>
      <View style={styles.underline} />
      <PesoActualCard data={usuarioData?.medidas_fisicas} />
      <WeightChart data={usuarioData?.medidas_fisicas} />
      <View style={styles.buttonContainer}>
        <ButtonWeight /> {/* No necesitas pasar 'onRefresh' ahora */}
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.inlineText}>Racha de recetas</Text>
        <MaterialCommunityIcons name="pot-steam" size={30} color="#f4a020" style={styles.trophyIcon} />
      </View>
      <View style={styles.underline} />
      <DiasCocinandoCard data={usuarioData?.racha_recetas} />
      <CalendarProgress data={usuarioData?.calendario_progreso} />
      <ButtonRecetaRealizada /> {/* No necesitas pasar 'onRefresh' ahora */}
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
  underline: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 4,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
