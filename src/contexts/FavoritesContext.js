// src/contexts/FavoritesContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../services/favoritoService';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarFavoritos = async () => {
      try {
        const favoritosObtenidos = await obtenerFavoritos();
        setFavoritos(favoritosObtenidos);
      } catch (error) {
        console.error('Error al cargar los favoritos:', error);
        Alert.alert('Error', 'No se pudieron cargar los favoritos.');
      } finally {
        setLoading(false);
      }
    };

    cargarFavoritos();
  }, []);

  const isFavorite = (recipeId) => {
    return favoritos.includes(recipeId);
  };

  const toggleFavorite = async (recipeId) => {
    const newFavoriteStatus = !isFavorite(recipeId);

    setFavoritos((prevFavoritos) => {
      if (newFavoriteStatus) {
        return [...prevFavoritos, recipeId];
      } else {
        return prevFavoritos.filter((id) => id !== recipeId);
      }
    });

    try {
      if (newFavoriteStatus) {
        await agregarFavorito(recipeId);
        console.log('Receta agregada a favoritos');
      } else {
        await quitarFavorito(recipeId);
        console.log('Receta eliminada de favoritos');
      }
    } catch (error) {
      setFavoritos((prevFavoritos) => {
        if (newFavoriteStatus) {
          return prevFavoritos.filter((id) => id !== recipeId);
        } else {
          return [...prevFavoritos, recipeId];
        }
      });
      console.error('Error al cambiar el estado de favorito:', error);
      Alert.alert(
        'Error',
        'No se pudo actualizar el estado de favorito. Por favor, intenta nuevamente.'
      );
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoritos,
        isFavorite,
        toggleFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
