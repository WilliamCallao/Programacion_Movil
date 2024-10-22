import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import RecipeCard from '../components/RecipeCard';
import data from '../data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.6;
const SPACING = 20;

export default function MainScreen() {
  const [recipes, setRecipes] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageErrorIds, setImageErrorIds] = useState([]);
  const [consumidas, setConsumidas] = useState([]);

  const scrollX = useSharedValue(0);

  useEffect(() => {
    const fetchDataFromLocal = async () => {
      try {
        // Cargar recetas consumidas desde AsyncStorage (si se usa)
        const consumidasData = await AsyncStorage.getItem('consumidas');
        if (consumidasData !== null) {
          setConsumidas(JSON.parse(consumidasData));
        }

        // Encontrar el plan activo
        const activePlan = data.planes_alimentacion.find(
          (plan) => plan.estado_plan.toLowerCase() === 'activo'
        );

        if (!activePlan) {
          throw new Error('No se encontró un plan activo.');
        }

        setPlan(activePlan);

        // Verificar la consistencia de calorías
        const totalCaloriasCalculadas = activePlan.dias.reduce((total, dia) => {
          const caloriasDia = dia.recetas.reduce((sum, receta) => sum + receta.calorias, 0);
          return total + caloriasDia;
        }, 0);

        // if (activePlan.calorias_totales !== totalCaloriasCalculadas) {
        //   console.warn(
        //     `Calorías totales del plan (${activePlan.calorias_totales}) no coinciden con la suma de calorías diarias (${totalCaloriasCalculadas}).`
        //   );
        // }

        // Encontrar las recetas para el lunes
        const lunes = activePlan.dias.find(
          (dia) => dia.dia.toLowerCase() === 'lunes'
        );

        if (!lunes) {
          throw new Error('No se encontraron recetas para el lunes.');
        }

        const lunesRecetas = lunes.recetas.map((recetaRef) => {
          const recetaCompleta = data.recetas.find(
            (receta) => receta.id === recetaRef.id_receta
          );
          if (recetaCompleta) {
            return {
              ...recetaCompleta,
              ...recetaRef, // Combina los datos si es necesario
            };
          } else {
            console.warn(
              `Receta con ID ${recetaRef.id_receta} no encontrada en data.recetas.`
            );
            return null;
          }
        }).filter(receta => receta !== null); // Filtrar recetas no encontradas

        setRecipes(lunesRecetas);
      } catch (error) {
        console.error('Error al procesar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromLocal();
  }, []);

  const handleImageError = (id) => {
    setImageErrorIds((prevState) => [...prevState, id]);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Función para marcar una receta como consumida
  const toggleConsumida = async (id) => {
    try {
      setConsumidas((prevState) => {
        let newState;
        if (prevState.includes(id)) {
          newState = prevState.filter((consumidaId) => consumidaId !== id);
        } else {
          newState = [...prevState, id];
        }
        AsyncStorage.setItem('consumidas', JSON.stringify(newState));
        return newState;
      });
    } catch (error) {
      console.error('Error al guardar las recetas consumidas:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Cargando recetas...</Text>
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No se encontró un plan activo.</Text>
      </View>
    );
  }

  // Calcular calorías totales del lunes
  const caloriasLunes = recipes.reduce((total, receta) => total + receta.calorias, 0);

  const renderItem = ({ item, index }) => (
    <RecipeCard
      item={{
        ...item,
        imageError: imageErrorIds.includes(item.id),
        consumida: consumidas.includes(item.id), // Pasar el estado de consumida
      }}
      index={index}
      scrollX={scrollX}
      onImageError={handleImageError}
      onToggleConsumida={() => toggleConsumida(item.id)} // Pasar la función para togglear
    />
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mi Plan - Lunes</Text>

      {/* Sección de Detalles del Plan */}
      {/* <View style={styles.planContainer}>
        <Text style={styles.planTitle}>Detalles del Plan de Alimentación</Text>
        <View style={styles.planDetailRow}>
          <Text style={styles.planLabel}>ID del Plan:</Text>
          <Text style={styles.planValue}>{plan.id_plan}</Text>
        </View>
        <View style={styles.planDetailRow}>
          <Text style={styles.planLabel}>ID de Usuario:</Text>
          <Text style={styles.planValue}>{plan.id_usuario}</Text>
        </View>
        <View style={styles.planDetailRow}>
          <Text style={styles.planLabel}>Fecha de Inicio:</Text>
          <Text style={styles.planValue}>{plan.fecha_inicio}</Text>
        </View>
        <View style={styles.planDetailRow}>
          <Text style={styles.planLabel}>Fecha de Fin:</Text>
          <Text style={styles.planValue}>{plan.fecha_fin}</Text>
        </View>
        <View style={styles.planDetailRow}>
          <Text style={styles.planLabel}>Calorías Totales:</Text>
          <Text style={styles.planValue}>{plan.calorias_totales} kcal</Text>
        </View>
        <View style={styles.planDetailRow}>
          <Text style={styles.planLabel}>Distribución de Macronutrientes:</Text>
          <Text style={styles.planValue}>
            Carbohidratos: {plan.distribucion_macronutrientes.carbohidratos}%
            {'\n'}
            Proteínas: {plan.distribucion_macronutrientes.proteinas}%
            {'\n'}
            Grasas: {plan.distribucion_macronutrientes.grasas}%
          </Text>
        </View>
        <View style={styles.planDetailRow}>
          <Text style={styles.planLabel}>Total Nutrición:</Text>
          <Text style={styles.planValue}>
            Calorías: {plan.total_nutricion.calorias} kcal
            {'\n'}
            Proteínas: {plan.total_nutricion.proteinas} g
            {'\n'}
            Carbohidratos: {plan.total_nutricion.carbohidratos} g
            {'\n'}
            Grasas: {plan.total_nutricion.grasas} g
          </Text>
        </View>
        <View style={styles.planDetailRow}>
          <Text style={styles.planLabel}>Estado del Plan:</Text>
          <Text style={styles.planValue}>{plan.estado_plan}</Text>
        </View>
      </View> */}

      {/* Calorías Totales del Lunes */}
      <View style={styles.caloriasContainer}>
        <Text style={styles.caloriasText}>Calorías: {caloriasLunes} kcal</Text>
      </View>

      {/* Lista de Recetas del Lunes */}
      <View style={styles.listContainer}>
        <Animated.FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING }}
          snapToInterval={ITEM_WIDTH + SPACING}
          decelerationRate="fast"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          renderItem={renderItem}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  planContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    marginHorizontal: SPACING,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  planDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  planLabel: {
    fontWeight: '600',
    color: '#555',
    width: 180, // Ajusta según necesites
  },
  planValue: {
    color: '#555',
    flex: 1,
  },
  caloriasContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    marginHorizontal: SPACING,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
    marginBottom: 20,
  },
  caloriasText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    marginBottom: 20,
  },
});
