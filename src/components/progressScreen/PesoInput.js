import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { guardarProgreso } from '../../services/progressService';


const PesoInput = ({ onSubmit, onClose }) => {
    const [peso, setPeso] = useState('');

    const handlePress = async () => {
        if (!peso || isNaN(peso)) {
            Alert.alert('Error', 'Por favor, ingresa un peso válido');
        } else {
            try {
                // Obtener el usuarioId del AsyncStorage
                const usuarioId = await AsyncStorage.getItem('usuarioId');
                if (!usuarioId) {
                    Alert.alert('Error', 'No se ha encontrado el usuario');
                    return;
                }

                // Llamar a la función para registrar el progreso
                await guardarProgreso(peso, usuarioId);

                // Mostrar un mensaje de éxito
                Alert.alert('Registro exitoso', `Peso registrado: ${peso} kg`);
                
                // Llamar a la función onSubmit
                onSubmit(peso);
                setPeso(''); // Limpiar el campo de peso

            } catch (error) {
                console.error('Error al registrar el progreso:', error);
                Alert.alert('Error', 'Hubo un problema al registrar tu peso');
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
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={styles.buttonText}>Registrar</Text>
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
        width: '80%',
        elevation: 5,
        marginTop: 20,
        alignSelf: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 18,
        marginBottom: 20,
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#9f9795',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default PesoInput;
