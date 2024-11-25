import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebase';

const obtenerUsuarioId = async () => {
  try {
    const userId = await AsyncStorage.getItem('usuarioId');
    if (userId) {
      return userId;
    } else {
      console.error('No se encontró el usuarioId en AsyncStorage.');
      throw new Error('Usuario no autenticado.');
    }
  } catch (error) {
    console.error('Error al obtener el usuarioId:', error);
    throw error;
  }
};

export const obtenerFavoritos = async () => {
  try {
    const userId = await obtenerUsuarioId();
    const docRef = doc(db, 'usuarios', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.actividad?.recetas_favoritas || [];
    } else {
      console.log('No se encontró el documento del usuario.');
      return [];
    }
  } catch (error) {
    console.error('Error al obtener los favoritos:', error);
    return [];
  }
};

export const agregarFavorito = async (idReceta) => {
  try {
    const userId = await obtenerUsuarioId();
    const docRef = doc(db, 'usuarios', userId);
    await updateDoc(docRef, {
      'actividad.recetas_favoritas': arrayUnion(idReceta),
    });
    console.log(`Receta con ID ${idReceta} agregada a favoritos.`);
    return true;
  } catch (error) {
    console.error('Error al agregar a favoritos:', error);
    return false;
  }
};

export const quitarFavorito = async (idReceta) => {
  try {
    const userId = await obtenerUsuarioId();
    const docRef = doc(db, 'usuarios', userId);
    await updateDoc(docRef, {
      'actividad.recetas_favoritas': arrayRemove(idReceta),
    });
    console.log(`Receta con ID ${idReceta} eliminada de favoritos.`);
    return true;
  } catch (error) {
    console.error('Error al quitar de favoritos:', error);
    return false;
  }
};

export const isFavorite = async (idReceta) => {
  try {
    const favoritos = await obtenerFavoritos();
    return favoritos.includes(idReceta);
  } catch (error) {
    console.error('Error al verificar si es favorito:', error);
    return false;
  }
};

export const toggleFavorito = async (idReceta) => {
  try {
    const favoritos = await obtenerFavoritos();
    const esFavorito = favoritos.includes(idReceta);

    if (esFavorito) {
      const success = await quitarFavorito(idReceta);
      return { success, favorito: !esFavorito };
    } else {
      const success = await agregarFavorito(idReceta);
      return { success, favorito: !esFavorito };
    }
  } catch (error) {
    console.error('Error al alternar el estado de favorito:', error);
    return { success: false, favorito: null };
  }
};
