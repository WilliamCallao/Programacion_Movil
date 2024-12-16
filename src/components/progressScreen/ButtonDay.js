// components/progressScreen/ButtonDay.js
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guardarDiaRealizado } from '../../services/progressService';
import { RefreshContext } from '../../contexts/RefreshContext'; // Importa el contexto

const ButtonRecetaRealizada = () => { // No recibe props
    const [usuarioId, setUsuarioId] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mensajes de error
    const [successMessage, setSuccessMessage] = useState(''); // Estado para mensajes de éxito
    const { triggerRefresh } = useContext(RefreshContext); // Obtiene la función del contexto

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
        // Resetear mensajes anteriores
        setErrorMessage('');
        setSuccessMessage('');

        if (!usuarioId) {
            setErrorMessage('No se ha encontrado el usuario.');
            return;
        }

        try {
            setIsLoading(true); // Iniciar la carga

            await guardarDiaRealizado(usuarioId);

            // Mostrar un mensaje de éxito
            setSuccessMessage('Día de cocina registrado');

            // Disparar el refresco
            triggerRefresh();

            setIsLoading(false); // Terminar la carga

        } catch (error) {
            console.error('Error al guardar el día realizado:', error);
            setErrorMessage('Hubo un problema al registrar el día de cocina.');
            setIsLoading(false); // Terminar la carga
        }
    };

    return (
        <View style={styles.container}>
            {/* Mostrar mensajes de error o éxito */}
            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            {successMessage ? (
                <Text style={styles.successText}>{successMessage}</Text>
            ) : null}

            <TouchableOpacity 
                onPress={handlePress} 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                disabled={isLoading} // Deshabilitar botón mientras carga
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <View style={styles.buttonContent}>
                        <MaterialCommunityIcons
                            name="check-circle-outline"
                            size={30}
                            color="#fff"
                            style={styles.icon}
                        />
                        <Text style={styles.buttonText}>Receta Realizada</Text>
                    </View>
                )}
            </TouchableOpacity>
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
    borderRadius: 25,
    backgroundColor: '#000',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
  buttonDisabled: {
    backgroundColor: '#555', // Cambiar color cuando está deshabilitado
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

export default ButtonRecetaRealizada;
