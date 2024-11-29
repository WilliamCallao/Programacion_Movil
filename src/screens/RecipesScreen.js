// RecipesScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerTodasLasRecetas } from '../services/recetaService';
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../services/favoritoService';
import RecipeModal from '../components/RecipeModal';
import FiltrosModal from '../components/FiltrosModal';
import RecipeList from '../components/RecipeList';
import ThreeBodyLoader from '../components/ThreeBodyLoader'; // Importamos el loader personalizado

export default function RecipesScreen({ route }) {
  const { recetasFiltradas } = route.params || {}; // Recetas filtradas recibidas desde FiltrosModal
  const [recetas, setRecetas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtrosVisible, setFiltrosVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [recetasVisibles, setRecetasVisibles] = useState([]); // Para manejar recetas visibles (búsqueda)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Si hay recetas filtradas, úsala directamente; de lo contrario, carga todas las recetas
        const recetasObtenidas = recetasFiltradas || (await obtenerTodasLasRecetas());
        const favoritosObtenidos = await obtenerFavoritos();

        setRecetas(recetasObtenidas);
        setRecetasVisibles(recetasObtenidas); // Inicialmente todas las recetas son visibles
        setFavoritos(favoritosObtenidos);
      } catch (error) {
        console.error('Error al cargar las recetas o favoritos:', error);
        Alert.alert('Error', 'No se pudieron cargar las recetas o favoritos.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [recetasFiltradas]);

  // Actualizar recetas visibles al cambiar el término de búsqueda
  useEffect(() => {
    if (busqueda.trim() === '') {
      setRecetasVisibles(recetas); // Si la búsqueda está vacía, muestra todas las recetas
    } else {
      const busquedaLower = busqueda.toLowerCase();
      const filtradas = recetas.filter((receta) =>
        receta.titulo.toLowerCase().includes(busquedaLower)
      );
      setRecetasVisibles(filtradas);
    }
  }, [busqueda, recetas]);

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
      {/* Contenedor del botón de filtros y barra de búsqueda */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.filtrosButton} onPress={handleOpenFiltros}>
          <Ionicons name="filter" size={24} color="#fff" />
          <Text style={styles.filtrosButtonText}>Filtros</Text>
        </TouchableOpacity>

        {/* Barra de búsqueda */}
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar recetas"
          placeholderTextColor="#1E90FF"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <RecipeList recipes={recetasVisibles} onRecipePress={handleOpenModal} />

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
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  filtrosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 10,
  },
  filtrosButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'DMSans_500Medium',
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



