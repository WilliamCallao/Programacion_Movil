import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerDiasCocinados } from '../../services/progressService';

const CalendarProgress = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const fetchUsuarioId = async () => {
      try {
        const id = await AsyncStorage.getItem('usuarioId');
        if (id) {
          setUsuarioId(id);
        } else {
          console.error("No se encontró el 'usuarioId' en el almacenamiento local.");
        }
      } catch (error) {
        console.error("Error al obtener el 'usuarioId':", error);
      }
    };

    fetchUsuarioId();
  }, []);

  useEffect(() => {
    const cargarDiasCocinados = async () => {
      if (!usuarioId) {
        console.warn("El 'usuarioId' no está definido. No se puede cargar días cocinados.");
        return;
      }

      try {
        const diasCocinados = await obtenerDiasCocinados(usuarioId);

        // Procesar las fechas consecutivas
        const fechasMarcadas = procesarRangos(diasCocinados);

        setMarkedDates(fechasMarcadas);
      } catch (error) {
        console.error("Error al cargar los días cocinados:", error);
      }
    };

    cargarDiasCocinados();
  }, [usuarioId]);

  // Función para procesar rangos de fechas consecutivas
  const procesarRangos = (fechas) => {
    if (!fechas || fechas.length === 0) return {};
  
    fechas.sort(); // Asegúrate de que las fechas estén en orden ascendente
  
    const marcados = {};
    let inicio = fechas[0];
    let fin = fechas[0];
  
    for (let i = 1; i < fechas.length; i++) {
      const fechaActual = new Date(fechas[i]);
      const fechaAnterior = new Date(fechas[i - 1]);
  
      // Verificar si la fecha actual es consecutiva a la anterior
      if ((fechaActual - fechaAnterior) / (1000 * 60 * 60 * 24) === 1) {
        fin = fechas[i]; // Extender el rango
      } else {
        // Marcar todos los días entre el inicio y el fin de la racha
        let tempFecha = new Date(inicio);
        while (tempFecha <= new Date(fin)) {
          const fechaStr = tempFecha.toISOString().split('T')[0]; // Convertir fecha a formato YYYY-MM-DD
          marcados[fechaStr] = { color: '#f4a020', textColor: 'white' };
          tempFecha.setDate(tempFecha.getDate() + 1); // Sumar un día
        }
  
        // Registrar el siguiente rango
        inicio = fechas[i];
        fin = fechas[i];
      }
    }
  
    // Marcar la última racha
    let tempFecha = new Date(inicio);
    while (tempFecha <= new Date(fin)) {
      const fechaStr = tempFecha.toISOString().split('T')[0]; // Convertir fecha a formato YYYY-MM-DD
      marcados[fechaStr] = { color: '#f4a020', textColor: 'white' };
      tempFecha.setDate(tempFecha.getDate() + 1); // Sumar un día
    }
  
    return marcados;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario de días saludables</Text>
      <View style={styles.calendarWrapper}>
        <Calendar
          markedDates={markedDates}
          markingType="period" // Tipo de marcado para unir fechas consecutivas
          theme={{
            selectedDayBackgroundColor: '#f4a020',
            todayTextColor: '#f4a020',
            arrowColor: '#f4a020',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendarWrapper: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 20,
  },
});

export default CalendarProgress;
