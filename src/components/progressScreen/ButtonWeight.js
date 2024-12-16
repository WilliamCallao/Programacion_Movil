// components/progressScreen/ButtonWeight.js
import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PesoInput from './PesoInput';
import { RefreshContext } from '../../contexts/RefreshContext'; // Importa el contexto

const ButtonWeight = () => { // No recibe props
    const [showInput, setShowInput] = useState(false);
    const { triggerRefresh } = useContext(RefreshContext); // Obtiene la función del contexto

    const handlePesoSubmit = (peso) => {
        console.log(`Peso registrado: ${peso} kg`);
        setShowInput(false);
        triggerRefresh(); // Dispara el refresco
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setShowInput(true)} style={styles.button}>
                <View style={styles.buttonContent}>
                    <MaterialCommunityIcons
                        name="weight-kilogram"
                        size={30}
                        color="#fff"
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>Nuevo registro de peso</Text>
                </View>
            </TouchableOpacity>

            {showInput && (
                <PesoInput
                    onSubmit={handlePesoSubmit}
                    onClose={() => setShowInput(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%', // Asegura que ocupe todo el ancho disponible
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25, // Borde más redondeado
        backgroundColor: '#000', // Fondo negro
        width: '100%', // Ocupa todo el ancho
        alignItems: 'center', // Centra los elementos dentro del botón
    },
    buttonContent: {
        flexDirection: 'row',
        justifyContent: 'center', // Centra los elementos (icono y texto)
        alignItems: 'center', // Centra el icono y el texto verticalmente
    },
    icon: {
        marginRight: 10, // Espacio entre el icono y el texto
    },
    buttonText: {
        fontSize: 16,
        color: '#fff', // Texto blanco
        textAlign: 'center',
    },
});

export default ButtonWeight;
