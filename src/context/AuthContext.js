// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          const userId = currentUser.uid;
          try {
            const registroCompleto = await AsyncStorage.getItem('isRegistered');
            setIsRegistered(registroCompleto === 'true');
          } catch (error) {
            console.error('Error al obtener isRegistered:', error);
            setIsRegistered(false);
          }
        } else {
          setUser(null);
          setIsRegistered(false);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    };

    checkAuth();
  }, []);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setIsRegistered(false);
    await AsyncStorage.removeItem('isRegistered');
  };

  const completeRegistration = async () => {
    setIsRegistered(true);
    await AsyncStorage.setItem('isRegistered', 'true');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isRegistered,
      loading,
      logout,
      completeRegistration,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
