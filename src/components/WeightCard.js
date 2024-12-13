import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const PesoActualCard = () => {
    const [pesoActual, setPesoActual] = useState(70);
    const [pesoAnterior, setPesoAnterior] = useState(null);

    const handleActualizarPeso = (nuevoPeso) => {
        setPesoAnterior(pesoActual);
        setPesoActual(nuevoPeso);
    };

    const diferencia = pesoAnterior !== null ? pesoActual - pesoAnterior : null;
    const fechaCambio = new Date().toLocaleDateString();

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Peso Actual</Text>
                {diferencia !== null && diferencia !== 0 && (
                    <View
                        style={[
                            styles.differenceContainer,
                            diferencia > 0 ? styles.positive : styles.negative,
                        ]}
                    >
                        <Text style={styles.differenceText}>
                            {diferencia > 0 ? `+${diferencia.toFixed(1)} kg` : `${diferencia.toFixed(1)} kg`}
                        </Text>
                        <Text style={styles.arrow}>
                            {diferencia > 0 ? '▲' : '▼'}
                        </Text>
                        <Text style={styles.date}>{fechaCambio}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.peso}>{pesoActual} kg</Text>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ddd',
        padding: 20,
        width: width - 32, // Margen horizontal de 16px en el contenedor
        alignSelf: 'center',
        marginVertical: 8, // Separación entre tarjetas
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
    differenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
