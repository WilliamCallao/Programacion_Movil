// MainScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const staticRecipes = [
  {
    "id": "0OcR9lsh3ZJOf7Em1vDS",
    "titulo": "Blood Orange Salad (Insalata D’ Arrance Sangouse)",
    "categorias": [
      "Lunch",
      "Salads",
      "Sides"
    ],
    "etiquetas": [
      "CKD Dialysis",
      "CKD Non-Dialysis",
      "Kidney-Friendly",
      "Veggie Rich",
      "Italian",
      "Lunch",
      "Salads",
      "Sides"
    ],
    "imagen_url": "https://diabetesfoodhub.org/sites/foodhub/files/RecId_621_%20Beet_BloodOrange_RedPepperTomaotArtichoke_Salads_ItalianDiabetesCookbook_022618.jpg",
    "ingredientes": [
      {
        "cantidad_metrica": "4",
        "cantidad_us": "4",
        "nombre": "blood oranges (about 1 pound total), peeled and sliced into rounds"
      },
      {
        "cantidad_metrica": "2",
        "cantidad_us": "2",
        "nombre": "green onions, finely chopped"
      },
      {
        "cantidad_us": "1",
        "cantidad_metrica": "1",
        "nombre": "Juice of 1 orange"
      },
      {
        "cantidad_us": "2 tbsp",
        "nombre": "extra virgin olive oil (preferably first cold-pressed and unfiltered)",
        "cantidad_metrica": "30 ml"
      },
      {
        "cantidad_us": "1/4 tsp",
        "nombre": "unrefined sea salt",
        "cantidad_metrica": "1 g"
      },
      {
        "cantidad_metrica": "1 g",
        "cantidad_us": "1/4 tsp",
        "nombre": "freshly ground black pepper"
      },
      {
        "nombre": "crushed red chile flakes",
        "cantidad_us": "1 pinch",
        "cantidad_metrica": "1 ml"
      }
    ],
    "instrucciones": [
      "Place orange slices on a large platter and scatter green onions over the top.",
      "In a small bowl, whisk orange juice and olive oil together, and season with salt, pepper, and crushed red chile flakes. Drizzle over the salad, and serve immediately."
    ],
    "keywords": "Lunch,Salads,Sides",
    "nutricion": {
      "cholesterol": "0mg",
      "trans_fat": "0g",
      "fiber": "2g",
      "saturated_fat": "0.6g",
      "added_sugar": "0g",
      "calories": "80",
      "sugar": "8g",
      "sodium": "100mg",
      "protein": "1g",
      "total_fat": "5g",
      "total_carbohydrate": "11g"
    },
    "porciones": "6 Servings",
    "tiempo_coccion": "PT0M",
    "tiempo_preparacion": "PT5M",
    "url": "https://diabetesfoodhub.org/recipes/blood-orange-salad-insalata-d-arrance-sangouse"
  },
  {
    "id": "0mhEdIjfmCLhypsrNeEi",
    "titulo": "Black Bean and Corn Salad",
    "categorias": [
      "No Cook",
      "Holidays & Entertaining",
      "Lunch",
      "Gluten-Free",
      "Vegetarian",
      "Easy Pantry Recipes",
      "Sides",
      "Quick & Easy"
    ],
    "etiquetas": [
      "CKD Dialysis",
      "CKD Non-Dialysis",
      "Kidney-Friendly",
      "Low Sodium",
      "Veggie Rich",
      "Mexican/Southwestern",
      "No Cook",
      "Holidays & Entertaining",
      "Lunch",
      "Gluten-Free",
      "Vegetarian",
      "Easy Pantry Recipes",
      "Sides",
      "Quick & Easy"
    ],
    "imagen_url": "https://diabetesfoodhub.org/sites/foodhub/files/0086-diabetic-black-bean-corn-salad_diabetes-cookbook_081618_1021x779.jpg",
    "ingredientes": [
      {
        "cantidad_us": "2 (14.5-oz) cans",
        "cantidad_metrica": "2 (14.5-oz) cans",
        "nombre": "black beans (rinsed and drained)"
      },
      {
        "cantidad_metrica": "473 ml",
        "cantidad_us": "2 cup",
        "nombre": "frozen corn (thawed)"
      },
      {
        "nombre": "red bell pepper (finely diced)",
        "cantidad_us": "1",
        "cantidad_metrica": "1"
      },
      {
        "cantidad_metrica": "118 ml",
        "nombre": "finely diced red onion",
        "cantidad_us": "1/2 cup"
      },
      {
        "nombre": "chopped fresh cilantro",
        "cantidad_metrica": "118 ml",
        "cantidad_us": "1/2 cup"
      },
      {
        "cantidad_metrica": "2",
        "nombre": "small limes (juiced)",
        "cantidad_us": "2"
      },
      {
        "nombre": "olive oil",
        "cantidad_metrica": "44 ml",
        "cantidad_us": "3 tbsp"
      },
      {
        "nombre": "cumin",
        "cantidad_metrica": "2 g",
        "cantidad_us": "1/2 tsp"
      },
      {
        "nombre": "garlic powder",
        "cantidad_us": "1/4 tsp",
        "cantidad_metrica": "1 g"
      },
      {
        "cantidad_metrica": "1 g",
        "cantidad_us": "1/4 tsp",
        "nombre": "black pepper"
      },
      {
        "cantidad_us": "1/4 tsp",
        "cantidad_metrica": "1 g",
        "nombre": "cayenne pepper (optional)"
      }
    ],
    "instrucciones": [
      "In a medium bowl, combine beans, corn, red pepper, red onion and cilantro.",
      "In a small bowl, whisk together remaining ingredients and pour over bean salad. Toss to coat."
    ],
    "keywords": "No Cook,Holidays & Entertaining,Lunch,Gluten-Free,Vegetarian,Easy Pantry Recipes,Sides,Quick & Easy",
    "nutricion": {
      "sugar": "2g",
      "protein": "4g",
      "total_fat": "4g",
      "sodium": "50mg",
      "cholesterol": "0mg",
      "saturated_fat": "0.6g",
      "added_sugar": "0g",
      "total_carbohydrate": "16g",
      "fiber": "4g",
      "calories": "110",
      "trans_fat": "0g"
    },
    "porciones": "12 Servings",
    "tiempo_coccion": "Desconocido",
    "tiempo_preparacion": "PT12M",
    "url": "https://diabetesfoodhub.org/recipes/black-bean-and-corn-salad"
  }
];

export default function MainScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lista de Recetas</Text>
      {staticRecipes.map(item => (
        <View key={item.id} style={styles.card}>
          {item.imagen_url ? (
            <Image
              source={{ uri: item.imagen_url }}
              style={styles.image}
              onLoadStart={() => console.log('Loading image:', item.imagen_url)}
              onError={(e) => {
                console.log('Error loading image:', item.imagen_url);
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300';
              }}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Sin Imagen</Text>
            </View>
          )}
          <View style={styles.cardContent}>
            <Text style={styles.recipeTitle}>{item.titulo}</Text>
            <Text style={styles.recipeDetails}>Porciones: {item.porciones}</Text>
            <Text style={styles.recipeDetails}>Tiempo de preparación: {item.tiempo_preparacion}</Text>
            <Text style={styles.recipeDetails}>Tiempo de cocción: {item.tiempo_coccion}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

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
  image: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    marginBottom: 15,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
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
  cardContent: {
    flexDirection: 'column',
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
});