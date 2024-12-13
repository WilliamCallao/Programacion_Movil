// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase'; // Asegúrate de que la ruta es correcta
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscribirse a los cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Recuperar el estado de registro desde AsyncStorage
        try {
          const registered = await AsyncStorage.getItem('isRegistered');
          setIsRegistered(registered === 'true');
        } catch (error) {
          console.error('Error al obtener isRegistered de AsyncStorage:', error);
          setIsRegistered(false);
        }
      } else {
        setUser(null);
        setIsRegistered(false);
      }
      setLoading(false);
    });

    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setIsRegistered(false);
      await AsyncStorage.removeItem('usuarioId');
      await AsyncStorage.removeItem('isRegistered');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isRegistered,
        setIsRegistered,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
