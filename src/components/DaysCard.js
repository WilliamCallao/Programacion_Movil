import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import CookingImage from './cooking.png'; // Asegúrate de reemplazar con el nombre correcto del archivo

const DiasCocinandoCard = () => {
    const [diasCocinando, setDiasCocinando] = useState(0);

    useEffect(() => {
        const db = getDatabase();
        const diasRef = ref(db, 'diasCocinando'); // Cambia 'diasCocinando' por la referencia adecuada en tu Firebase
        const unsubscribe = onValue(diasRef, (snapshot) => {
            const data = snapshot.val();
            setDiasCocinando(data || 0); // Asegura que siempre haya un valor numérico
        });

        return () => unsubscribe(); // Limpia el listener al desmontar el componente
    }, []);

    return (
        <View style={styles.card}>
            <View style={styles.leftContainer}>
                <Text style={styles.number}>{diasCocinando}</Text>
                <Text style={styles.text}>Días cocinando</Text>
            </View>
            <Image
                source={CookingImage}
                style={styles.image}
            />
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#ddd',
        padding: 20,
        width: width - 32, // Margen horizontal de 16px en el contenedor
        alignSelf: 'center',
        marginVertical: 8, // Separación entre tarjetas
    },
    leftContainer: {
        flex: 1,
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
    },
});

export default DiasCocinandoCard;
