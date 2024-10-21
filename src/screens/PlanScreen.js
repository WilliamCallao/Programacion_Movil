import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../services/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export default function MainScreen() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrorIds, setImageErrorIds] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesCollection = collection(db, 'recetas');
        const recipesQuery = query(recipesCollection, limit(10));

        const recipesSnapshot = await getDocs(recipesQuery);
        const recipesList = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
          <View style={[styles.imageContainer, { height: imageHeight + 70 }]}>
            {item.imagen_url && !imageErrorIds.includes(item.id) ? (
              <Image
                source={{ uri: item.imagen_url }}
                style={styles.image}
                onError={() => handleImageError(item.id)}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>Sin Imagen</Text>
              </View>
            )}
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 1)']}
              style={styles.gradient}
            />
            <View style={styles.textContainer}>
              <Text style={styles.recipeTitle}>{item.titulo}</Text>
              <View style={styles.labels}>
                <Text style={styles.label}>Prep: {formatTime(item.tiempo_preparacion)}</Text>
                <Text style={styles.label}>Cocción: {formatTime(item.tiempo_coccion)}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
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
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    marginVertical: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  imageContainer: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  recipeTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  labels: {
    flexDirection: 'row',
  },
  label: {
    fontFamily: 'Poppins_400Regular',
    backgroundColor: 'rgba(177, 177, 177, 0.5)',
    borderRadius: 50,
    marginHorizontal: 8,
    marginBottom: 8,
    paddingHorizontal: 15,
    paddingTop: 3,
    paddingBottom: 0,
    fontSize: 14,
    color: '#fff',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
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
});
