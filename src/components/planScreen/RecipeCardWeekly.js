// components/RecipeCardWeekly.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function RecipeCardWeekly({ receta, onPress }) { 
  const [imageError, setImageError] = useState(false);
  const placeholderImage = 'https://via.placeholder.com/80';

  useEffect(() => {
    // console.log('Receta recibida en RecipeCardWeekly:', receta);
  }, [receta]);

  const handlePress = () => {
    if (onPress && typeof onPress === 'function') {
      onPress(receta);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        {receta.imagen_url && !imageError ? (
          <Image
            source={{ uri: receta.imagen_url }}
            style={styles.image}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Sin Imagen</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {receta.titulo}
        </Text>
        <Text style={styles.subtitle}>
          {receta.nutricion?.calories || receta.calorias} kcal
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'DMSans_500Medium',
  },
  subtitle: {
    fontSize: 14,
    color: '#777777',
    fontFamily: 'DMSans_400Regular',
    marginTop: 4,
  },
});
