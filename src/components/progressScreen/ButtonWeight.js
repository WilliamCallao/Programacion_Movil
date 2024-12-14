import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importar los iconos de MaterialCommunityIcons
import PesoInput from './PesoInput';

const ButtonWeight = () => {
    const [showInput, setShowInput] = useState(false); // Estado para mostrar el campo de entrada

    const handlePesoSubmit = (peso) => {
        console.log(`Peso registrado: ${peso} kg`);
        setShowInput(false); // Ocultar el campo de entrada después de registrar el peso
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setShowInput(true)} style={styles.button}>
                <View style={styles.buttonContent}>
                    <MaterialCommunityIcons
                        name="weight-kilogram" // Usar el icono de MaterialCommunityIcons
                        size={30}
                        color="#fff" // Color dorado
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>Nuevo registro de peso</Text>
                </View>
            </TouchableOpacity>

            {/* Mostrar el campo de entrada solo cuando showInput sea true */}
            {showInput && (
                <PesoInput
                    onSubmit={handlePesoSubmit}
                    onClose={() => setShowInput(false)} // Función para cerrar el campo de entrada
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
