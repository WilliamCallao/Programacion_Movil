// MainScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { db } from '../services/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export default function MainScreen() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrorIds, setImageErrorIds] = useState([]);
  const [debugData, setDebugData] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesCollection = collection(db, 'recetas');
        const recipesQuery = query(recipesCollection, limit(1));

        const recipesSnapshot = await getDocs(recipesQuery);
        const recipesList = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const recipesJson = JSON.stringify(recipesList, null, 2);

        setDebugData(recipesJson);

        console.log("Datos obtenidos de Firestore (limit 1):", recipesJson);

        setRecipes(recipesList);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleImageError = (id) => {
    setImageErrorIds(prevState => [...prevState, id]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Cargando recetas...</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;
  const imageHeight = (screenWidth - 20) * 9 / 16;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi Plan</Text>
      {recipes.map(item => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.recipeTitle}>{item.titulo}</Text>
            <Text style={styles.recipeDetails}>Porciones: {item.porciones}</Text>
            <Text style={styles.recipeDetails}>Tiempo de preparación: {formatTime(item.tiempo_preparacion)}</Text>
            <Text style={styles.recipeDetails}>Tiempo de cocción: {formatTime(item.tiempo_coccion)}</Text>
          </View>

          {item.imagen_url && !imageErrorIds.includes(item.id) ? (
            <View style={[styles.imageContainer, { height: imageHeight }]}>
              <Image
                source={{ uri: item.imagen_url }}
                style={styles.image}
                onError={() => handleImageError(item.id)}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={[styles.imagePlaceholder, { height: imageHeight }]}>
              <Text style={styles.placeholderText}>Sin Imagen</Text>
            </View>
          )}
        </View>
      ))}

      {debugData && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Datos Obtenidos Firebase:</Text>
          <Text style={styles.debugText}>{debugData}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const formatTime = (timeString) => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = timeString.match(regex);
  if (!matches) return 'Desconocido';

  const hours = matches[1] ? `${matches[1]}h ` : '';
  const minutes = matches[2] ? `${matches[2]}m ` : '';
  const seconds = matches[3] ? `${matches[3]}s` : '';
  return `${hours}${minutes}${seconds}`.trim();
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  cardContent: {
    flexDirection: 'column',
    marginBottom: 15,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  recipeDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  imageContainer: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imagePlaceholder: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  debugContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 14,
    color: '#333',
  },
});