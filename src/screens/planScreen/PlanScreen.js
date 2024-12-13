import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderSections from '../../components/planScreen/HeaderSections';
import PlanSelector from '../../components/planScreen/PlanSelector';
import {
  obtenerUsuario,
  verificarYActualizarPlan,
  generarYAsignarPlanSiguienteSemana,
  moverPlanSiguienteSemanaAActual,
  hayPlanSiguienteSemana,
} from '../../services/usuarioService';
import { obtenerRecetasPorIds } from '../../services/recetaService';
import Secciones56 from '../../components/planScreen/RecipesPlan';
import WeeklyView from '../../components/planScreen/WeeklyView';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import ThreeBodyLoader from '../../components/common/ThreeBodyLoader';

// Obtiene el nombre del día con un desplazamiento opcional
const getDayName = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('es-ES', { weekday: 'long' });
};

// Calcula el índice del día actual (0: Lunes, ..., 6: Domingo)
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
  const [loadingReload, setLoadingReload] = useState(false);

  const { favoritos, toggleFavorite, loading: loadingFavoritos } = useContext(FavoritesContext);

  // Obtiene los datos del usuario desde AsyncStorage
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

  // Obtiene recetas específicas según el día
  const fetchRecetasPorDia = async (offset) => {
    const currentDayIndex = getCurrentDayIndex();
    const targetDayIndex = (currentDayIndex + offset) % 7;

    const esDomingo = currentDayIndex === 6;
    const esLunes = currentDayIndex === 0;

    let planDelDia = null;

    const diaPlan = targetDayIndex === 6 ? 7 : targetDayIndex + 1;
    planDelDia = usuario?.planes_alimentacion?.find((plan) => plan.dia === diaPlan);

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

  // Obtiene todas las recetas de la semana
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

  // Carga las recetas iniciales según el usuario
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

  // Maneja acciones específicas según el día actual
  useEffect(() => {
    const handleDaySpecificActions = async () => {
      const currentDayIndex = getCurrentDayIndex();

      const userId = await AsyncStorage.getItem('usuarioId');

      if (currentDayIndex === 6) {
        console.log('Hoy es domingo, generando plan para la siguiente semana.');
        await generarYAsignarPlanSiguienteSemana(userId);
      } else if (currentDayIndex === 0) {
        console.log('Hoy es lunes, moviendo plan de la siguiente semana a actual si existe.');
        if (await hayPlanSiguienteSemana(userId)) {
          await moverPlanSiguienteSemanaAActual(userId);
        } else {
          console.log('No hay plan de la siguiente semana para mover.');
        }
      }

      await fetchUserData();
    };

    handleDaySpecificActions();
  }, [fetchUserData]);

  // Recarga las recetas cuando el usuario cambia
  useEffect(() => {
    cargarRecetasIniciales();
  }, [cargarRecetasIniciales]);

  // Verifica y actualiza el plan cuando la pantalla gana foco
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

  // Cambia la selección de botones (Hoy, Mañana, Semana)
  const handleButtonPress = async (button) => {
    if (button !== selectedButton) {
      setLoadingTabChange(true);
      setSelectedButton(button);
      setTimeout(() => setLoadingTabChange(false), 500);
    }
  };

  // Calcula las calorías totales basadas en la selección actual
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

  const showFullScreenLoader = loadingReload || loadingRecetas;
  const showPartialLoader = !showFullScreenLoader && loadingTabChange;

  if (showFullScreenLoader) {
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
          {showPartialLoader ? (
            <View style={styles.partialLoaderContainer}>
              <ThreeBodyLoader />
            </View>
          ) : (
            <WeeklyView
              planes={planes}
              recetasCompletas={recetasCompletas}
              currentDay={getCurrentDayIndex()}
            />
          )}
        </View>
      ) : (
        <View style={styles.seccionesContainer}>
          {showPartialLoader ? (
            <View style={styles.partialLoaderContainer}>
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
  partialLoaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;
