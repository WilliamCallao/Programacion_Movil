// components/RecipeCard.js
import React, { memo, useState } from 'react';
import { Text, StyleSheet, Image, Dimensions, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RecipeModal from './RecipeModal';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.75;

const RecipeCard = ({ item, index, scrollX, onImageError, isFavorite, onToggleFavorite }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <TouchableOpacity onPress={openModal} style={styles.cardContainer} activeOpacity={0.8}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            {item.imagen_url && !item.imageError ? (
              <>
                <Image
                  source={{ uri: item.imagen_url }}
                  style={styles.image}
                  onError={() => onImageError(item.id)}
                  resizeMode="cover"
                  onLoadStart={() => setIsLoading(true)}
                  onLoadEnd={() => setIsLoading(false)}
                />
                {isLoading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#888" />
                  </View>
                )}
              </>
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
      </TouchableOpacity>

      <RecipeModal
        visible={modalVisible}
        onClose={closeModal}
        recipe={item}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
    </>
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
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#6A6A6A',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: 'DMSans_500Medium',
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
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
    paddingTop: 5,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A6A6A',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default memo(RecipeCard);
