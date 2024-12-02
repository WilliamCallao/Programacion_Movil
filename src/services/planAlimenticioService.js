// src/services/planAlimenticioService.js

import seedrandom from 'seedrandom';
import { cargarRecetas } from './recetasService';

export const generarPlanSemanal = async (metaCalorias, preferencias, seed = Math.random()) => {
  try {
    console.log('Generando plan semanal con meta_calorias:', metaCalorias);
    console.log('Preferencias del usuario:', preferencias);

    const rng = seedrandom(seed);

    const variacion = (rng() - 0.5) * 0.1; // Variación de ±5%
    const distribucion = {
      Desayuno: { min: 0.25 + variacion, max: 0.30 + variacion },
      Almuerzo: { min: 0.35 + variacion, max: 0.40 + variacion },
      Cena:     { min: 0.25 + variacion, max: 0.30 + variacion },
      Snacks:   { min: 0.05 + variacion, max: 0.10 + variacion },
    };

    for (let categoria in distribucion) {
      distribucion[categoria].min = Math.max(0, Math.min(1, distribucion[categoria].min));
      distribucion[categoria].max = Math.max(0, Math.min(1, distribucion[categoria].max));
    }

    const caloriasPorCategoria = {
      Desayuno: {
        min: Math.round(metaCalorias * distribucion.Desayuno.min),
        max: Math.round(metaCalorias * distribucion.Desayuno.max),
      },
      Almuerzo: {
        min: Math.round(metaCalorias * distribucion.Almuerzo.min),
        max: Math.round(metaCalorias * distribucion.Almuerzo.max),
      },
      Cena: {
        min: Math.round(metaCalorias * distribucion.Cena.min),
        max: Math.round(metaCalorias * distribucion.Cena.max),
      },
      Snacks: {
        min: Math.round(metaCalorias * distribucion.Snacks.min),
        max: Math.round(metaCalorias * distribucion.Snacks.max),
      },
    };

    const [desayunos, almuerzos, cenas, snacks] = await Promise.all([
      cargarRecetas('desayuno_recetas.json'),
      cargarRecetas('almuerzo_recetas.json'),
      cargarRecetas('cena_recetas.json'),
      cargarRecetas('snacks_recetas.json'),
    ]);

    if (!desayunos.length || !almuerzos.length || !cenas.length || !snacks.length) {
      throw new Error('No hay suficientes recetas en una o más categorías.');
    }

    shuffleArray(desayunos, rng);
    shuffleArray(almuerzos, rng);
    shuffleArray(cenas, rng);
    shuffleArray(snacks, rng);

    const usados = {
      Desayuno: {},
      Almuerzo: {},
      Cena: {},
      Snacks: {},
    };

    const maxRecetasPorCategoria = 2;
    const maxRepeticiones = 2;

    const planSemanal = [];
    const startDay = Math.floor(rng() * 7);

    for (let i = 0; i < 7; i++) {
      const dia = (startDay + i) % 7 + 1;
      const planDiario = {};
      let totalCaloriasDia = 0;

      console.log(`Día ${dia}:`);
      const categorias = ['Desayuno', 'Almuerzo', 'Cena', 'Snacks'];
      for (let categoria of categorias) {
        const { min, max } = caloriasPorCategoria[categoria];
        let recetasDisponibles;

        switch (categoria) {
          case 'Desayuno':
            recetasDisponibles = desayunos;
            break;
          case 'Almuerzo':
            recetasDisponibles = almuerzos;
            break;
          case 'Cena':
            recetasDisponibles = cenas;
            break;
          case 'Snacks':
            recetasDisponibles = snacks;
            break;
        }

        shuffleArray(recetasDisponibles, rng);

        const recetasFiltradas = recetasDisponibles.filter(receta => {
          const dietas = preferencias.preferencias_dietarias || [];
          const condiciones = preferencias.condiciones_salud || [];
          const cumpleDietas = dietas.every(dieta => receta[dieta.toLowerCase()] === 1);
          const cumpleCondiciones = condiciones.every(condicion => receta[condicion.toLowerCase()] === 1);

          return cumpleDietas && cumpleCondiciones;
        });

        let recetasSeleccionadas = [];
        let caloriasActuales = 0;

        for (let intento = 0; intento < recetasFiltradas.length && recetasSeleccionadas.length < maxRecetasPorCategoria; intento++) {
          const receta = recetasFiltradas[intento];

          if ((caloriasActuales + receta.calorias) <= max || caloriasActuales < min) {
            recetasSeleccionadas.push(receta);
            caloriasActuales += receta.calorias;
            usados[categoria][receta.id_receta] = (usados[categoria][receta.id_receta] || 0) + 1;
          }

          if (caloriasActuales >= min) {
            break;
          }
        }

        const caloriasCategoria = recetasSeleccionadas.reduce((sum, r) => sum + r.calorias, 0);
        totalCaloriasDia += caloriasCategoria;

        planDiario[categoria] = recetasSeleccionadas.map(receta => ({
          id: receta.id_receta,
          titulo: receta.titulo,
          calorias: receta.calorias,
        }));

        // Registro detallado por categoría
        console.log(`  ${categoria}:`);
        recetasSeleccionadas.forEach(receta => {
          console.log(`    - ID: ${receta.id_receta}, Calorías: ${receta.calorias}`);
        });
      }

      planDiario.TotalCalorias = totalCaloriasDia;
      planSemanal.push(planDiario);

      // Registro de resumen por día
      console.log(`  Total de calorías del día: ${totalCaloriasDia}`);
    }

    return planSemanal;
  } catch (error) {
    console.error('Error en generarPlanSemanal:', error);
    throw error;
  }
};



// Función para mezclar arrays
function shuffleArray(array, rng) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
