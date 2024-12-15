import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookingImage from './cooking.png';
import DietImage from './diet.png'; 
import { obtenerCantidadDiasRegistrados, obtenerMaximoDiasConsecutivos } from '../../services/progressService'; // Importa las funciones

const DiasCocinandoCard = () => {
    const [diasCocinando, setDiasCocinando] = useState(0);
    const [racha, setRacha] = useState(0);
    const [usuarioId, setUsuarioId] = useState(null);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // Obtener el usuarioId (asegúrate de tenerlo en tu almacenamiento o contexto)
                const usuarioId = await AsyncStorage.getItem('usuarioId');
                setUsuarioId(usuarioId);

                if (usuarioId) {
                    // Obtener la cantidad de días cocinando
                    const cantidadDias = await obtenerCantidadDiasRegistrados(usuarioId);
                    setDiasCocinando(cantidadDias);

                    // Obtener el máximo de días consecutivos
                    const maxRacha = await obtenerMaximoDiasConsecutivos(usuarioId);
                    setRacha(maxRacha);
                }
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };

        fetchDatos();
    }, [usuarioId]);

    return (
        <View style={styles.card}>
            {/* Contenedor para los días cocinando */}
            <View style={styles.diasContainer}>
                <View style={styles.leftContainer}>
                    <Text style={styles.number}>{diasCocinando}</Text>
                    <Text style={styles.text}>Días cocinando</Text>
                </View>
                <Image
                    source={CookingImage}
                    style={styles.image}
                />
            </View>

            {/* Contenedor para la mejor racha */}
            <View style={styles.rachaContainer}>
                <View style={styles.leftContainer}>
                    <Text style={styles.number}>{racha}</Text>
                    <Text style={styles.text}>Mejor racha</Text>
                </View>
                <Image
                    source={DietImage}
                    style={styles.image}
                />
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    card: {
        flexDirection: 'column', // Cambiado a 'column' para apilar "Días cocinando" y "Mejor racha"
        backgroundColor: '#f2f2f2',
        padding: 20,
        width: width - 32, // Margen horizontal de 16px en el contenedor
        alignSelf: 'center',
        marginVertical: 8, // Separación entre tarjetas
        justifyContent: 'center', // Centra los elementos verticalmente
        alignItems: 'center', // Centra los elementos horizontalmente
        borderRadius: 8,
    },
    diasContainer: {
        flexDirection: 'row', // Alinea horizontalmente "Días cocinando" y la imagen
        alignItems: 'center', // Centra la imagen con el texto
        marginBottom: 10, // Espacio entre "Días cocinando" y "Mejor racha"
    },
    rachaContainer: {
        flexDirection: 'row', // Alinea horizontalmente "Mejor racha" y la imagen
        alignItems: 'center', // Centra la imagen con el texto
    },
    leftContainer: {
        flexDirection: 'column', // Centra el texto en columna
        alignItems: 'center', // Centra el texto
    },
    number: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
    },
    text: {
        fontSize: 16,
        color: '#666',
    },
    image: {
        width: 60,
        height: 60,
        marginLeft: 120, // Espacio entre la imagen y el texto
    },
});

export default DiasCocinandoCard;