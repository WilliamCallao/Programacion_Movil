import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const WeightChart = () => {
  const staticData = {
    labels: ['Ene 01', 'Ene 02', 'Ene 03', 'Ene 04', 'Ene 05'], // Formato de fecha sin el año
    datasets: [
      {
        data: [70, 71, 72, 70.5, 71],
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Color de la línea
      },
    ],
  };

  const [data, setData] = useState(staticData);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const handleDataPointClick = (data) => {
    // Al hacer click en un punto, se actualizará el estado con los datos
    setSelectedPoint(data);
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
            onDataPointClick={handleDataPointClick} // Evento para manejar el clic
          />
        </ScrollView>

        {selectedPoint && (
          <View style={styles.selectedPointContainer}>
            <Text style={styles.selectedPointTitle}>Datos:</Text>
            <Text style={styles.selectedPointText}>
              Fecha: {data.labels[selectedPoint.index]}{' '}
            </Text>
            <Text style={styles.selectedPointText}>
              Peso: {selectedPoint.value} kg
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  card: {
    backgroundColor: '#f2f2f2',
    marginVertical: 10,
    padding: 20,
    width: '100%', // Asegura que el contenedor ocupe todo el ancho de la pantalla
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1, // Asegura que el contenedor ocupe todo el espacio disponible
  },
  chart: {
    marginVertical: 8,
  },
  selectedPointContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  selectedPointTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedPointText: {
    fontSize: 16,
  },
});

export default WeightChart;
