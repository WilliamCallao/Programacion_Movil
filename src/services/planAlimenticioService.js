// src/services/planAlimenticioService.js

import { cargarRecetas } from './recetasService';

export const generarPlanSemanal = async (metaCalorias, preferencias) => {
  try {
    console.log('Generando plan semanal con meta_calorias:', metaCalorias);
    console.log('Preferencias del usuario:', preferencias);

    const distribucion = {
      Desayuno: { min: 0.25, max: 0.30 },
      Almuerzo: { min: 0.35, max: 0.40 },
      Cena: { min: 0.25, max: 0.30 },
      Snacks: { min: 0.05, max: 0.10 },
    };

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

    console.log('Calorías por categoría:', caloriasPorCategoria);

    const [desayunos, almuerzos, cenas, snacks] = await Promise.all([
      cargarRecetas('desayuno_recetas.json'),
      cargarRecetas('almuerzo_recetas.json'),
      cargarRecetas('cena_recetas.json'),
      cargarRecetas('snacks_recetas.json'),
    ]);

    if (!desayunos.length || !almuerzos.length || !cenas.length || !snacks.length) {
      throw new Error('No hay suficientes recetas en una o más categorías.');
    }

    console.log('Recetas disponibles por categoría:');
    console.log(`Desayunos: ${desayunos.length}`);
    console.log(`Almuerzos: ${almuerzos.length}`);
    console.log(`Cenas: ${cenas.length}`);
    console.log(`Snacks: ${snacks.length}`);

    const usados = {
      Desayuno: new Set(),
      Almuerzo: new Set(),
      Cena: new Set(),
      Snacks: new Set(),
    };

    const maxRecetasPorCategoria = 2;

    const planSemanal = [];

    for (let dia = 1; dia <= 7; dia++) {
      const planDiario = {};
      let totalCaloriasDia = 0;


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
          default:
            recetasDisponibles = [];
        }

        const recetasFiltradas = recetasDisponibles.filter(receta => {
          const dietas = preferencias.preferencias_dietarias;
          const condiciones = preferencias.condiciones_salud;
          const cumpleDietas = dietas.every(dieta => {
            const key = dieta.toLowerCase().replace(' ', '-');
            return receta[key] === 1;
          });
          const cumpleCondiciones = condiciones.every(condicion => {
            const key = condicion.toLowerCase().replace(' ', '-');
            return receta[key] === 1;
          });

          return cumpleDietas && cumpleCondiciones;
        });

        const recetasValidas = recetasFiltradas.filter(receta => 
          receta.calorias >= min && receta.calorias <= max && !usados[categoria].has(receta.id_receta)
        );

        let recetasSeleccionadas = [];

        for (let intento = 0; intento < maxRecetasPorCategoria; intento++) {
          const caloriasActuales = recetasSeleccionadas.reduce((sum, r) => sum + r.calorias, 0);

          if (caloriasActuales >= min) {
            break;
          }

          if (recetasValidas.length > 0) {
            const recetaElegida = recetasValidas[Math.floor(Math.random() * recetasValidas.length)];
            recetasSeleccionadas.push(recetaElegida);
            usados[categoria].add(recetaElegida.id_receta);

            recetasValidas.splice(recetasValidas.indexOf(recetaElegida), 1);
          } else {
            const recetasOrdenadas = recetasFiltradas
              .filter(receta => !usados[categoria].has(receta.id_receta))
              .sort((a, b) => Math.abs(a.calorias - min) - Math.abs(b.calorias - min));

            if (recetasOrdenadas.length > 0) {
              const recetaCercana = recetasOrdenadas[0];
              recetasSeleccionadas.push(recetaCercana);
              usados[categoria].add(recetaCercana.id_receta);
            } else {
              break;
            }
          }
        }

        const caloriasCategoria = recetasSeleccionadas.reduce((sum, r) => sum + r.calorias, 0);
        totalCaloriasDia += caloriasCategoria;

        planDiario[categoria] = recetasSeleccionadas.map(receta => ({
          titulo: receta.titulo,
          calorias: receta.calorias,
        }));
      }

      planDiario.TotalCalorias = totalCaloriasDia;
      planSemanal.push(planDiario);
    }

    return planSemanal;
  } catch (error) {
    console.error('Error en generarPlanSemanal:', error);
    throw error;
  }
};
