// components/WeeklyView.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from 'react-native';
import RecipeCardWeekly from './RecipeCardWeekly';
import RecipeModal from './RecipeModal'; 
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const diasDeLaSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const obtenerRecetasConDetalles = (comidas, recetasCompletas) => {
  const allComidas = [];
  Object.keys(comidas).forEach((tipoComida) => {
    if (Array.isArray(comidas[tipoComida])) {
      const recetas = comidas[tipoComida].map((receta) =>
        recetasCompletas.find((r) => r.id === receta.id) || receta
      );
      allComidas.push(...recetas);
    }
  });
  return allComidas;
};

export default function WeeklyView({ planes, recetasCompletas, currentDay }) {
  const [activeDay, setActiveDay] = useState(currentDay !== undefined ? currentDay : null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null); 

  useEffect(() => {}, [planes, recetasCompletas, currentDay]);

  const toggleDay = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveDay(prevActiveDay => (prevActiveDay === index ? null : index));
  };

  const handleRecipePress = (receta) => {
    console.log(JSON.stringify(receta)); 
    setSelectedRecipe(receta);
    setModalVisible(true); 
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {diasDeLaSemana.map((dia, index) => {
          const plan = planes.find((p) => p.dia === index + 1);
          const recetas = plan ? obtenerRecetasConDetalles(plan.comidas, recetasCompletas) : [];

          return (
            <View key={dia} style={styles.daySection}>
              <TouchableOpacity 
                onPress={() => toggleDay(index)} 
                style={styles.dayHeader}
                activeOpacity={1}
                accessibilityRole="button"
                accessibilityLabel={`Mostrar recetas para ${dia}`}
                accessibilityState={{ expanded: activeDay === index }}
              >
                <Text style={[styles.dayTitle, activeDay === index && styles.activeDayTitle]}>
                  {dia}
                </Text>
                <Ionicons
                  name={activeDay === index ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#6C757D"
                />
              </TouchableOpacity>
              {activeDay === index && (
                <View style={styles.recipesContainer}>
                  {recetas.length > 0 ? (
                    recetas.map((item, idx) => (
                      <View key={item.id.toString()}>
                        <RecipeCardWeekly receta={item} onPress={handleRecipePress} />
                        {idx < recetas.length - 1 && <View style={styles.separator} />}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noRecipesText}>No hay recetas para este día.</Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Incluir el RecipeModal */}
      {selectedRecipe && (
        <RecipeModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          recipe={selectedRecipe}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
  },
  daySection: {
    marginBottom: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'DMSans_500Medium',
  },
  activeDayTitle: {
    color: '#6C757D',
  },
  recipesContainer: {
    paddingVertical: 8,
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  noRecipesText: {
    fontSize: 14,
    color: '#777777',
    fontStyle: 'italic',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'DMSans_400Regular',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#E0E0E0',
    marginVertical: 6,
    marginHorizontal: 8,
  },
});
