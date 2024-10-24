// components/WeeklyView.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import RecipeCardWeekly from './RecipeCardWeekly';

const diasDeLaSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const flattenComidas = (comidas) => {
  const allComidas = [];
  Object.keys(comidas).forEach((tipoComida) => {
    if (Array.isArray(comidas[tipoComida])) {
      allComidas.push(...comidas[tipoComida]);
    }
  });
  return allComidas;
};

export default function WeeklyView({ planes }) {
  useEffect(() => {
    console.log('Planes recibidos en WeeklyView:', JSON.stringify(planes, null, 2));
  }, [planes]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {diasDeLaSemana.map((dia, index) => {
        const plan = planes.find((p) => p.dia === index + 1); // Buscar plan por día
        const recetas = plan ? flattenComidas(plan.comidas) : [];

        return (
          <View key={dia} style={styles.daySection}>
            <Text style={styles.dayTitle}>{dia}</Text>
            {recetas.length > 0 ? (
              <FlatList
                data={recetas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <RecipeCardWeekly receta={item} />}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.noRecipesText}>No hay recetas para este día.</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  daySection: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontFamily: 'DMSans_700Bold',
    color: '#333',
    marginLeft: 16,
    marginBottom: 8,
  },
  noRecipesText: {
    marginLeft: 16,
    fontSize: 14,
    color: '#777',
    fontFamily: 'DMSans_400Regular',
  },
});
