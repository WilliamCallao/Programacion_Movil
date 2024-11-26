import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const PesoActualCard = () =>{
    const [pesoActual, setPesoActual] = useState(70);
    const [pesoAnterior, setPesoAnterior] = useState(null);

    const handleActualizarPeso = (nuevoPeso) => {
        setPesoAnterior(pesoActual);
        setPesoActual(nuevoPeso);
    };

    const diferencia = pesoAnterior !==null ? pesoActual - pesoAnterior : null;
    const fechaCambio = new Date().toLocaleDateString();

    return (
        <View style={style.card}>
            <View style={style.header}>
                <Text style={style.title}>Peso Actual</Text>
                {diferencia !== null && diferencia !== 0 && (
                    <View
                        style={[
                            style.differenceContainer,
                            diferencia > 0 ? style.positive : style.negative,
                        ]}
                    >
                        <Text style={style.differenceText}>
                            {diferencia > 0 ? `+${diferencia.toFixed(1)} kg` : `${diferencia.toFixed(1)} kg`}
                        </Text>
                        <Text style={style.arrow}>
                            {diferencia> 0 ? '▲' : '▼'}
                        </Text>
                        <Text style={style.date}>{fechaCambio}</Text>
                    </View>
                )}                
            </View>
            <Text style={style.peso}>{pesoActual} kg</Text>
        </View>
    );
};

const style = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 5,
      margin: 20,
      position: 'relative',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    peso: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#333',
      marginTop: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#6200ea',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    differenceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 5,
      padding: 5,
      paddingHorizontal: 10,
      position: 'absolute',
      top: -10,
      right: -10,
    },
    positive: {
      backgroundColor: '#ffebee', 
    },
    negative: {
      backgroundColor: '#e8f5e9', 
    },
    differenceText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    arrow: {
      fontSize: 18,
      marginLeft: 5,
    },
    date: {
      fontSize: 12,
      marginLeft: 5,
      color: '#666',
    },
  });
  
export default PesoActualCard;