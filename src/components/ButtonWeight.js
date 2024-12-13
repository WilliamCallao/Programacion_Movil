import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importar los iconos de MaterialCommunityIcons
import PesoInput from './PesoInput';

const ButtonWeight = () => {

    const [modalVisible, setModalVisible] = useState(false);

    const handlePesoSubmit = (peso) => {
        console.log(`Peso registrado: ${peso} kg`);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <PesoInput
                        onSubmit={handlePesoSubmit}
                        onClose={() => setModalVisible(false)} // Pasar función de cierre
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
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
