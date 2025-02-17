const data = {
    planes_alimentacion: [
    {
      id_plan: "plan_001",
      id_usuario: "user_12345",
      fecha_inicio: "2023-10-01",
      fecha_fin: "2023-10-07",
      calorias_totales: 1500, 
      distribucion_macronutrientes: {
        carbohidratos: 50,
        proteinas: 30,
        grasas: 20,
      },
      dias: [
        {
          dia: "Lunes",
          recetas: [
            {
              id_receta: "08zODncmnAXDn4C9Ad8m",
              titulo: "Muffins de Proteína con Arándanos y 5 Ingredientes",
              calorias: 140,
              macronutrientes: {
                carbohidratos: 14,
                proteinas: 5,
                grasas: 7,
              },
            },
            {
              id_receta: "09MdEIvsfTimtbdMlkPU",
              titulo: "Cerdo a la Parrilla con Salsa de Tomate, Alcachofa y Kale",
              calorias: 180,
              macronutrientes: {
                carbohidratos: 8,
                proteinas: 19,
                grasas: 8,
              },
            },
          ],
        },
        {
          dia: "Martes",
          recetas: [
            {
              id_receta: "0DAC7gqEbU0Ccq8TSHV6",
              titulo: "Ensalada de Bistec a la Parrilla",
              calorias: 170,
              macronutrientes: {
                carbohidratos: 8,
                proteinas: 17,
                grasas: 7,
              },
            },
            {
              id_receta: "0Lj9LaaIfguaJ2u62OUD",
              titulo: "Bocaditos de Coles de Bruselas Rellenas – Receta Foodie",
              calorias: 45,
              macronutrientes: {
                carbohidratos: 2,
                proteinas: 3,
                grasas: 3.5,
              },
            },
          ],
        },
      ],
      total_nutricion: {
        calorias: 535,
        proteinas: 44,
        carbohidratos: 32,
        grasas: 25.5,
      },
      estado_plan: "activo",
    },
  ],
    recetas: [
      {
        id: "08zODncmnAXDn4C9Ad8m",
        porciones: "6 Servings",
        nutricion: {
          calories: "140",
          saturated_fat: "1g",
          total_carbohydrate: "14g",
          trans_fat: "0g",
          cholesterol: "0mg",
          fiber: "3g",
          sodium: "30mg",
          total_fat: "7g",
          sugar: "7g",
          added_sugar: "0g",
          protein: "5g",
        },
        keywords: "Quick & Easy,Breakfast and Brunch,Budget Friendly,Foodie,Sides",
        tiempo_coccion: "PT20M",
        imagen_url: "https://diabetesfoodhub.org/sites/foodhub/files/5%20ingredient%20blueberry%20muffins%20diabetic.png",
        tiempo_preparacion: "PT10M",
        etiquetas: ["Quick & Easy", "Breakfast and Brunch", "Budget Friendly", "Foodie", "Sides"],
        instrucciones: [
          "Precaliente el horno a 375˚F. Rocíe 6 moldes para muffins con aceite en aerosol. En un tazón grande, mezcle bien el plátano, la quinoa, el yogur descremado y la mantequilla de almendras. Incorpore los arándanos.",
          "Vierta la mezcla con una cuchara en los moldes para muffins preparados. Hornee durante 20 a 25 minutos o hasta que estén dorados y firmes en el centro. Deje enfriar por completo.",
        ],
        categorias: ["Quick & Easy", "Breakfast and Brunch", "Budget Friendly", "Foodie", "Sides"],
        ingredientes: [
          { cantidad_metrica: "1", nombre: "plátano(s)", cantidad_us: "1" },
          { cantidad_metrica: "237 ml", nombre: "quinua (cocida)", cantidad_us: "1 cup" },
          { nombre: "Yogur griego de vainilla (sin grasa)", cantidad_us: "1/4 cup", cantidad_metrica: "59 ml" },
          { cantidad_us: "1/4 cup", cantidad_metrica: "59 ml", nombre: "mantequilla de almendras" },
          { nombre: "arándanos (frescos)", cantidad_us: "1 cup", cantidad_metrica: "237 ml" },
        ],
        titulo: "Muffins de Proteína con Arándanos y 5 Ingredientes",
        url: "https://diabetesfoodhub.org/recipes/5-ingredient-blueberry-protein-muffins",
      },
      {
        id: "09MdEIvsfTimtbdMlkPU",
        porciones: "4 Servings",
        keywords: "Main Dish,Dinner,Quick & Easy",
        tiempo_preparacion: "PT10M",
        tiempo_coccion: "PT8M",
        imagen_url: "https://diabetesfoodhub.org/sites/foodhub/files/RecId_734_2Step_GrilledPorkWithTomatoKalamataAndKaleSalsa_022618.jpg",
        ingredientes: [
          { cantidad_us: "4", cantidad_metrica: "4", nombre: "chuletas de cerdo (sin hueso)" },
          { cantidad_metrica: "1 g", cantidad_us: "1/4 tsp", nombre: "sal" },
          { cantidad_us: "1/4 tsp", nombre: "pimienta negra", cantidad_metrica: "1 g" },
          { nombre: "tomato(es) (diced)", cantidad_metrica: "237 ml", cantidad_us: "1 cup" },
          { cantidad_us: "1/3 cup", nombre: "Corazones de alcachofa enlatados, cortados en cuartos (picados)", cantidad_metrica: "78 ml" },
          { cantidad_us: "1/2 cup", cantidad_metrica: "118 ml", nombre: "col rizada fresca (finamente picada)" },
          { cantidad_us: "1/4 cup", cantidad_metrica: "59 ml", nombre: "cebolla roja (finamente picada)" },
          { cantidad_metrica: "5 g", nombre: "Orégano seco (o 1 cucharada de orégano fresco)", cantidad_us: "1 tsp" },
          { nombre: "Aceite de oliva virgen extra", cantidad_metrica: "15 ml", cantidad_us: "1 tbsp" },
          { cantidad_us: "2 tsp", nombre: "vinagre de sidra", cantidad_metrica: "10 g" },
          { nombre: "sal", cantidad_us: "1/4 tsp", cantidad_metrica: "1 g" },
        ],
        titulo: "Cerdo a la Parrilla con Salsa de Tomate, Alcachofa y Kale",
        instrucciones: [
          "Calienta una parrilla o sartén para asar cubierta con aceite en aerosol a fuego medio-alto. Espolvorea ambos lados de las chuletas de cerdo con sal y pimienta y cocina durante 4 minutos de cada lado o hasta que estén ligeramente rosadas en el centro.",
          "Mientras tanto, combine los ingredientes de la salsa en un recipiente mediano. Sirva con la carne de cerdo.",
        ],
        categorias: ["Main Dish", "Dinner", "Quick & Easy"],
        nutricion: {
          protein: "19g",
          saturated_fat: "2.2g",
          trans_fat: "0g",
          sugar: "3g",
          sodium: "415mg",
          total_carbohydrate: "8g",
          calories: "180",
          cholesterol: "45mg",
          added_sugar: "0g",
          fiber: "3g",
          total_fat: "8g",
        },
        url: "https://diabetesfoodhub.org/recipes/grilled-pork-tomato-artichoke-and-kale-salsa",
      },
      {
        id: "0DAC7gqEbU0Ccq8TSHV6",
        keywords: "Budget Friendly,Dinner,Salads,Lunch",
        porciones: "4 Servings",
        ingredientes: [
          { nombre: "filete de solomillo", cantidad_us: "9 oz", cantidad_metrica: "255 ml" },
          { cantidad_metrica: "2 g", cantidad_us: "1/2 tsp", nombre: "condimento sin sal (como Mrs. Dash)" },
          { cantidad_metrica: "1 l 893 ml", nombre: "mezcla de ensalada mesclum", cantidad_us: "8 cup" },
          { cantidad_metrica: "1/4", cantidad_us: "1/4", nombre: "cebolla roja (en rodajas finas)" },
          { nombre: "Tomates cherry (cortados por la mitad a lo largo)", cantidad_us: "1 cup", cantidad_metrica: "237 ml" },
          { cantidad_metrica: "59 ml", cantidad_us: "1/4 cup", nombre: "mayonesa ligera" },
          { cantidad_metrica: "59 ml", nombre: "Yogur griego natural sin grasa", cantidad_us: "1/4 cup" },
          { nombre: "suero de leche bajo en grasa", cantidad_metrica: "59 ml", cantidad_us: "1/4 cup" },
          { nombre: "ajo (picado o rallado)", cantidad_us: "1 diente", cantidad_metrica: "1 diente" },
          { cantidad_metrica: "1 g", cantidad_us: "1/4 tsp", nombre: "pimienta negra" },
          { nombre: "queso azul desmenuzado", cantidad_metrica: "30 ml", cantidad_us: "2 tbsp" },
        ],
        titulo: "Ensalada de Bistec a la Parrilla",
        url: "https://diabetesfoodhub.org/recipes/grilled-steak-salad",
        imagen_url: "https://diabetesfoodhub.org/sites/foodhub/files/290-diabetic-grilled-steak-salad_090718_1021x779.jpg",
        instrucciones: [
          "Calienta una parrilla interior o exterior. Sazona ambos lados del filete con el condimento sin sal.",
          "Ase el filete durante 5 a 6 minutos por lado o hasta que esté bien cocido (145 grados de temperatura interna). Déjelo reposar cubierto sin apretar con papel de aluminio.",
          "En un bol grande, mezcle la ensalada, la cebolla morada y los tomates cherry. Reparta la mezcla en partes iguales entre 4 platos grandes.",
          "Corte el filete en rodajas finas y cubra cada ensalada con 2 onzas de filete.",
          "En un bol pequeño, mezcle la mayonesa, el yogur, el suero de leche, el ajo, el queso azul y la pimienta. Cubra cada ensalada de filete con 3 cucharadas y media de aderezo.",
        ],
        tiempo_coccion: "PT12M",
        etiquetas: [
          "CKD Dialysis",
          "CKD Non-Dialysis",
          "Kidney-Friendly",
          "Low Sodium",
          "Lower Carb",
          "Veggie Rich",
          "Grilling",
          "Budget Friendly",
          "Dinner",
          "Salads",
          "Lunch"
        ],
        categorias: ["Budget Friendly", "Dinner", "Salads", "Lunch"],
        tiempo_preparacion: "PT15M",
        nutricion: {
          cholesterol: "30mg",
          trans_fat: "0g",
          protein: "17g",
          added_sugar: "0g",
          calories: "170",
          sugar: "4g",
          total_carbohydrate: "8g",
          fiber: "1g",
          saturated_fat: "2.1g",
          total_fat: "7g",
          sodium: "260mg",
        },
      },
      {
        id: "0Lj9LaaIfguaJ2u62OUD",
        imagen_url: "https://diabetesfoodhub.org/sites/foodhub/files/Recid_525_Stuffed_Brussels_Sprouts_Bites_PNCImages_03012018.jpg",
        nutricion: {
          saturated_fat: "1.4g",
          cholesterol: "5mg",
          sodium: "70mg",
          calories: "45",
          protein: "3g",
          added_sugar: "0g",
          total_fat: "3.5g",
          sugar: "1g",
          fiber: "1g",
          total_carbohydrate: "2g",
          trans_fat: "0g",
        },
        porciones: "12 Servings",
        tiempo_preparacion: "PT20M",
        ingredientes: [
          { cantidad_metrica: "12", nombre: "Coles de Bruselas grandes", cantidad_us: "12" },
          { cantidad_metrica: "15 ml", nombre: "aceite de oliva", cantidad_us: "1 tbsp" },
          { nombre: "tocino de pavo magro (cortado en cubitos)", cantidad_metrica: "3 slice", cantidad_us: "3 slice" },
          { nombre: "ajo (picado)", cantidad_metrica: "1 diente", cantidad_us: "1 diente" },
          { cantidad_us: "3 oz", nombre: "queso de cabra blando", cantidad_metrica: "85 ml" },
          { cantidad_us: "2 tbsp", nombre: "leche desnatada", cantidad_metrica: "30 ml" },
          { nombre: "sal (opcional)", cantidad_metrica: "2 g", cantidad_us: "1/2 tsp" },
          { cantidad_us: "1/4 tsp", cantidad_metrica: "1 g", nombre: "pimienta negra" },
          { cantidad_us: "1 tbsp", cantidad_metrica: "15 ml", nombre: "Queso parmesano (rallado)" },
        ],
        titulo: "Bocaditos de Coles de Bruselas Rellenas – Receta Foodie",
        tiempo_coccion: "Desconocido",
        keywords: "Appetizers,Sides,Foodie,Holidays & Entertaining",
        instrucciones: [
          "Precaliente el horno a 400 grados F.",
          "Recorta los extremos de las coles de Bruselas y córtalas por la mitad, a lo largo. Pon a hervir una olla grande con agua y escalda las coles durante 2 minutos, escúrrelas y reserva.",
          "Usando un sacabolas o una cucharadita medidora, quite el corazón de los brotes, reserve las cáscaras y pique en trozos grandes los corazones extraídos.",
          "Añade aceite de oliva a una sartén mediana a fuego medio. Añade el tocino y saltea hasta que esté casi crujiente. Añade los brotes picados y el ajo y saltea durante 3 o 4 minutos más hasta que los brotes se ablanden.",
          "En un bol, mezcla el queso de cabra, la leche, la sal (opcional), la pimienta negra y el queso parmesano. Añade el tocino salteado y las coles de Bruselas y mezcla bien.",
          "Divida la mezcla de relleno uniformemente entre cada núcleo de brote (aproximadamente una cucharadita colmada). Coloque los brotes en una bandeja para hornear y hornee durante 20 minutos o hasta que los brotes rellenos estén de un color marrón dorado. Sirva tibio.",
        ],
        categorias: ["Appetizers", "Sides", "Foodie", "Holidays & Entertaining"],
        etiquetas: [
          "Veggie Rich",
          "Lower Carb",
          "Low Sodium",
          "Appetizers",
          "Sides",
          "Foodie",
          "Holidays & Entertaining"
        ],
        url: "https://diabetesfoodhub.org/recipes/stuffed-brussels-sprouts-bites-foodie-recipe",
      },
    ],
  };
  
  export default data;
  