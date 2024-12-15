import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { obtenerDatosProgreso } from '../../services/progressService'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeightChart = () => {
  const [data, setData] = useState({
    labels: ['Cargando...'],
    datasets: [{ data: [0] }],
  });
  const [usuarioId, setUsuarioId] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null); // Estado para el punto seleccionado

  // Función para recuperar el usuarioId desde AsyncStorage
  const obtenerUsuarioId = async () => {
    try {
      const storedUsuarioId = await AsyncStorage.getItem('usuarioId');
      if (storedUsuarioId !== null) {
        setUsuarioId(storedUsuarioId); // Establecer el usuarioId en el estado
      } else {
        console.log('No se encontró el usuarioId en el almacenamiento');
      }
    } catch (error) {
      console.error('Error al obtener el usuarioId de AsyncStorage:', error);
    }
  };

  useEffect(() => {
    obtenerUsuarioId(); // Recuperar el usuarioId cuando el componente se monta
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      if (usuarioId) {
        const datosReales = await obtenerDatosProgreso(usuarioId);
        setData(datosReales); // Actualiza el estado con los datos
      }
    };

    cargarDatos(); // Cargar los datos de progreso cuando el usuarioId esté disponible
  }, [usuarioId]);

  // Función para manejar el clic en un punto del gráfico
  const handleDataPointClick = (dataPoint) => {
    const date = data.labels[dataPoint.index]; // Obtener la fecha usando el índice del punto
    setSelectedPoint({
      weight: dataPoint.value,
      date: date,
    }); // Guardar peso y fecha del punto seleccionado
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Gráfica de Peso</Text>
        <ScrollView horizontal={true} style={styles.scrollContainer}>
          <LineChart
            data={data}
            width={1000} // Ancho más grande para que se pueda desplazar
            height={220} // Alto ajustado
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1, // Decimales para los valores del eje Y
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Color de las etiquetas
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color de las etiquetas del gráfico
              style: {
                borderRadius: 0, // Elimina el redondeo de los bordes
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ffa726', // Color del borde de los puntos
              },
            }}
            style={styles.chart}
            onDataPointClick={(e) => handleDataPointClick(e)} // Maneja el clic en un punto
          />
        </ScrollView>

        {/* Mostrar el peso y la fecha del punto seleccionado */}
        {selectedPoint && (
          <View style={styles.details}>
            <Text style={styles.detailsText}>Peso: {selectedPoint.weight} kg</Text>
            <Text style={styles.detailsText}>Fecha: {selectedPoint.date}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  card: {
    backgroundColor: '#f2f2f2',
    marginVertical: 10,
    padding: 20,
    width: '100%',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  chart: {
    marginVertical: 8,
  },
  details: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  detailsText: {
    fontSize: 16,
    color: '#333',
  },
});

export default WeightChart;
