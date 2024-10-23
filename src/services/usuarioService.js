import { collection, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebase';
import { generarPlanSemanal } from './planAlimenticioService';

// Calcular la edad del usuario
export const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

// Calcular el peso objetivo según el tipo de objetivo
export const calcularPesoObjetivo = (pesoActual, tipoObjetivo) => {
  switch (tipoObjetivo) {
    case 'perder_peso':
      return pesoActual * 0.9;
    case 'ganar_peso':
      return pesoActual * 1.1;
    default:
      return pesoActual;
  }
};

// Definir distribución de macronutrientes según el objetivo
export const obtenerDistribucionMacronutrientes = (tipoObjetivo) => {
  switch (tipoObjetivo) {
    case 'perder_peso':
      return { carbohidratos: 40, proteinas: 35, grasas: 25 };
    case 'ganar_peso':
      return { carbohidratos: 50, proteinas: 30, grasas: 20 };
    default:
      return { carbohidratos: 50, proteinas: 20, grasas: 30 };
  }
};

// Calcular calorías con la fórmula Harris-Benedict
export const calcularCalorias = (peso, altura, edad, genero, nivelActividad) => {
  let tmb;
  if (genero === 'masculino') {
    tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
  } else {
    tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
  }

  const factorActividad = {
    sedentario: 1.2,
    ligeramente_activo: 1.375,
    moderadamente_activo: 1.55,
    muy_activo: 1.725,
    extra_activo: 1.9,
  };

  return Math.round(tmb * factorActividad[nivelActividad]);
};

// Calcular la distribución de macronutrientes en gramos
export const calcularMacronutrientes = (caloriasTotales, distribucion) => {
  const { carbohidratos, proteinas, grasas } = distribucion;
  const gramosCarbohidratos = (caloriasTotales * (carbohidratos / 100)) / 4;
  const gramosProteinas = (caloriasTotales * (proteinas / 100)) / 4;
  const gramosGrasas = (caloriasTotales * (grasas / 100)) / 9;

  return {
    carbohidratos: gramosCarbohidratos.toFixed(2),
    proteinas: gramosProteinas.toFixed(2),
    grasas: gramosGrasas.toFixed(2),
  };
};

// Guardar el ID de usuario en AsyncStorage
const guardarIdEnAsyncStorage = async (usuarioId) => {
  try {
    await AsyncStorage.setItem('usuarioId', usuarioId);
    console.log(`ID de usuario guardado: ${usuarioId}`);
  } catch (error) {
    console.error('Error al guardar el ID en AsyncStorage:', error);
  }
};

// Crear un nuevo usuario en Firebase y generar su plan alimenticio
export const crearUsuario = async (datosUsuario) => {
  try {
    const usuarioRef = await addDoc(collection(db, 'usuarios'), datosUsuario);
    console.log('Usuario creado en Firebase con ID:', usuarioRef.id);

    await guardarIdEnAsyncStorage(usuarioRef.id);

    const planSemanal = await generarPlanSemanal(datosUsuario.objetivos.meta_calorias);

    const fechaCreacion = new Date();
    const planesAlimentacion = planSemanal.map((plan, index) => ({
      id_plan: `plan${index + 1}_${fechaCreacion.getTime()}`,
      fecha_creacion: fechaCreacion,
      estado: 'activo',
      dia: index + 1,
      comidas: plan,
    }));

    await updateDoc(doc(db, 'usuarios', usuarioRef.id), {
      planes_alimentacion: arrayUnion(...planesAlimentacion),
    });

    console.log('Plan alimenticio generado y guardado en Firebase.');
  } catch (error) {
    console.error('Error al crear el usuario y generar el plan:', error);
  }
};
