import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { obtenerUltimoProgreso, obtenerPesoYFechaDeCreacion, obtenerPesoActual } from '../../services/progressService';

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
    
                // Obtener peso inicial y objetivo
                const { pesoInicial, pesoObjetivo } = await obtenerPesoYFechaDeCreacion(usuarioId);
                setPesoInicial(Number.isFinite(pesoInicial) ? parseFloat(pesoInicial.toFixed(2)) : null);
                setPesoObjetivo(Number.isFinite(pesoObjetivo) ? parseFloat(pesoObjetivo.toFixed(2)) : null);
    
                // Obtener peso actual desde medidas_fisicas.peso_kg
                const pesoDesdeMedidas = await obtenerPesoActual(usuarioId);
                if (Number.isFinite(pesoDesdeMedidas)) {
                    setPesoActual(parseFloat(pesoDesdeMedidas.toFixed(2)));
                } else {
                    // Fallback: Obtener el último progreso si no existe peso en medidas_fisicas
                    const ultimoPeso = await obtenerUltimoProgreso(usuarioId);
                    if (ultimoPeso && Number.isFinite(ultimoPeso.peso)) {
                        setPesoActual(parseFloat(ultimoPeso.peso.toFixed(2)));
                    } else {
                        console.warn("No se encontró peso válido en ninguna fuente.");
                        setPesoActual(null);
                    }
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
            setDiferenciaPeso((pesoActual - pesoInicial).toFixed(2));
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
                            {diferenciaPeso > 0 ? `+${diferenciaPeso} kg` : `${diferenciaPeso} kg`}
                        </Text>
                        <Text style={styles.arrow}>
                            {diferenciaPeso > 0 ? '▲' : '▼'}
                        </Text>
                        <Text style={styles.date}>{fechaCambio}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.peso}>
                {cargando ? 'Cargando...' : pesoActual !== null ? `${pesoActual} kg` : 'N/A'}
            </Text>
            <View style={styles.extraInfo}>
                <View style={styles.infoRow}>
                    <Ionicons name="walk-outline" size={18} color="#555" />
                    <Text style={styles.extraText}>
                        Inicial: {cargando ? 'Cargando...' : pesoInicial !== null ? `${pesoInicial} kg` : 'N/A'}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="flag-checkered" size={18} color="#555" />
                    <Text style={styles.extraText}>
                        Objetivo: {cargando ? 'Cargando...' : pesoObjetivo !== null ? `${pesoObjetivo} kg` : 'N/A'}
                    </Text>
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
