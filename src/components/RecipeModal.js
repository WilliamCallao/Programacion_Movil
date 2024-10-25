import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const RecipeModal = ({ visible, onClose, recipe }) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // console.log("Datos recibidos en RecipeModal:", JSON.stringify(recipe, null, 2));
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    setScrollY(contentOffset.y);
  };

  const handleScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y <= 0 && scrollY <= 0) {
      onClose();
    }
  };

  const formatTime = (isoTime) => {
    if (isoTime === 'Desconocido') return null;
    const regex = /PT(\d+)M/;
    const match = isoTime.match(regex);
    return match ? `${match[1]} min.` : isoTime;
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity }]}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <MaterialCommunityIcons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="heart-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEndDrag}
          scrollEventThrottle={16}
        >
          <Text style={styles.recipeTitle}>{recipe.titulo}</Text>
          <Image source={{ uri: recipe.imagen_url }} style={styles.recipeImage} />

          <View style={styles.infoRow}>
            <View style={[styles.infoBox, styles.porcionesBox]}>
              <MaterialCommunityIcons name="food" size={24} color="#FF6347" />
              <Text style={styles.infoTitle}>Porciones</Text>
              <Text style={styles.infoValue}>{extractNumber(recipe.porciones)}</Text>
            </View>
            {recipe.tiempo_preparacion !== 'Desconocido' && (
              <View style={[styles.infoBox, styles.preparacionBox]}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#1E90FF" />
                <Text style={styles.infoTitle}>Prep.</Text>
                <Text style={styles.infoValue}>{formatTime(recipe.tiempo_preparacion)}</Text>
              </View>
            )}
            {recipe.tiempo_coccion !== 'Desconocido' && (
              <View style={[styles.infoBox, styles.coccionBox]}>
                <MaterialCommunityIcons name="clock-check-outline" size={24} color="#32CD32" />
                <Text style={styles.infoTitle}>Coc.</Text>
                <Text style={styles.infoValue}>{formatTime(recipe.tiempo_coccion)}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            {recipe.ingredientes.map((ing, index) => (
              <Text key={index} style={styles.ingredientText}>
                • {ing.nombre} - {ing.cantidad_metrica}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instrucciones</Text>
            {recipe.instrucciones.map((step, index) => (
              <Text key={index} style={styles.instructionText}>
                {index + 1}. {step}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Nutricional</Text>
            <View style={styles.nutritionGrid}>
              {Object.entries(recipe.nutricion).map(([key, value]) => (
                <View key={key} style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>{capitalizeWords(key.replace('_', ' '))}:</Text>
                  <Text style={styles.nutritionValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const extractNumber = (str) => {
  const match = str.match(/\d+/);
  return match ? match[0] : str;
};

const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '90%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  iconButton: {
    padding: 5,
  },
  recipeTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  recipeImage: {
    width: screenWidth - 40,
    height: 200,
    borderRadius: 15,
    alignSelf: 'center',
    marginVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  infoBox: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  porcionesBox: {
    backgroundColor: '#FFF0F5',
  },
  preparacionBox: {
    backgroundColor: '#F0F8FF',
  },
  coccionBox: {
    backgroundColor: '#F5FFFA',
  },
  infoTitle: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: '#6e6e6e',
    marginTop: 5,
  },
  infoValue: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 22,
    marginBottom: 10,
    color: '#333',
  },
  ingredientText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: '#333',
    marginVertical: 3,
  },
  instructionText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
    lineHeight: 24,
  },
  nutritionGrid: {
    marginTop: 10,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  nutritionLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    color: '#6e6e6e',
  },
  nutritionValue: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
    color: '#333',
  },
});

export default RecipeModal;
