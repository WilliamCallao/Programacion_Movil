// components/FiltrosModal.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { obtenerTodasLasRecetas } from '../services/recetaService'; // Importamos la función existente

const categorias = {
  "Comidas Principales": ["Breakfast and Brunch", "Lunch", "Dinner", "Snacks", "Soup", "Main Dish"],
  "Especiales": ["Appetizers", "Dessert", "Salads", "Sandwiches", "Sides", "Budget Friendly", "One Pot", "Meal Kit Recipes"],
  "Preferencias Alimentarias": ["Gluten-Free", "Vegan", "Vegetarian", "Easy Pantry Recipes"],
  "Sabores": ["Sauces", "Salad Dressings & Condiments", "Beverages"],
  "Herramientas": ["No Cook", "Slow Cooker", "Quick & Easy", "Holidays & Entertaining"],
};

export default function FiltrosModal({ visible, onClose }) {
  const navigation = useNavigation();
  const [selectedFilters, setSelectedFilters] = useState([]); // Filtros seleccionados
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Recetas filtradas

  // Función para alternar la selección de filtros
  const toggleFilter = (filter) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((item) => item !== filter) // Deseleccionar
        : [...prevFilters, filter] // Seleccionar
    );
  };

  // Filtrar recetas dinámicamente según los filtros seleccionados
  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      try {
        const todasLasRecetas = await obtenerTodasLasRecetas(); // Carga todas las recetas
        if (selectedFilters.length === 0) {
          setFilteredRecipes(todasLasRecetas); // Si no hay filtros, muestra todas las recetas
        } else {
          const recetasFiltradas = todasLasRecetas.filter((receta) =>
            selectedFilters.every((filtro) => receta.categorias.includes(filtro))
          );
          setFilteredRecipes(recetasFiltradas);
        }
      } catch (error) {
        console.error('Error al filtrar recetas:', error);
      }
    };

    fetchFilteredRecipes();
  }, [selectedFilters]);

  if (!visible) {
    return null; // No renderiza el modal si no está visible
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.groupTitle}>Comidas Principales</Text>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close-outline" size={32} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {Object.keys(categorias).map((grupo) => (
            <View key={grupo} style={styles.groupContainer}>
              {grupo !== "Comidas Principales" && (
                <Text style={styles.groupTitle}>{grupo}</Text>
              )}
              <View style={styles.buttonContainer}>
                {categorias[grupo].map((categoria) => (
                  <TouchableOpacity
                    key={categoria}
                    style={[
                      styles.filterButton,
                      selectedFilters.includes(categoria) && styles.filterButtonSelected,
                    ]}
                    onPress={() => toggleFilter(categoria)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedFilters.includes(categoria) && styles.filterTextSelected,
                      ]}
                    >
                      {categoria}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Botón Ver Recetas */}
        <TouchableOpacity
          style={styles.viewRecipesButton}
          onPress={() => {
            navigation.navigate('RecipesScreen', { recetasFiltradas: filteredRecipes });
          }}
        >
          <Text style={styles.viewRecipesButtonText}>
            Ver recetas ({filteredRecipes.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeIcon: {
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderWidth: 0,
    borderColor: '#000',
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterButtonSelected: {
    borderColor: '#1E90FF',
  },
  filterText: {
    fontSize: 14,
    color: '#000',
  },
  filterTextSelected: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  viewRecipesButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  viewRecipesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});











