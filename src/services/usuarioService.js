import { collection, addDoc, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
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

    const planSemanal = await generarPlanSemanal(datosUsuario.objetivos.meta_calorias, datosUsuario.preferencias);

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

    const usuarioDoc = await getDoc(doc(db, 'usuarios', usuarioRef.id));
    if (usuarioDoc.exists()) {
      console.log('Datos completos del usuario:', JSON.stringify(usuarioDoc.data(), null, 2));
    } else {
      console.error('No se encontró el documento del usuario después de actualizar.');
    }
  } catch (error) {
    console.error('Error al crear el usuario y generar el plan:', error);
  }
};

// Actualizar los datos del usuario en Firebase
export const actualizarUsuario = async (usuarioId, datosActualizados) => {
  try {
    const usuarioDocRef = doc(db, 'usuarios', usuarioId);
    await updateDoc(usuarioDocRef, datosActualizados);
    console.log('Datos del usuario actualizados en Firebase.');
  } catch (error) {
    console.error('Error al actualizar los datos del usuario:', error);
  }
};

export const obtenerUsuario = async (usuarioId) => {
  try {
    const usuarioDocRef = doc(db, 'usuarios', usuarioId);
    const usuarioDoc = await getDoc(usuarioDocRef);

    if (usuarioDoc.exists()) {
      return usuarioDoc.data();
    } else {
      console.error('No se encontró un usuario con la ID proporcionada.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error;
  }
};

export const generarYAsignarPlanAlimenticio = async (usuarioId) => {
  try {
    // Obtener los datos del usuario
    const usuarioDocRef = doc(db, 'usuarios', usuarioId);
    const usuarioDoc = await getDoc(usuarioDocRef);

    if (usuarioDoc.exists()) {
      const datosUsuario = usuarioDoc.data();

      // Calcular meta_calorias y demás datos relacionados
      const edad = calcularEdad(datosUsuario.informacion_personal.fecha_nacimiento); // Es una cadena
      const pesoObjetivo = calcularPesoObjetivo(
        datosUsuario.medidas_fisicas.peso_kg,
        datosUsuario.objetivo_peso.tipo_objetivo
      );
      const distribucion = obtenerDistribucionMacronutrientes(datosUsuario.objetivo_peso.tipo_objetivo);

      const metaCalorias = calcularCalorias(
        datosUsuario.medidas_fisicas.peso_kg,
        datosUsuario.medidas_fisicas.altura_cm,
        edad,
        datosUsuario.informacion_personal.genero,
        datosUsuario.medidas_fisicas.nivel_actividad
      );

      const macros = calcularMacronutrientes(metaCalorias, distribucion);

      // Actualizar los objetivos del usuario
      await updateDoc(usuarioDocRef, {
        'objetivos.meta_calorias': metaCalorias,
        'objetivos.peso_objetivo_kg': pesoObjetivo,
        'objetivos.distribucion_macronutrientes': distribucion,
        'objetivos.macronutrientes': macros,
      });

      console.log(`Meta calórica calculada: ${metaCalorias}`);
      console.log('Datos nutricionales actualizados en Firebase.');

      // Generar el nuevo plan semanal
      const preferencias = datosUsuario.preferencias;
      const planSemanal = await generarPlanSemanal(metaCalorias, preferencias);

      const fechaCreacion = new Date();
      const planesAlimentacion = planSemanal.map((plan, index) => ({
        id_plan: `plan${index + 1}_${fechaCreacion.getTime()}`,
        fecha_creacion: fechaCreacion,
        estado: 'activo',
        dia: index + 1,
        comidas: plan,
      }));

      // Sobrescribir los planes existentes con el nuevo plan semanal
      await updateDoc(usuarioDocRef, {
        planes_alimentacion: planesAlimentacion, // Reemplaza la lista completa
      });

      console.log('Plan alimenticio generado y reemplazado en Firebase.');
    } else {
      console.error('No se encontró un usuario con la ID proporcionada.');
    }
  } catch (error) {
    console.error('Error al generar y asignar el plan alimenticio:', error);
    throw error;
  }
};

export const verificarYActualizarPlan = async () => {
  let planActualizado = false;

  try {
    const userId = await AsyncStorage.getItem("usuarioId");
    if (!userId) {
      console.error("(1245) No se encontró el ID del usuario en AsyncStorage.");
      return false;
    }

    const usuarioDocRef = doc(db, "usuarios", userId);
    const usuarioDoc = await getDoc(usuarioDocRef);

    if (usuarioDoc.exists()) {
      let usuarioData = usuarioDoc.data();

      // Verificar si el atributo 'actualizar_plan' existe
      if (usuarioData.actualizar_plan === undefined) {
        // Si no existe, crearlo con el valor 'false'
        await updateDoc(usuarioDocRef, { actualizar_plan: false });
        console.log("(1245) Atributo 'actualizar_plan' creado con el valor predeterminado: false.");
        usuarioData = { ...usuarioData, actualizar_plan: false };
      }

      if (usuarioData.actualizar_plan) {
        console.log("(1245) Actualizando el plan alimenticio del usuario...");
        await generarYAsignarPlanAlimenticio(userId);
        await updateDoc(usuarioDocRef, { actualizar_plan: false });
        console.log("(1245) Plan alimenticio actualizado y 'actualizar_plan' restablecido a false.");
        planActualizado = true;
      } else {
        console.log("(1245) No se requiere actualizar el plan alimenticio.");
      }
    } else {
      console.error("(1245) No se encontró un documento para el usuario proporcionado.");
    }
  } catch (error) {
    console.error("(1245) Error al verificar o actualizar el atributo 'actualizar_plan':", error);
  }
  return planActualizado;
};

