import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';

const PesoInput =({onSubmit, onClose}) => {
    const [peso, setPeso] = useState('');

    const handlePress = () => {
        if (!peso || isNaN(peso)){
            Alert.alert('Error', 'Por favor, ingresa un peso válido');
        }else {
            Alert.alert('Registro exitoso', `Peso registrado: ${peso} kg`);
            onSubmit(peso);
            setPeso('');
            onClose();
            
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Ingresa tu peso (kg):</Text>
            <TextInput
                style={styles.input}
                placeholder="Ej. 70"
                keyboardType="numeric"
                value={peso}
                onChangeText={setPeso}
            />
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>Registrar Peso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    input: {
        width: '80%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#6200ea',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    closeButton:{
        backgroundColor: '#e53935'
    },
    buttonText: {
        color: '#fff', 
        fontSize: 16,
    },
});

export default PesoInput;