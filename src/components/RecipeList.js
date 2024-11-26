// Importaciones necesarias
import React from 'react';
import { FlatList } from 'react-native';
import RecipeCardBiblioteca from './RecipeCardBiblioteca';

const RecipeList = ({ recipes, onRecipePress }) => {
  const numColumns = 2;

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      key={`flatlist-${numColumns}`}
      renderItem={({ item }) => (
        <RecipeCardBiblioteca
          recipe={item}
          onPress={() => onRecipePress(item)}
        />
      )}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
    />
  );
};

export default RecipeList;
