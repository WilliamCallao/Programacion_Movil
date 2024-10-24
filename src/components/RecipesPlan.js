// src/components/Secciones56.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import RecipeCard from './RecipeCard';

const ITEM_WIDTH = Dimensions.get('window').width * 0.75;

export default function Secciones56({ recetas }) {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const renderRecipeCard = ({ item, index }) => (
    <RecipeCard item={item} index={index} scrollX={scrollX} onImageError={() => {}} />
  );

  return (
    <>
      <View style={styles.section5}>
        <Text style={styles.text}>Sección 5</Text>
      </View>
      <View style={styles.section6}>
        {recetas.length > 0 ? (
          <Animated.FlatList
            data={recetas}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipeCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            snapToInterval={ITEM_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={{ alignItems: 'center' }}
          />
        ) : (
          <Text style={styles.text}>Cargando recetas...</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section5: {
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  section6: {
    flex: 1,
  },
  text: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'DMSans_400Regular',
  },
});
