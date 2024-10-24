// MainScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import HeaderSections from '../components/HeaderSections';
import PlanSelector from '../components/PlanSelector';
import { obtenerUsuario } from '../services/usuarioService';
import { obtenerRecetasPorIds } from '../services/recetaService';  // Importamos el servicio

const SECTION_HEIGHT_PERCENTAGES = [5, 10, 8, 10, 17];
const COLORS = ['#FFF', '#33FF57', '#3357FF', '#FF33A6', '#F3FF33', '#33FFF5'];
const USER_ID = 'Ieq3dMwGsdDqInbvlUvy';

export default function MainScreen() {
  const { height } = Dimensions.get('window');
  const totalUsedHeightPercentage = SECTION_HEIGHT_PERCENTAGES.reduce(
    (sum, percentage) => sum + percentage,
    0
  );
  const remainingHeightPercentage = 100 - totalUsedHeightPercentage;

  const [selectedButton, setSelectedButton] = useState('Hoy');
  const [usuario, setUsuario] = useState(null);
  const CURRENT_DAY = 1;

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
    const fetchRecetas = async (idsRecetas) => {
      try {
        const recetas = await obtenerRecetasPorIds(idsRecetas);  // Usamos el servicio para obtener las recetas
        console.log('Recetas obtenidas:', recetas);
      } catch (error) {
        console.error('Error al obtener las recetas:', error);
      }
    };

    if (usuario) {
      const planDelDia = usuario.planes_alimentacion.find(
        (plan) => plan.dia === CURRENT_DAY
      );
      if (planDelDia) {
        const { comidas } = planDelDia;
        const tiposDeComida = ['Desayuno', 'Almuerzo', 'Cena', 'Snacks'];
        tiposDeComida.forEach((tipo) => {
          if (comidas[tipo]) {
            const idsRecetas = comidas[tipo].map((receta) => receta.id);
            console.log(`IDs de recetas para ${tipo} del día ${CURRENT_DAY}:`, idsRecetas);
            fetchRecetas(idsRecetas);  // Llamamos al servicio para obtener las recetas
          }
        });
        console.log(`Total de calorías para el día ${CURRENT_DAY}:`, comidas.TotalCalorias);
      } else {
        console.log(`No se encontró un plan para el día ${CURRENT_DAY}.`);
      }
    }
  }, [usuario]);

  const handleButtonPress = (button) => {
    setSelectedButton(button);
  };

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
              { backgroundColor: COLORS[4], height: (height * SECTION_HEIGHT_PERCENTAGES[4]) / 100 },
            ]}
          >
            <Text style={styles.text}>Sección 5</Text>
          </View>
          <View
            style={[
              styles.section6,
              { backgroundColor: COLORS[5], height: (height * remainingHeightPercentage) / 100 },
            ]}
          >
            <Text style={styles.text}>Sección 6</Text>
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
  },
  section6: {
    justifyContent: 'center',
    alignItems: 'center',
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
