// src/screens/PlanScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { db } from '../services/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import RecipeCard from '../components/RecipeCard';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.6;
const SPACING = 15;

export default function MainScreen() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrorIds, setImageErrorIds] = useState([]);

  const scrollX = useSharedValue(0);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesCollection = collection(db, 'recetas');
        const recipesQuery = query(recipesCollection, limit(10));

        const recipesSnapshot = await getDocs(recipesQuery);
        const recipesList = recipesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecipes(recipesList);
      } catch (error) {
        console.error('Error fetching recipes: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleImageError = (id) => {
    setImageErrorIds((prevState) => [...prevState, id]);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Cargando recetas...</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <RecipeCard
      item={{
        ...item,
        imageError: imageErrorIds.includes(item.id),
      }}
      index={index}
      scrollX={scrollX}
      onImageError={handleImageError}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Plan</Text>
      <Animated.FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        snapToInterval={ITEM_WIDTH+59}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
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
