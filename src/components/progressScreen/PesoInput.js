import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { guardarProgreso } from '../../services/progressService';

const PesoInput = ({ onSubmit, onClose }) => {
    const [peso, setPeso] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mensajes de error
    const [successMessage, setSuccessMessage] = useState(''); // Estado para mensajes de éxito

    const handlePress = async () => {
        // Resetear mensajes anteriores
        setErrorMessage('');
        setSuccessMessage('');

        if (!peso || isNaN(peso)) {
            setErrorMessage('Por favor, ingresa un peso válido');
            return;
        } else {
            try {
                setIsLoading(true); // Iniciar la carga

                // Obtener el usuarioId del AsyncStorage
                const usuarioId = await AsyncStorage.getItem('usuarioId');
                if (!usuarioId) {
                    setErrorMessage('No se ha encontrado el usuario');
                    setIsLoading(false);
                    return;
                }

                // Llamar a la función para registrar el progreso
                await guardarProgreso(peso, usuarioId);

                // Mostrar un mensaje de éxito
                setSuccessMessage(`Peso registrado: ${peso} kg`);

                // Llamar a la función onSubmit
                onSubmit(peso);
                setPeso(''); // Limpiar el campo de peso

                setIsLoading(false); // Terminar la carga

            } catch (error) {
                console.error('Error al registrar el progreso:', error);
                setErrorMessage('Hubo un problema al registrar tu peso');
                setIsLoading(false); // Terminar la carga
            }
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.label}>Ingresa tu peso (kg):</Text>
            <TextInput
                style={styles.input}
                placeholder="Ej. 70"
                keyboardType="numeric"
                value={peso}
                onChangeText={setPeso}
            />

            {/* Mostrar mensajes de error o éxito */}
            {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
            {successMessage !== '' && <Text style={styles.successText}>{successMessage}</Text>}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose} disabled={isLoading}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handlePress}
                    disabled={isLoading} // Deshabilitar el botón mientras carga
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Registrar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%', // Más ancho y centrado
        elevation: 5,
        marginTop: 20,
        alignSelf: 'center', // Centra el contenedor en la pantalla
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
        fontWeight: 'bold',
    },
    input: {
        width: '100%', // Ocupa todo el ancho del card
        height: 60, // Más alto
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 18,
        marginBottom: 20,
        backgroundColor: '#fff',
        textAlign: 'center', // Centrar texto en el input
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10, // Espacio entre botones
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        minWidth: 100,
    },
    closeButton: {
        backgroundColor: '#9f9795',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        minWidth: 100,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#555', // Cambiar el color del botón cuando está deshabilitado
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    successText: {
        color: 'green',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default PesoInput;
