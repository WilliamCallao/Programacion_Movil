// RecipesScreen.js

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopTabs from '../components/TopTabs'; // Asegúrate de que la ruta sea correcta
import { obtenerTodasLasRecetas } from '../services/recetaService';
import {
  obtenerFavoritos,
  agregarFavorito,
  quitarFavorito,
} from '../services/favoritoService';
import RecipeModal from '../components/RecipeModal';
import FiltrosModal from '../components/FiltrosModal';
import RecipeList from '../components/RecipeList';
import ThreeBodyLoader from '../components/ThreeBodyLoader';

export default function RecipesScreen({ route }) {
  const { recetasFiltradas } = route.params || {};
  const [recetas, setRecetas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtrosVisible, setFiltrosVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [recetasVisibles, setRecetasVisibles] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState('recetas');

  const searchInputRef = useRef(null);
  const { width } = Dimensions.get('window');
  const TAB_WIDTH = width / 2;

  // Memoizar favoritosRecetas para optimizar rendimiento
  const favoritosRecetas = useMemo(() => 
    recetas.filter((receta) => favoritos.includes(receta.id)),
    [recetas, favoritos]
  );

  // Fetch inicial de recetas y favoritos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const recetasObtenidas =
          recetasFiltradas || (await obtenerTodasLasRecetas());
        const favoritosObtenidos = await obtenerFavoritos();

        setRecetas(recetasObtenidas);
        setRecetasVisibles(recetasObtenidas);
        setFavoritos(favoritosObtenidos);
      } catch (error) {
        console.error('Error al cargar las recetas o favoritos:', error);
        Alert.alert(
          'Error',
          'No se pudieron cargar las recetas o favoritos.'
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [recetasFiltradas]);

  // Re-Fetch de favoritos cuando se selecciona la pestaña "Favoritos"
  useEffect(() => {
    if (selectedTab === 'favoritos') {
      const fetchFavorites = async () => {
        setLoadingFavorites(true);
        try {
          const favoritosObtenidos = await obtenerFavoritos();
          setFavoritos(favoritosObtenidos);
        } catch (error) {
          console.error('Error al obtener los favoritos:', error);
          Alert.alert('Error', 'No se pudieron obtener los favoritos.');
        } finally {
          setLoadingFavorites(false);
        }
      };
      fetchFavorites();
    }
  }, [selectedTab]);

  // Filtrar recetas visibles según la búsqueda y la pestaña seleccionada
  useEffect(() => {
    if (busqueda.trim() === '') {
      if (selectedTab === 'recetas') {
        setRecetasVisibles(recetas);
      } else if (selectedTab === 'favoritos') {
        setRecetasVisibles(favoritosRecetas);
      }
    } else {
      const busquedaLower = busqueda.toLowerCase();
      if (selectedTab === 'recetas') {
        const filtradas = recetas.filter((receta) =>
          receta.titulo.toLowerCase().includes(busquedaLower)
        );
        setRecetasVisibles(filtradas);
      } else if (selectedTab === 'favoritos') {
        const filtradas = favoritosRecetas.filter((receta) =>
          receta.titulo.toLowerCase().includes(busquedaLower)
        );
        setRecetasVisibles(filtradas);
      }
    }
  }, [busqueda, recetas, favoritosRecetas, selectedTab]);

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

  const handleFocusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ThreeBodyLoader />
      </View>
    );
  }

  const tabs = [
    { key: 'recetas', title: 'Recetas' },
    { key: 'favoritos', title: 'Favoritos' },
  ];

  const renderContent = () => {
    if (selectedTab === 'recetas') {
      return (
        <RecipeList recipes={recetasVisibles} onRecipePress={handleOpenModal} />
      );
    } else if (selectedTab === 'favoritos') {
      if (loadingFavorites) {
        return (
          <View style={styles.loadingContainer}>
            <ThreeBodyLoader />
          </View>
        );
      }
      return (
        <RecipeList recipes={recetasVisibles} onRecipePress={handleOpenModal} />
      );
    }
    return null;
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View style={styles.container}>
        {/* Header con Filtros y Barra de Búsqueda */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.filtrosButton}
            onPress={handleOpenFiltros}
          >
            <Ionicons name="filter" size={24} color="#fff" />
            <Text style={styles.filtrosButtonText}>Filtros</Text>
          </TouchableOpacity>

          <TouchableWithoutFeedback onPress={handleFocusSearch}>
            <View style={styles.searchBarContainer}>
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                value={busqueda}
                onChangeText={setBusqueda}
                textAlignVertical="center"
                selectionColor="#000"
                caretHidden={!isFocused}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {busqueda !== '' ? (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setBusqueda('')}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              ) : (
                <Ionicons
                  name="search"
                  size={24}
                  color="black"
                  style={styles.iconSearch}
                />
              )}
              {/* Placeholder personalizado */}
              {busqueda === '' && (
                <Text style={styles.placeholderText}>Buscar recetas</Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Componente de Pestañas */}
        <TopTabs
          tabs={tabs}
          selectedTab={selectedTab}
          onTabPress={setSelectedTab}
        />

        {/* Contenido según la pestaña seleccionada */}
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>

        {/* Modales */}
        <RecipeModal
          visible={modalVisible}
          onClose={handleCloseModal}
          recipe={selectedRecipe}
          isFavorite={
            selectedRecipe ? favoritos.includes(selectedRecipe.id) : false
          }
          onToggleFavorite={handleToggleFavorite}
        />
        <FiltrosModal visible={filtrosVisible} onClose={handleCloseFiltros} />
      </View>
    </TouchableWithoutFeedback>
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
    paddingHorizontal: 10,
    position: 'relative',
  },
  filtrosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 10,
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
  searchBarContainer: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#C7C6C6',
    paddingHorizontal: 15,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'DMSans_400Medium',
    color: '#000',
    paddingVertical: 0,
    paddingRight: 30,
  },
  iconContainer: {
    marginLeft: 10,
  },
  iconSearch: {
    position: 'absolute',
    right: 10,
  },
  placeholderText: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    color: '#929292',
    fontSize: 14,
    fontFamily: 'DMSans_400Medium',
    textAlignVertical: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
});
