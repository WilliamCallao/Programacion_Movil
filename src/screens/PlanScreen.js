import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import HeaderSections from '../components/HeaderSections';
import PlanSelector from '../components/PlanSelector';
import { obtenerUsuario } from '../services/usuarioService';
import { obtenerRecetasPorIds } from '../services/recetaService';
import Secciones56 from '../components/RecipesPlan';

const USER_ID = 'Ieq3dMwGsdDqInbvlUvy';

const getDayName = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('es-ES', { weekday: 'long' });
};

export default function MainScreen() {
  const [selectedButton, setSelectedButton] = useState('Hoy');
  const [usuario, setUsuario] = useState(null);
  const [recetasDelDia, setRecetasDelDia] = useState([]);
  const [totalCalorias, setTotalCalorias] = useState(0);

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
    const fetchRecetas = async () => {
      try {
        if (usuario) {
          const offset = selectedButton === 'Mañana' ? 1 : 0;
          const targetDay = (new Date().getDay() + offset) % 7;

          const planDelDia = usuario.planes_alimentacion.find(
            (plan) => plan.dia === targetDay
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

            const total = recetas.reduce((sum, receta) => {
              return sum + (parseFloat(receta.nutricion?.calories) || 0);
            }, 0);
            setTotalCalorias(total);
          } else {
            console.log('No se encontró un plan para el día.');
          }
        }
      } catch (error) {
        console.error('Error al obtener las recetas:', error);
      }
    };

    fetchRecetas();
  }, [usuario, selectedButton]);

  const handleButtonPress = (button) => setSelectedButton(button);

  return (
    <View style={styles.container}>
      <HeaderSections dia={getDayName(selectedButton === 'Mañana' ? 1 : 0)} calorias={totalCalorias} />
      <PlanSelector selectedButton={selectedButton} onButtonPress={handleButtonPress} />
      {selectedButton === 'Semanal' ? (
        <View style={styles.section7}>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins_500Medium',
  },
});
