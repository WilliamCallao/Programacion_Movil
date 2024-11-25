import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../services/favoritoService';
import { LinearGradient } from 'expo-linear-gradient';

const RecipeCardBiblioteca = ({ recipe, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (recipe) {
      checkIfFavorite();
    }
  }, [recipe]);

  const checkIfFavorite = async () => {
    try {
      const favoritos = await obtenerFavoritos();
      setIsFavorite(favoritos.includes(recipe.id));
    } catch (error) {
      console.error('Error al verificar si la receta es favorita:', error);
    }
  };

  const toggleFavorite = async () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    try {
      if (newFavoriteStatus) {
        await agregarFavorito(recipe.id);
        console.log('Receta agregada a favoritos');
      } else {
        await quitarFavorito(recipe.id);
        console.log('Receta eliminada de favoritos');
      }
    } catch (error) {
      setIsFavorite(!newFavoriteStatus);
      console.error('Error al cambiar el estado de favorito:', error);
    }
  };

  const totalTime = calculateTotalTime(recipe.tiempo_preparacion, recipe.tiempo_coccion);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.imagen_url }}
          style={styles.image}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#888" />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.6)']}
          style={styles.gradient}
        />
        {/* <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={30}
            color={isFavorite ? '#FF0000' : '#FFFFFF'}
          />
        </TouchableOpacity> */}
      </View>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {recipe.titulo}
      </Text>
      <View style={styles.infoContainer}>
        {recipe.nutricion?.calories && (
          <View style={styles.infoItem}>
            <MaterialIcons name="local-fire-department" size={16} color="#666" />
            <Text style={styles.infoText}>{recipe.nutricion.calories} kcal</Text>
          </View>
        )}
        {totalTime > 0 && (
          <View style={styles.infoItem}>
            <MaterialIcons name="access-time" size={16} color="#666" />
            <Text style={styles.infoText}>{totalTime} min</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const parseDurationToMinutes = (duration) => {
  if (duration.startsWith('PT')) {
    return parseInt(duration.replace('PT', '').replace('M', ''), 10) || 0;
  }
  return 0;
};

const calculateTotalTime = (preparation, cooking) => {
  const prepTime = parseDurationToMinutes(preparation);
  const cookTime = parseDurationToMinutes(cooking);
  return prepTime + cookTime;
};

export default RecipeCardBiblioteca;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 7,
    marginBottom: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    // elevation: 5,
    backgroundColor: '#6A6A6A', 
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }], // Centrar el spinner
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    padding: 6,
  },
  title: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: '#333',
    marginTop: 5,
    paddingHorizontal: 5,
    lineHeight: 18,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginTop: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: '#666',
    marginLeft: 3,
  },
});
