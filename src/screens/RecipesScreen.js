// RecipesScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerTodasLasRecetas } from '../services/recetaService';
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../services/favoritoService';
import RecipeModal from '../components/RecipeModal';
import FiltrosModal from '../components/FiltrosModal';
import RecipeList from '../components/RecipeList';
import ThreeBodyLoader from '../components/ThreeBodyLoader'; // Importamos el loader personalizado

export default function RecipesScreen() {
  const [recetas, setRecetas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtrosVisible, setFiltrosVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [recetasObtenidas, favoritosObtenidos] = await Promise.all([
          obtenerTodasLasRecetas(),
          obtenerFavoritos(),
        ]);
        setRecetas(recetasObtenidas);
        setFavoritos(favoritosObtenidos);
      } catch (error) {
        console.error('Error al cargar las recetas o favoritos:', error);
        Alert.alert('Error', 'No se pudieron cargar las recetas o favoritos.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleOpenModal = (recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  const handleOpenFiltros = () => {
    setFiltrosVisible(true);
  };

  const handleCloseFiltros = () => {
    setFiltrosVisible(false);
  };

  const handleToggleFavorite = async (recipeId) => {
    const esFavorito = favoritos.includes(recipeId);
    const nuevoEstadoFavorito = !esFavorito;

    setFavoritos((prevFavoritos) => {
      if (nuevoEstadoFavorito) {
        return [...prevFavoritos, recipeId];
      } else {
        return prevFavoritos.filter((id) => id !== recipeId);
      }
    });

    try {
      let success = false;
      if (nuevoEstadoFavorito) {
        success = await agregarFavorito(recipeId);
      } else {
        success = await quitarFavorito(recipeId);
      }

      if (!success) {
        throw new Error('Actualización de la base de datos falló.');
      }
    } catch (error) {
      setFavoritos((prevFavoritos) => {
        if (nuevoEstadoFavorito) {
          return prevFavoritos.filter((id) => id !== recipeId);
        } else {
          return [...prevFavoritos, recipeId];
        }
      });
      console.error('Error al actualizar el favorito:', error);
      Alert.alert(
        'Error',
        'No se pudo actualizar el estado de favorito. Por favor, intenta nuevamente.'
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ThreeBodyLoader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.filtrosButton} onPress={handleOpenFiltros}>
        <Ionicons name="filter" size={24} color="#fff" />
        <Text style={styles.filtrosButtonText}>Filtros</Text>
      </TouchableOpacity>

      <RecipeList recipes={recetas} onRecipePress={handleOpenModal} />

      <RecipeModal
        visible={modalVisible}
        onClose={handleCloseModal}
        recipe={selectedRecipe}
        isFavorite={selectedRecipe ? favoritos.includes(selectedRecipe.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <FiltrosModal visible={filtrosVisible} onClose={handleCloseFiltros} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingTop: 30,
  },
  filtrosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
    width: '50%',
    justifyContent: 'center',
  },
  filtrosButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
    fontFamily: 'DMSans_500Medium',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
