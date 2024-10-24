// src/services/recetaService.js
import recetas from './recetas.json';  // Importamos el JSON

/**
 * Obtener múltiples recetas por un arreglo de IDs.
 * @param {string[]} recetaIds - Arreglo de IDs de recetas.
 * @returns {Promise<Object[]>} - Promesa que resuelve a un arreglo de objetos de recetas.
 */
export const obtenerRecetasPorIds = async (recetaIds) => {
  try {
    const recetasEncontradas = recetaIds
      .map((id) => obtenerRecetaPorId(id))
      .filter((receta) => receta !== null);  // Filtramos las que no se encuentran

    return recetasEncontradas;
  } catch (error) {
    console.error('Error al obtener las recetas:', error);
    throw error;
  }
};

/**
 * Obtener una sola receta por su ID.
 * @param {string} recetaId - ID de la receta.
 * @returns {Object|null} - La receta si existe, o null si no se encuentra.
 */
export const obtenerRecetaPorId = (recetaId) => {
  const receta = recetas[recetaId];  // Accedemos a la receta directamente del JSON
  if (receta) {
    return { id: recetaId, ...receta };
  } else {
    console.warn(`No se encontró la receta con ID: ${recetaId}`);
    return null;
  }
};
