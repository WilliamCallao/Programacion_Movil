// src/services/recetasService.js

const archivosRecetas = {
    'desayuno_recetas.json': require('../../assets/recetas/desayuno_recetas.json'),
    'almuerzo_recetas.json': require('../../assets/recetas/almuerzo_recetas.json'),
    'cena_recetas.json': require('../../assets/recetas/cena_recetas.json'),
    'snacks_recetas.json': require('../../assets/recetas/snacks_recetas.json'),
  };
  
  export const cargarRecetas = async (nombreArchivo) => {
    try {
      if (!archivosRecetas[nombreArchivo]) {
        throw new Error(`Archivo ${nombreArchivo} no encontrado`);
      }
      const recetas = archivosRecetas[nombreArchivo];
    //   console.log(`Recetas cargadas desde ${nombreArchivo}:`, recetas.length);  
      return recetas;
    } catch (error) {
      console.error(`Error al cargar ${nombreArchivo}:`, error);
      return [];
    }
  };
  