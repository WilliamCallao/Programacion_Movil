import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderSections from '../components/HeaderSections';
import PlanSelector from '../components/PlanSelector';
import { obtenerUsuario, verificarYActualizarPlan } from '../services/usuarioService';
import { obtenerRecetasPorIds } from '../services/recetaService';
import Secciones56 from '../components/RecipesPlan';
import WeeklyView from '../components/WeeklyView';
import { FavoritesContext } from '../contexts/FavoritesContext';
import ThreeBodyLoader from '../components/ThreeBodyLoader';

const getDayName = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('es-ES', { weekday: 'long' });
};

const getCurrentDayIndex = () => {
  const date = new Date();
  const day = date.getDay();
  const index = (day + 6) % 7;
  return index;
};

const MainScreen = () => {
  const [selectedButton, setSelectedButton] = useState('Hoy');
  const [usuario, setUsuario] = useState(null);
  const [recetasDeHoy, setRecetasDeHoy] = useState([]);
  const [recetasDeMañana, setRecetasDeMañana] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [recetasCompletas, setRecetasCompletas] = useState([]);
  const [totalCalorias, setTotalCalorias] = useState(0);
  const [loadingRecetas, setLoadingRecetas] = useState(true);
  const [loadingTabChange, setLoadingTabChange] = useState(false);
  const [loadingReload, setLoadingReload] = useState(false); // Nuevo estado para recarga

  const { favoritos, toggleFavorite, loading: loadingFavoritos } = useContext(FavoritesContext);

  // Función para obtener los datos del usuario
  const fetchUserData = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('usuarioId');
      if (userId) {
        const datosUsuario = await obtenerUsuario(userId);
        if (datosUsuario) {
          setUsuario(datosUsuario);
          setPlanes(datosUsuario.planes_alimentacion);
        }
      } else {
        console.warn('No se encontró el ID de usuario en AsyncStorage.');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      Alert.alert('Error', 'No se pudieron obtener los datos del usuario.');
    }
  }, []);

  // Función para cargar las recetas iniciales
  const cargarRecetasIniciales = useCallback(async () => {
    if (usuario) {
      setLoadingRecetas(true);
      try {
        const recetasHoy = await fetchRecetasPorDia(0);
        setRecetasDeHoy(recetasHoy);

        const recetasMañana = await fetchRecetasPorDia(1);
        setRecetasDeMañana(recetasMañana);

        await fetchRecetasSemanales();
      } catch (error) {
        console.error('Error al cargar las recetas iniciales:', error);
        Alert.alert('Error', 'No se pudieron cargar las recetas.');
      } finally {
        setLoadingRecetas(false);
      }
    }
  }, [usuario]);

  // Función para obtener recetas por día
  const fetchRecetasPorDia = async (offset) => {
    const currentDay = new Date().getDay();
    const targetDay = (currentDay + offset) % 7;

    const diaPlan = targetDay === 0 ? 7 : targetDay;

    const planDelDia = usuario?.planes_alimentacion.find((plan) => plan.dia === diaPlan);

    if (!planDelDia) return [];

    const tiposDeComida = ['Desayuno', 'Almuerzo', 'Cena', 'Snacks'];
    let idsRecetas = [];

    tiposDeComida.forEach((tipo) => {
      if (planDelDia.comidas[tipo]) {
        const ids = planDelDia.comidas[tipo].map((receta) => receta.id);
        idsRecetas = idsRecetas.concat(ids);
      }
    });

    idsRecetas = [...new Set(idsRecetas)];
    const recetasCompletas = await obtenerRecetasPorIds(idsRecetas);
    return recetasCompletas;
  };

  // Función para obtener recetas semanales
  const fetchRecetasSemanales = async () => {
    try {
      const recetasPorDia = await Promise.all(
        Array.from({ length: 7 }, (_, i) => fetchRecetasPorDia(i))
      );
      const recetasPlanificadas = recetasPorDia.flat();

      setRecetasCompletas(recetasPlanificadas);
    } catch (error) {
      console.error('Error al obtener las recetas semanales:', error);
      Alert.alert('Error', 'No se pudieron cargar las recetas semanales.');
    }
  };

  // useEffect para cargar los datos del usuario al montar el componente
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // useEffect para cargar las recetas cuando el usuario cambia
  useEffect(() => {
    cargarRecetasIniciales();
  }, [cargarRecetasIniciales]);

  // useFocusEffect para verificar y actualizar el plan cuando la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      const verificar = async () => {
        setLoadingReload(true);
        const planActualizado = await verificarYActualizarPlan();
        if (planActualizado) {
          await fetchUserData();
          await cargarRecetasIniciales();
        }
        setLoadingReload(false);
      };
      verificar();
    }, [fetchUserData, cargarRecetasIniciales])
  );

  const handleButtonPress = async (button) => {
    if (button !== selectedButton) {
      setLoadingTabChange(true);
      setSelectedButton(button);
      setTimeout(() => setLoadingTabChange(false), 500);
    }
  };

  useEffect(() => {
    let recetasSeleccionadas = [];

    if (selectedButton === 'Hoy') {
      recetasSeleccionadas = recetasDeHoy;
    } else if (selectedButton === 'Mañana') {
      recetasSeleccionadas = recetasDeMañana;
    }

    const totalCal = recetasSeleccionadas.reduce(
      (sum, receta) => sum + (parseFloat(receta.nutricion?.calories) || 0),
      0
    );
    setTotalCalorias(totalCal);
  }, [selectedButton, recetasDeHoy, recetasDeMañana]);

  // Mostrar el loader de recarga si está en proceso
  if (loadingReload) {
    return (
      <View style={styles.loaderContainer}>
        <ThreeBodyLoader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderSections dia={getDayName(selectedButton === 'Mañana' ? 1 : 0)} calorias={totalCalorias} />
      <PlanSelector selectedButton={selectedButton} onButtonPress={handleButtonPress} />
      {selectedButton === 'Semana' ? (
        <View style={styles.section7}>
          <WeeklyView
            planes={planes}
            recetasCompletas={recetasCompletas}
            currentDay={getCurrentDayIndex()}
          />
        </View>
      ) : (
        <View style={styles.seccionesContainer}>
          {loadingTabChange ? (
            <View style={styles.loaderContainer}>
              <ThreeBodyLoader />
            </View>
          ) : (
            <Secciones56 
              recetas={selectedButton === 'Hoy' ? recetasDeHoy : recetasDeMañana}
              favoritos={favoritos}
              toggleFavorite={toggleFavorite}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section7: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  seccionesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;
