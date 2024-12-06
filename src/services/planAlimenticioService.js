// src/services/planAlimenticioService.js

import seedrandom from 'seedrandom';
import { cargarRecetas } from './recetasService';

export const generarPlanSemanal = async (metaCalorias, preferencias, seed = Math.random()) => {
  try {
    console.log('Generando plan semanal con meta_calorias:', metaCalorias);
    console.log('Preferencias del usuario:', preferencias);

    const rng = seedrandom(seed);

    const variacion = (rng() - 0.5) * 0.1; 
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

    const maxRepeticiones = 2;

    const planSemanal = [];
    const startDay = Math.floor(rng() * 7);

    for (let i = 0; i < 7; i++) {
      const dia = (startDay + i) % 7 + 1;
      const planDiario = {};
      let totalCaloriasDia = 0;
      let totalRecetasDia = 0;

      console.log(`Día ${dia}:`);
      const categorias = ['Desayuno', 'Almuerzo', 'Cena', 'Snacks'];
      for (let categoria of categorias) {
        if (totalRecetasDia >= 5) {
          console.log('Se ha alcanzado el número máximo de recetas por día.');
          break;
        }

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

        const preferenciasUnificadas = [
          ...(preferencias.preferencias_dietarias || []),
          ...(preferencias.condiciones_salud || []),
          preferencias.tipo_dieta || "",
        ];

        // Aplicar equivalencias a las preferencias
        const equivalencias = {
          diabetes_tipo_1: "lower-carb",
          diabetes_tipo_2: "lower-carb",
          resistencia_insulina: "lower-carb",
          celiaco: "gluten-free",
          sobrepeso: "high-in-fiber",
          presion_alta: "low-sodium",
          insuficiencia_cardiaca: "low-sodium",
          problemas_renales: "low-sodium",
          no_restrictiva: "",
          vegana: "vegano",
          vegetariana: "vegetariano",
        };

        const preferenciasEquivalentes = preferenciasUnificadas.map(pref => equivalencias[pref] || pref);

        const recetasFiltradas = recetasDisponibles.filter(receta => {
          return preferenciasEquivalentes.every(pref => pref === "" || receta[pref.toLowerCase()] === 1);
        });

        if (recetasFiltradas.length === 0) {
          console.log(`No hay recetas disponibles para la categoría ${categoria} después de aplicar las preferencias.`);
          continue;
        }

        // Excluir recetas que han alcanzado el número máximo de repeticiones
        const recetasDisponiblesParaSeleccion = recetasFiltradas.filter(receta => {
          if (usados[categoria][receta.id_receta] === undefined) {
            usados[categoria][receta.id_receta] = 0;
          }
          return usados[categoria][receta.id_receta] < maxRepeticiones;
        });

        if (recetasDisponiblesParaSeleccion.length === 0) {
          console.log(`No hay recetas disponibles para la categoría ${categoria} después de considerar el límite de repeticiones.`);
          continue;
        }

        let recetasSeleccionadas = [];
        let caloriasActuales = 0;

        // Intentar seleccionar una receta que cumpla con el rango de calorías
        let recetaSeleccionada = null;

        for (let receta of recetasDisponiblesParaSeleccion) {
          if (receta.calorias >= min && receta.calorias <= max) {
            recetaSeleccionada = receta;
            break;
          }
        }

        // Si no se encontró, seleccionar la receta más cercana al mínimo de calorías
        if (!recetaSeleccionada) {
          recetaSeleccionada = recetasDisponiblesParaSeleccion.reduce((prev, curr) => {
            return (Math.abs(curr.calorias - min) < Math.abs(prev.calorias - min) ? curr : prev);
          });
        }

        if (recetaSeleccionada) {
          recetasSeleccionadas.push({
            id: recetaSeleccionada.id_receta,
            titulo: recetaSeleccionada.titulo,
            calorias: recetaSeleccionada.calorias,
          });
          caloriasActuales += recetaSeleccionada.calorias;
          usados[categoria][recetaSeleccionada.id_receta]++;
          totalRecetasDia++;
        }

        // Si las calorías actuales son significativamente menores que el mínimo, intentar agregar otra receta
        if (caloriasActuales < min * 0.8 && totalRecetasDia < 5) {
          for (let receta of recetasDisponiblesParaSeleccion) {
            if (receta.id_receta === recetaSeleccionada.id_receta) continue;
            if ((caloriasActuales + receta.calorias) <= max) {
              recetasSeleccionadas.push({
                id: receta.id_receta,
                titulo: receta.titulo,
                calorias: receta.calorias,
              });
              caloriasActuales += receta.calorias;
              usados[categoria][receta.id_receta]++;
              totalRecetasDia++;
              break;
            }
          }
        }

        const caloriasCategoria = caloriasActuales;
        totalCaloriasDia += caloriasCategoria;

        planDiario[categoria] = recetasSeleccionadas;

        // Registro detallado por categoría
        console.log(`  ${categoria}:`);
        recetasSeleccionadas.forEach(receta => {
          console.log(`    - ID: ${receta.id}, Calorías: ${receta.calorias}`);
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
