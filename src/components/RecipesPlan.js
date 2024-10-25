// src/components/RecipePlan.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import RecipeCard from './RecipeCard';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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

  const porcentajeProteina = ((caloriasProteina / totalCaloriasMacronutrientes) * 100).toFixed(1);
  const porcentajeCarbohidratos = ((caloriasCarbohidratos / totalCaloriasMacronutrientes) * 100).toFixed(1);
  const porcentajeGrasa = ((caloriasGrasa / totalCaloriasMacronutrientes) * 100).toFixed(1);

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

export default function Secciones56({ recetas }) {
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
    <RecipeCard item={item} index={index} scrollX={scrollX} onImageError={() => {}} />
  );

  return (
    <>
      <View style={styles.section5}>
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
      </View>

      <View style={styles.section6}>
        {recetas.length > 0 ? (
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
        ) : (
          <Text style={styles.text}>Cargando recetas...</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section5: {
    paddingHorizontal: 15,
  },
  section6: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
    marginLeft: 8,
    color: '#333',
  },
  valueText: {
    fontSize: 16,
    fontFamily: 'DMSans_500Medium',
    marginLeft: 5,
    color: '#000',
  },
  macronutrients: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroText: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    marginTop: 5,
    color: '#333',
  },
  macroValue: {
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
    marginTop: 2,
    color: '#000',
  },
});
