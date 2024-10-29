import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderSections from '../components/HeaderSections';
import PlanSelector from '../components/PlanSelector';
import { obtenerUsuario } from '../services/usuarioService';
import { obtenerRecetasPorIds } from '../services/recetaService';
import Secciones56 from '../components/RecipesPlan';
import WeeklyView from '../components/WeeklyView';

const USER_ID = 'Orr9MfPRuoZz44h7ElGl';

const getDayName = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('es-ES', { weekday: 'long' });
};

const getCurrentDayIndex = () => {
  const date = new Date();
  const day = date.getDay();
  const index = (day + 6) % 7;
  return index;
};

export default function MainScreen() {
  const [selectedButton, setSelectedButton] = useState('Hoy');
  const [usuario, setUsuario] = useState(null);
  const [recetasDeHoy, setRecetasDeHoy] = useState([]);
  const [recetasDeMañana, setRecetasDeMañana] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [recetasCompletas, setRecetasCompletas] = useState([]);
  const [totalCalorias, setTotalCalorias] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const datosUsuario = await obtenerUsuario(USER_ID);
        if (datosUsuario) {
          setUsuario(datosUsuario);
          setPlanes(datosUsuario.planes_alimentacion);
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchRecetasPorDia = async (offset) => {
    const currentDay = new Date().getDay();
    const targetDay = (currentDay + offset) % 7;

    const diaPlan = targetDay === 0 ? 7 : targetDay;

    const planDelDia = usuario?.planes_alimentacion.find((plan) => plan.dia === diaPlan);

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

        const recetasMañana = await fetchRecetasPorDia(1);
        setRecetasDeMañana(recetasMañana);

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
      const recetasPlanificadas = recetasPorDia.flat();

      setRecetasCompletas(recetasPlanificadas);
    } catch (error) {
      console.error('Error al obtener las recetas semanales:', error);
    }
  };

  const handleButtonPress = (button) => setSelectedButton(button);

  useEffect(() => {
    let recetasSeleccionadas = [];

    if (selectedButton === 'Hoy') {
      recetasSeleccionadas = recetasDeHoy;
    } else if (selectedButton === 'Mañana') {
      recetasSeleccionadas = recetasDeMañana;
    } else {
      recetasSeleccionadas = recetasDeHoy;
    }

    const totalCal = recetasSeleccionadas.reduce(
      (sum, receta) => sum + (parseFloat(receta.nutricion?.calories) || 0),
      0
    );
    setTotalCalorias(totalCal);
  }, [selectedButton, recetasDeHoy, recetasDeMañana]);

  return (
    <View style={styles.container}>
      <HeaderSections dia={getDayName(selectedButton === 'Mañana' ? 1 : 0)} calorias={totalCalorias} />
      <PlanSelector selectedButton={selectedButton} onButtonPress={handleButtonPress} />
      {selectedButton === 'Semanal' ? (
        <View style={styles.section7}>
          <WeeklyView 
            planes={planes} 
            recetasCompletas={recetasCompletas} 
            currentDay={getCurrentDayIndex()}
          />
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
