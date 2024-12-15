import { collection, query, addDoc, orderBy, limit, getDocs, doc, getDoc, where, updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebase'; // Asegúrate de importar correctamente Timestamp

// Función para guardar el progreso del usuario (peso y fecha)
export async function guardarProgreso(peso, usuarioId) {
  try {
    // Guardar el nuevo registro de progreso en la subcolección 'progreso'
    const progresoRef = await addDoc(collection(db, 'usuarios', usuarioId, 'progreso'), {
      peso: peso,
      fecha: Timestamp.fromDate(new Date()), // Usamos Timestamp para mayor precisión
    });
    console.log('Progreso guardado con ID:', progresoRef.id);

    // Actualizar el peso principal del usuario y establecer 'actualizar_plan' a true
    const usuarioDocRef = doc(db, 'usuarios', usuarioId);
    await updateDoc(usuarioDocRef, {
      'medidas_fisicas.peso_kg': parseFloat(peso),
      actualizar_plan: true,
    });
    console.log('Peso del usuario y variable actualizar_plan actualizados.');
  } catch (error) {
    console.error('Error al guardar el progreso y actualizar el usuario:', error);
  }
}

// Función para recuperar el último progreso del usuario
export async function obtenerUltimoProgreso(usuarioId) {
  try {
    const progresoRef = collection(db, 'usuarios', usuarioId, 'progreso');
    const q = query(progresoRef, orderBy('fecha', 'desc'), limit(1));
    const progresoQuerySnapshot = await getDocs(q);

    if (!progresoQuerySnapshot.empty) {
      const ultimoProgresoDoc = progresoQuerySnapshot.docs[0];
      const data = ultimoProgresoDoc.data();

      // Validar que la fecha sea un Timestamp
      if (data?.peso !== undefined && data?.fecha && data.fecha instanceof Timestamp) {
        return {
          peso: data.peso,
          fecha: data.fecha.toDate(), // Convertimos el Timestamp a un objeto Date
        };
      } else {
        console.warn('El documento de progreso no tiene los datos esperados o la fecha no es un Timestamp.');
        return null;
      }
    } else {
      console.warn('No hay registros de progreso.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el último progreso:', error);
    return null;
  }
}

export async function obtenerDatosProgreso(usuarioId) {
  try {
    const progresoRef = collection(db, 'usuarios', usuarioId, 'progreso');
    const q = query(progresoRef, orderBy('fecha', 'asc')); // Ordenamos por fecha

    const progresoQuerySnapshot = await getDocs(q);

    let labels = [];
    let data = [];

    // Obtener peso inicial del usuario
    const { pesoInicial } = await obtenerPesoYFechaDeCreacion(usuarioId);
    if (pesoInicial) {
      labels.push('Inicio');
      data.push(pesoInicial); // Añadimos el peso inicial como primer punto
    }

    if (!progresoQuerySnapshot.empty) {
      progresoQuerySnapshot.forEach((doc) => {
        const registro = doc.data();
        let fecha = registro.fecha?.toDate();

        if (fecha instanceof Date && !isNaN(fecha)) {
          const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}`.padStart(5, '0');

          if (registro.peso && !isNaN(registro.peso)) {
            labels.push(fechaFormateada);
            data.push(registro.peso);
          }
        } else {
          console.warn('Fecha inválida en el documento de progreso:', registro.fecha);
        }
      });
    }

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        },
      ],
    };
  } catch (error) {
    console.error('Error al obtener los datos de progreso:', error);
    return {
      labels: ['Inicio'],
      datasets: [{ data: [0] }],
    };
  }
}
// Función para obtener el peso inicial, peso objetivo y fecha de creación del usuario
export async function obtenerPesoYFechaDeCreacion(usuarioId) {
  try {
    if (!usuarioId) {
      console.error('No se proporcionó un usuarioId válido.');
      return null;
    }

    // Referencia al documento del usuario
    const usuarioRef = doc(db, 'usuarios', usuarioId);
    console.log('Referencia del documento:', usuarioRef);

    // Obtener los datos del documento
    const usuarioSnapshot = await getDoc(usuarioRef);

    if (!usuarioSnapshot.exists()) {
      console.warn('El usuario no existe en la base de datos.');
      return null;
    }

    const datosUsuario = usuarioSnapshot.data();
    console.log('Datos del usuario:', datosUsuario);

    const pesoInicial = datosUsuario.medidas_fisicas?.peso_kg || null;
    const pesoObjetivo = datosUsuario.objetivos?.peso_objetivo_kg || null;
    const fechaCreacion = datosUsuario.fecha_creacion
      ? datosUsuario.fecha_creacion.toDate()
      : null;

    console.log('Peso inicial:', pesoInicial);
    console.log('Peso objetivo:', pesoObjetivo);
    console.log('Fecha de creación:', fechaCreacion);

    return { pesoInicial, pesoObjetivo, fechaCreacion };
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    return null;
  }
}
//Funcion que guarda el dia que se cocino una receta
export async function guardarDiaRealizado(usuarioId) {
  try {
    const hoy = new Date();
    const fechaSinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); // Fecha sin hora
    const fechaTimestamp = Timestamp.fromDate(fechaSinHora);

    // Referencia a la colección 'diasCocinando' del usuario
    const diasCocinandoRef = collection(db, 'usuarios', usuarioId, 'diasCocinando');

    // Query para verificar si la fecha ya existe
    const consulta = query(diasCocinandoRef, where('fecha', '==', fechaTimestamp));
    const consultaSnapshot = await getDocs(consulta);

    if (!consultaSnapshot.empty) {
      console.log('La fecha ya está registrada, no se hará nada.');
      return;
    }

    // Si no existe, agregar la nueva fecha
    const diaRealizadoRef = await addDoc(diasCocinandoRef, {
      fecha: fechaTimestamp,
    });

    console.log('Día realizado guardado con ID:', diaRealizadoRef.id);
  } catch (error) {
    console.error('Error al guardar el día realizado:', error);
  }
}

//Funcion que obtiene los fechas de dias cocinando
export async function obtenerDiasCocinados(usuarioId) {
  try {
    const diasCocinandoRef = collection(db, 'usuarios', usuarioId, 'diasCocinando');
    const snapshot = await getDocs(diasCocinandoRef);

    const diasCocinados = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data && data.fecha && data.fecha.toDate) {
        try {
          const fechaFormateada = data.fecha.toDate().toISOString().split('T')[0];
          diasCocinados.push(fechaFormateada);
        } catch (e) {
          console.error(`Error al procesar la fecha del documento con ID ${doc.id}:`, e);
        }
      } else {
        console.warn(`El documento con ID ${doc.id} no tiene una fecha válida o es null.`);
      }
      
    });

    return diasCocinados;
  } catch (error) {
    console.error('Error al obtener días cocinados:', error);
    return [];
  }
}

// Función para obtener la cantidad de días registrados
export async function obtenerCantidadDiasRegistrados(usuarioId) {
  try {
    // Referencia a la colección de días cocinados
    const diasCocinandoRef = collection(db, 'usuarios', usuarioId, 'diasCocinando');
    const snapshot = await getDocs(diasCocinandoRef);

    const diasCocinados = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data && data.fecha) {
        const fechaFormateada = data.fecha.toDate().toISOString().split('T')[0];
        diasCocinados.push(fechaFormateada);
      }
    });

    return diasCocinados.length;  // Regresa la cantidad de días registrados
  } catch (error) {
    console.error('Error al obtener la cantidad de días registrados:', error);
    return 0;
  }
}

// Función para obtener la cantidad máxima de días consecutivos
export async function obtenerMaximoDiasConsecutivos(usuarioId) {
  try {
    // Referencia a la colección de días cocinados
    const diasCocinandoRef = collection(db, 'usuarios', usuarioId, 'diasCocinando');
    const snapshot = await getDocs(diasCocinandoRef);

    const diasCocinados = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data && data.fecha) {
        const fechaFormateada = data.fecha.toDate().toISOString().split('T')[0];
        diasCocinados.push(fechaFormateada);
      }
    });

    // Ordenar las fechas para asegurarnos de que estén en orden cronológico
    diasCocinados.sort();

    let maxConsecutivos = 1;
    let consecutivos = 1;

    for (let i = 1; i < diasCocinados.length; i++) {
      const fechaActual = new Date(diasCocinados[i]);
      const fechaAnterior = new Date(diasCocinados[i - 1]);

      // Verificar si la fecha actual es consecutiva a la anterior
      if ((fechaActual - fechaAnterior) / (1000 * 60 * 60 * 24) === 1) {
        consecutivos++;  // Aumentar el conteo de días consecutivos
      } else {
        maxConsecutivos = Math.max(maxConsecutivos, consecutivos);  // Actualizar el máximo
        consecutivos = 1;  // Reiniciar el conteo
      }
    }

    // Asegurarse de considerar la última secuencia de días consecutivos
    maxConsecutivos = Math.max(maxConsecutivos, consecutivos);

    return maxConsecutivos;  // Regresar el máximo número de días consecutivos
  } catch (error) {
    console.error('Error al obtener el máximo de días consecutivos:', error);
    return 0;
  }
}