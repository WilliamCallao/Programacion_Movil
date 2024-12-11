// components/FiltrosModal.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { obtenerTodasLasRecetas } from '../../services/recetaService'; // Importamos la función existente

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const categorias = {
  "Comidas Principales": [
    { id: "Breakfast and Brunch", label: "Desayuno y Brunch" },
    { id: "Lunch", label: "Almuerzo" },
    { id: "Dinner", label: "Cena" },
    { id: "Snacks", label: "Bocadillos" },
    { id: "Soup", label: "Sopa" },
    { id: "Main Dish", label: "Plato Principal" },
  ],
  "Especiales": [
    { id: "Appetizers", label: "Aperitivos" },
    { id: "Dessert", label: "Postre" },
    { id: "Salads", label: "Ensaladas" },
    { id: "Sandwiches", label: "Sándwiches" },
    { id: "Sides", label: "Acompañamientos" },
    { id: "Budget Friendly", label: "Económico" },
    { id: "One Pot", label: "Una Olla" },
    { id: "Meal Kit Recipes", label: "Recetas de Kits de Comida" },
  ],
  "Preferencias Alimentarias": [
    { id: "Gluten-Free", label: "Sin Gluten" },
    { id: "Vegan", label: "Vegano" },
    { id: "Vegetarian", label: "Vegetariano" },
    { id: "Easy Pantry Recipes", label: "Recetas Fácil de la Despensa" },
  ],
  "Sabores": [
    { id: "Sauces", label: "Salsas" },
    { id: "Salad Dressings & Condiments", label: "Aderezos para Ensaladas y Condimentos" },
    { id: "Beverages", label: "Bebidas" },
  ],
  "Herramientas": [
    { id: "No Cook", label: "Sin Cocinar" },
    { id: "Slow Cooker", label: "Olla de Cocción Lenta" },
    { id: "Quick & Easy", label: "Rápido y Fácil" },
    { id: "Holidays & Entertaining", label: "Fiestas y Entretenimiento" },
  ],
};

export default function FiltrosModal({ visible, onClose }) {
  const navigation = useNavigation();
  const [selectedFilters, setSelectedFilters] = useState([]); // Filtros seleccionados
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Recetas filtradas
  const [loadingFilters, setLoadingFilters] = useState(false); // Loader para filtros

  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Función para alternar la selección de filtros
  const toggleFilter = (filterId) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filterId)
        ? prevFilters.filter((item) => item !== filterId) // Deseleccionar
        : [...prevFilters, filterId] // Seleccionar
    );
  };

  // Filtrar recetas dinámicamente según los filtros seleccionados
  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      setLoadingFilters(true);
      try {
        const todasLasRecetas = await obtenerTodasLasRecetas();
        if (selectedFilters.length === 0) {
          setFilteredRecipes(todasLasRecetas);
        } else {
          const recetasFiltradas = todasLasRecetas.filter((receta) =>
            selectedFilters.every((filtro) => receta.categorias.includes(filtro))
          );
          setFilteredRecipes(recetasFiltradas);
        }
      } catch (error) {
        console.error('Error al filtrar recetas:', error);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilteredRecipes();
  }, [selectedFilters]);

  const handleViewRecipes = () => {
    onClose();
    navigation.navigate('RecipesScreen', { recetasFiltradas: filteredRecipes });
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity }]}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtros</Text>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close-outline" size={32} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {Object.keys(categorias).map((grupo) => (
            <View key={grupo} style={styles.groupContainer}>
              <Text style={styles.groupTitle}>{grupo}</Text>
              <View style={styles.buttonContainer}>
                {categorias[grupo].map((categoria) => (
                  <TouchableOpacity
                    key={categoria.id}
                    style={[
                      styles.filterButton,
                      selectedFilters.includes(categoria.id) && styles.filterButtonSelected,
                    ]}
                    onPress={() => toggleFilter(categoria.id)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedFilters.includes(categoria.id) && styles.filterTextSelected,
                      ]}
                    >
                      {categoria.label}
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
          onPress={handleViewRecipes}
          disabled={loadingFilters}
        >
          {loadingFilters ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.viewRecipesButtonText}>
              Ver recetas ({filteredRecipes.length})
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayTouchable: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '90%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeIcon: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'DMSans_700Bold',
    color: '#000',
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'DMSans_500Medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    fontFamily: 'DMSans_400Regular',
  },
  filterTextSelected: {
    color: '#1E90FF',
    fontWeight: 'bold',
    fontFamily: 'DMSans_500Medium',
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
    fontFamily: 'DMSans_500Medium',
  },
});
