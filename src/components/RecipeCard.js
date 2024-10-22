// src/components/RecipeCard.js
import React, { memo } from 'react';
import { Text, StyleSheet, Image, Dimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.75;

const RecipeCard = ({ item, index, scrollX, onImageError }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH],
      [0.85, 1, 0.85],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <Animated.View style={[styles.card]}>
        <View style={styles.imageContainer}>
          {item.imagen_url && !item.imageError ? (
            <Image
              source={{ uri: item.imagen_url }}
              style={styles.image}
              onError={() => onImageError(item.id)}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Sin Imagen</Text>
            </View>
          )}
          <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.8)']} style={styles.gradient} />
          <View style={styles.textContainer}>
            <Text style={styles.recipeTitle}>{item.titulo}</Text>
            <View style={styles.labels}>
              <Text style={styles.label}>Prep: {formatTime(item.tiempo_preparacion)}</Text>
              <Text style={styles.label}>Cocción: {formatTime(item.tiempo_coccion)}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

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
  cardContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    backgroundColor: 'white',
    height: ITEM_WIDTH * 1.20,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
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
});

export default memo(RecipeCard);
