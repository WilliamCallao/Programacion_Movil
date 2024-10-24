import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import HeaderSections from '../components/HeaderSections';
import PlanSelector from '../components/PlanSelector';
import { obtenerUsuario } from '../services/usuarioService';
import { obtenerRecetasPorIds } from '../services/recetaService';
import RecipeCard from '../components/RecipeCard';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';

const SECTION_HEIGHT_PERCENTAGES = [5, 7, 9, 16, 10];
const COLORS = ['#FFF', '#33FF57', '#3357FF', '#FF33A6', '#F3FF33', '#33FFF5'];
const USER_ID = 'Ieq3dMwGsdDqInbvlUvy';

const ITEM_WIDTH = Dimensions.get('window').width * 0.75;

export default function MainScreen() {
  const { height } = Dimensions.get('window');
  
  const totalUsedHeightPercentage = SECTION_HEIGHT_PERCENTAGES.reduce(
    (sum, percentage) => sum + percentage,
    0
  );
  const remainingHeightPercentage = 100 - totalUsedHeightPercentage;

  const [selectedButton, setSelectedButton] = useState('Hoy');
  const [usuario, setUsuario] = useState(null);
  const [recetasDelDia, setRecetasDelDia] = useState([]);
  const CURRENT_DAY = 2;

  const scrollX = useSharedValue(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const datosUsuario = await obtenerUsuario(USER_ID);
        if (datosUsuario) {
          setUsuario(datosUsuario);
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchRecetasDelDia = async () => {
      try {
        if (usuario) {
          const planDelDia = usuario.planes_alimentacion.find(
            (plan) => plan.dia === CURRENT_DAY
          );
          if (planDelDia) {
            const { comidas } = planDelDia;
            const tiposDeComida = ['Desayuno', 'Almuerzo', 'Cena', 'Snacks'];

            let idsRecetas = [];
            tiposDeComida.forEach((tipo) => {
              if (comidas[tipo]) {
                const ids = comidas[tipo].map((receta) => receta.id);
                idsRecetas = idsRecetas.concat(ids);
              }
            });

            idsRecetas = [...new Set(idsRecetas)];
            const recetas = await obtenerRecetasPorIds(idsRecetas);
            setRecetasDelDia(recetas);
          } else {
            console.log(`No se encontró un plan para el día ${CURRENT_DAY}.`);
          }
        }
      } catch (error) {
        console.error('Error al obtener las recetas del día:', error);
      }
    };

    fetchRecetasDelDia();
  }, [usuario]);

  const handleButtonPress = (button) => {
    setSelectedButton(button);
  };

  const renderRecipeCard = ({ item, index }) => (
    <RecipeCard item={item} index={index} scrollX={scrollX} onImageError={() => {}} />
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <HeaderSections />
      <PlanSelector selectedButton={selectedButton} onButtonPress={handleButtonPress} />
      {selectedButton === 'Semanal' ? (
        <View 
          style={[
            styles.section7,
            {
              backgroundColor: COLORS[4],
              height: (height * (SECTION_HEIGHT_PERCENTAGES[4] + remainingHeightPercentage)) / 100,
            },
          ]}
        >
          <Text style={styles.text}>Sección 7</Text>
        </View>
      ) : (
        <>
          <View
            style={[
              styles.section5,
              { height: (height * SECTION_HEIGHT_PERCENTAGES[4]) / 100 },
            ]}
          >
            <Text style={styles.text}>Sección 5</Text>
          </View>
          <View
            style={[
              styles.section6,
              {
                height: (height * remainingHeightPercentage) / 100,
              },
            ]}
          >
            {recetasDelDia.length > 0 ? (
              <Animated.FlatList
                data={recetasDelDia}
                keyExtractor={(item) => item.id}
                renderItem={renderRecipeCard}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                snapToInterval={ITEM_WIDTH+16}
                decelerationRate="fast"
                contentContainerStyle={{ alignItems: 'center' }}
              />
            ) : (
              <Text style={styles.text}>Cargando recetas...</Text>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section5: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green'
  },
  section6: {
    backgroundColor: 'blue'
  },
  section7: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
    fontFamily: 'Poppins_500Medium',
  },
});
