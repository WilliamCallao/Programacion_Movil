// src/components/RecipeCard.js
import React, { memo } from 'react';
import { Text, StyleSheet, Image, Dimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.75;

const RecipeCard = ({ item, onImageError }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
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
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.8)']}
            style={styles.gradient}
          />
          <View style={styles.textContainer}>
            <Text style={styles.recipeTitle}>{item.titulo}</Text>
            <View style={styles.labels}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#fff" />
                <Text style={styles.label}>{formatTime(item.tiempo_preparacion)}</Text>
              </View>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons name="chef-hat" size={20} color="#fff" />
                <Text style={styles.label}>{formatTime(item.tiempo_coccion)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
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
    marginLeft: 15,
    marginVertical: 10,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    backgroundColor: 'white',
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
    marginLeft: 10,
  },
  labels: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  label: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
    paddingTop: 5,
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
