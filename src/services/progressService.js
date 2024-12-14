import { collection, query, addDoc, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebase'; // Asegúrate de importar correctamente Timestamp

// Función para guardar el progreso del usuario (peso y fecha)
export async function guardarProgreso(peso, usuarioId) {
  try {
    const progresoRef = await addDoc(collection(db, 'usuarios', usuarioId, 'progreso'), {
      peso: peso,
      fecha: Timestamp.fromDate(new Date()), // Usamos Timestamp para mayor precisión
    });
    console.log('Progreso guardado con ID:', progresoRef.id);
  } catch (error) {
    console.error('Error al guardar el progreso:', error);
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