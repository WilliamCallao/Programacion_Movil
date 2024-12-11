import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native'; // Asegúrate de incluir Text
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import RecipeCard from '../RecipeCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThreeBodyLoader from '../ThreeBodyLoader';

const ITEM_WIDTH = Dimensions.get('window').width * 0.75;

const calcularResumenNutricional = (recetas) => {
  let totalCalorias = 0;
  let totalProteina = 0;
  let totalCarbohidratos = 0;
  let totalGrasa = 0;

  recetas.forEach((receta) => {
    const { nutricion } = receta;

    totalCalorias += parseFloat(nutricion.calories) || 0;
    totalProteina += parseFloat(nutricion.protein) || 0;
    totalCarbohidratos += parseFloat(nutricion.total_carbohydrate) || 0;
    totalGrasa += parseFloat(nutricion.total_fat) || 0;
  });

  const caloriasProteina = totalProteina * 4;
  const caloriasCarbohidratos = totalCarbohidratos * 4;
  const caloriasGrasa = totalGrasa * 9;

  const totalCaloriasMacronutrientes = caloriasProteina + caloriasCarbohidratos + caloriasGrasa;

  const porcentajeProteina = totalCaloriasMacronutrientes
    ? ((caloriasProteina / totalCaloriasMacronutrientes) * 100).toFixed(1)
    : 0;
  const porcentajeCarbohidratos = totalCaloriasMacronutrientes
    ? ((caloriasCarbohidratos / totalCaloriasMacronutrientes) * 100).toFixed(1)
    : 0;
  const porcentajeGrasa = totalCaloriasMacronutrientes
    ? ((caloriasGrasa / totalCaloriasMacronutrientes) * 100).toFixed(1)
    : 0;

  return {
    totalRecetas: recetas.length,
    totalCalorias,
    totalProteina,
    totalCarbohidratos,
    totalGrasa,
    porcentajeProteina,
    porcentajeCarbohidratos,
    porcentajeGrasa,
  };
};

export default function Secciones56({ recetas, favoritos, toggleFavorite }) {
  const scrollX = useSharedValue(0);

  useEffect(() => {
    // console.log('Datos recibidos por Secciones56:', JSON.stringify(recetas, null, 2));
  }, [recetas]);

  const resumen = calcularResumenNutricional(recetas);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const renderRecipeCard = ({ item, index }) => (
    <RecipeCard 
      item={item} 
      index={index} 
      scrollX={scrollX} 
      onImageError={() => {}} 
      isFavorite={favoritos.includes(item.id)}
      onToggleFavorite={toggleFavorite}
    />
  );

  return (
    <View style={styles.container}>
      {recetas.length > 0 ? (
        <>
          <View style={styles.macronutrients}>
            <View style={styles.macroItem}>
              <MaterialCommunityIcons name="food-apple-outline" size={20} color="#4CAF50" />
              <Text style={styles.macroText}>Proteína</Text>
              <Text style={styles.macroValue}>
                {resumen.totalProteina} g ({resumen.porcentajeProteina}%)
              </Text>
            </View>
            <View style={styles.macroItem}>
              <MaterialCommunityIcons name="bread-slice-outline" size={20} color="#FF9800" />
              <Text style={styles.macroText}>Carbohidratos</Text>
              <Text style={styles.macroValue}>
                {resumen.totalCarbohidratos} g ({resumen.porcentajeCarbohidratos}%)
              </Text>
            </View>
            <View style={styles.macroItem}>
              <MaterialCommunityIcons name="oil" size={20} color="#FFC107" />
              <Text style={styles.macroText}>Grasa</Text>
              <Text style={styles.macroValue}>
                {resumen.totalGrasa} g ({resumen.porcentajeGrasa}%)
              </Text>
            </View>
          </View>
          <Animated.FlatList
            data={recetas}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipeCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            snapToInterval={ITEM_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={{ alignItems: 'center' }}
          />
        </>
      ) : (
        <View style={styles.loaderContainer}>
          <ThreeBodyLoader />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  macronutrients: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '100%',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroText: {
    fontSize: 14,
    marginTop: 5,
    color: '#333',
  },
  macroValue: {
    fontSize: 14,
    marginTop: 2,
    color: '#000',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
