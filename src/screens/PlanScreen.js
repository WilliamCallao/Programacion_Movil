import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import HeaderSections from '../components/HeaderSections';
import PlanSelector from '../components/PlanSelector';
import { obtenerUsuario } from '../services/usuarioService';
import { obtenerRecetasPorIds } from '../services/recetaService';
import Secciones56 from '../components/RecipesPlan';

const USER_ID = 'Ieq3dMwGsdDqInbvlUvy';
const CURRENT_DAY = new Date().toLocaleDateString('es-ES', { weekday: 'long' });

export default function MainScreen() {
  const { height } = Dimensions.get('window');
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
    const fetchRecetasDelDia = async () => {
      try {
        if (usuario) {
          const planDelDia = usuario.planes_alimentacion.find(
            (plan) => plan.dia === new Date().getDay()
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
        console.error('Error al obtener las recetas del día:', error);
      }
    };

    fetchRecetasDelDia();
  }, [usuario]);

  const handleButtonPress = (button) => setSelectedButton(button);

  return (
    <View style={styles.container}>
      {/* Enviar día y calorías al HeaderSections */}
      <HeaderSections dia={CURRENT_DAY} calorias={totalCalorias} />
      <PlanSelector selectedButton={selectedButton} onButtonPress={handleButtonPress} />
      {selectedButton === 'Semanal' ? (
        <View style={[styles.section7, { height: height * 0.12 }]}>
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
    fontFamily: 'Poppins_500Medium',
  },
});
