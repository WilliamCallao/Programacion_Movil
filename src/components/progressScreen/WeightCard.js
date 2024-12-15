import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { obtenerUltimoProgreso, obtenerPesoYFechaDeCreacion } from '../../services/progressService';

const PesoActualCard = () => {
    const [pesoActual, setPesoActual] = useState(null);
    const [pesoInicial, setPesoInicial] = useState(null);
    const [pesoObjetivo, setPesoObjetivo] = useState(null);
    const [diferenciaPeso, setDiferenciaPeso] = useState(null);
    const [cargando, setCargando] = useState(true);
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
        const fetchPeso = async () => {
            try {
                if (!usuarioId) {
                    console.error("UsuarioId no definido");
                    setCargando(false);
                    return;
                }

                const { pesoInicial, pesoObjetivo } = await obtenerPesoYFechaDeCreacion(usuarioId);
                if (pesoInicial !== null && !isNaN(pesoInicial)) {
                    setPesoInicial(pesoInicial);
                }
                if (pesoObjetivo !== null && !isNaN(pesoObjetivo)) {
                    setPesoObjetivo(pesoObjetivo);
                }

                const ultimoPeso = await obtenerUltimoProgreso(usuarioId);
                if (ultimoPeso && ultimoPeso.peso !== undefined) {
                    setPesoActual(ultimoPeso.peso);
                } else {
                    console.warn("No se encontró progreso o falta el campo 'peso'.");
                    setPesoActual(pesoInicial);
                }
            } catch (error) {
                console.error("Error al obtener los datos de peso:", error);
            } finally {
                setCargando(false);
            }
        };

        if (usuarioId) {
            fetchPeso();
        }
    }, [usuarioId]);

    useEffect(() => {
        if (pesoInicial !== null && pesoActual !== null) {
            setDiferenciaPeso(pesoActual - pesoInicial);
        }
    }, [pesoActual, pesoInicial]);

    const fechaCambio = new Date().toLocaleDateString();

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Peso Actual</Text>
                {diferenciaPeso !== null && diferenciaPeso !== 0 && (
                    <View
                        style={[
                            styles.differenceContainer,
                            diferenciaPeso > 0 ? styles.positive : styles.negative,
                        ]}
                    >
                        <Text style={styles.differenceText}>
                            {diferenciaPeso > 0 ? `+${diferenciaPeso.toFixed(1)} kg` : `${diferenciaPeso.toFixed(1)} kg`}
                        </Text>
                        <Text style={styles.arrow}>
                            {diferenciaPeso > 0 ? '▲' : '▼'}
                        </Text>
                        <Text style={styles.date}>{fechaCambio}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.peso}>{cargando ? 'Cargando...' : `${pesoActual} kg`}</Text>
            <View style={styles.extraInfo}>
                <View style={styles.infoRow}>
                    <Ionicons name="walk-outline" size={18} color="#555" />
                    <Text style={styles.extraText}>Inicial: {pesoInicial ? `${pesoInicial} kg` : 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="flag-checkered" size={18} color="#555" />
                    <Text style={styles.extraText}>Objetivo: {pesoObjetivo ? `${pesoObjetivo} kg` : 'N/A'}</Text>
                </View>
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f2f2f2',
        padding: 20,
        width: width - 32,
        alignSelf: 'center',
        marginVertical: 8,
        position: 'relative',
        borderRadius: 8,
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
        borderRadius: 5,
    },
    positive: {
        backgroundColor: '#a2f7f8',
    },
    negative: {
        backgroundColor: '#f8efa2',
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
    extraInfo: {
        marginTop: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    extraText: {
        fontSize: 16,
        color: '#555',
        marginLeft: 8,
    },
});

export default PesoActualCard;
