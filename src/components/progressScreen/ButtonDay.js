import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guardarDiaRealizado } from '../../services/progressService';

const ButtonRecetaRealizada = () => {
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

    const handlePress = async () => {
        await guardarDiaRealizado(usuarioId);
        Alert.alert(null, `Día de cocina registrado`);
    };

    return (
        <View style={styles.container}>
        <TouchableOpacity onPress={handlePress} style={styles.button}>
            <View style={styles.buttonContent}>
            <MaterialCommunityIcons
                name="check-circle-outline"
                size={30}
                color="#fff"
                style={styles.icon}
            />
            <Text style={styles.buttonText}>Receta Realizada</Text>
            </View>
        </TouchableOpacity>
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
    borderRadius: 25,
    backgroundColor: '#000',
    width: '100%',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default ButtonRecetaRealizada;
