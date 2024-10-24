// components/RecipeCardWeekly.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function RecipeCardWeekly({ receta }) {
  const [imageError, setImageError] = useState(false);
  const placeholderImage = 'https://via.placeholder.com/80'; // Imagen por defecto

  // Log para verificar los datos recibidos
  useEffect(() => {
    // console.log('Receta recibida en RecipeCardWeekly:', receta);
  }, [receta]);

  return (
    <TouchableOpacity style={styles.card}>
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
        <Text style={styles.subtitle}>{receta.calorias} kcal</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: '#ccc',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 14,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'DMSans_500Medium',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: '#777',
  },
});
