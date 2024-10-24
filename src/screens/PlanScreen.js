import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import HeaderSections from '../components/HeaderSections';
import PlanSelector from '../components/PlanSelector';
import { obtenerUsuario } from '../services/usuarioService';
import { obtenerRecetasPorIds } from '../services/recetaService';
import Secciones56 from '../components/RecipesPlan';
import WeeklyView from '../components/WeeklyView';

const USER_ID = 'Ieq3dMwGsdDqInbvlUvy';

const getDayName = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('es-ES', { weekday: 'long' });
};

export default function MainScreen() {
  const [selectedButton, setSelectedButton] = useState('Hoy');
  const [usuario, setUsuario] = useState(null);
  const [recetasDeHoy, setRecetasDeHoy] = useState([]);
  const [recetasDeMañana, setRecetasDeMañana] = useState([]);
  const [recetasSemanales, setRecetasSemanales] = useState([]);
  const [totalCalorias, setTotalCalorias] = useState(0);

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

  const fetchRecetasPorDia = async (offset) => {
    const targetDay = (new Date().getDay() + offset) % 7;
    const planDelDia = usuario?.planes_alimentacion.find((plan) => plan.dia === targetDay);

    if (!planDelDia) return [];

    const tiposDeComida = ['Desayuno', 'Almuerzo', 'Cena', 'Snacks'];
    let idsRecetas = [];

    tiposDeComida.forEach((tipo) => {
      if (planDelDia.comidas[tipo]) {
        const ids = planDelDia.comidas[tipo].map((receta) => receta.id);
        idsRecetas = idsRecetas.concat(ids);
      }
    });

    idsRecetas = [...new Set(idsRecetas)];
    const recetasCompletas = await obtenerRecetasPorIds(idsRecetas);
    return recetasCompletas;
  };

  useEffect(() => {
    const cargarRecetasIniciales = async () => {
      if (usuario) {
        const recetasHoy = await fetchRecetasPorDia(0);
        setRecetasDeHoy(recetasHoy);
        const totalCal = recetasHoy.reduce(
          (sum, receta) => sum + (parseFloat(receta.nutricion?.calories) || 0),
          0
        );
        setTotalCalorias(totalCal);
        fetchRecetasPorDia(1).then(setRecetasDeMañana);
        fetchRecetasSemanales();
      }
    };

    cargarRecetasIniciales();
  }, [usuario]);

  const fetchRecetasSemanales = async () => {
    try {
      const recetasPorDia = await Promise.all(
        Array.from({ length: 7 }, (_, i) => fetchRecetasPorDia(i))
      );
      setRecetasSemanales(recetasPorDia);
    } catch (error) {
      console.error('Error al obtener las recetas semanales:', error);
    }
  };

  const handleButtonPress = (button) => setSelectedButton(button);

  return (
    <View style={styles.container}>
      <HeaderSections dia={getDayName(selectedButton === 'Mañana' ? 1 : 0)} calorias={totalCalorias} />
      <PlanSelector selectedButton={selectedButton} onButtonPress={handleButtonPress} />
      {selectedButton === 'Semanal' ? (
        <View style={styles.section7}>
          <WeeklyView planes={recetasSemanales} />
        </View>
      ) : (
        <Secciones56 recetas={selectedButton === 'Hoy' ? recetasDeHoy : recetasDeMañana} />
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
    backgroundColor: '#F5F5F5',
  },
});
