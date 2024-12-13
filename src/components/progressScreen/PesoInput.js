import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';

const PesoInput = ({ onSubmit, onClose, visible }) => {
    const [peso, setPeso] = useState('');

    const handlePress = () => {
        if (!peso || isNaN(peso)) {
            Alert.alert('Error', 'Por favor, ingresa un peso válido');
        } else {
            Alert.alert('Registro exitoso', `Peso registrado: ${peso} kg`);
            onSubmit(peso);
            setPeso('');
            onClose();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
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
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        elevation: 5, // Sombra para un diseño limpio
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
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Centrar horizontalmente
        alignItems: 'center', // Centrar verticalmente (si aplica)
        gap: 10, // Espaciado entre los botones
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
