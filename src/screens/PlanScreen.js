import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import HeaderSections from '../components/HeaderSections';
import PlanSelector from '../components/PlanSelector';
import { obtenerUsuario } from '../services/usuarioService';
import { obtenerRecetasPorIds } from '../services/recetaService';
import Secciones56 from '../components/RecipesPlan';

const SECTION_HEIGHT_PERCENTAGES = [5, 7, 9, 16, 12];
const COLORS = ['#FFF', '#33FF57', '#3357FF', '#FF33A6', '#F3FF33', '#33FFF5'];
const USER_ID = 'Ieq3dMwGsdDqInbvlUvy';
const CURRENT_DAY = 2;

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const datosUsuario = await obtenerUsuario(USER_ID);
        if (datosUsuario) setUsuario(datosUsuario);
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

  const handleButtonPress = (button) => setSelectedButton(button);

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
        <Secciones56 recetas={recetasDelDia} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
