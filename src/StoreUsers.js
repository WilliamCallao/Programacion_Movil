// storeUsers.js
import { create } from 'zustand';

const useStore = create((set) => ({
  usuario: {
    informacion_personal: {
      nombre: 'John Doe',
      correo: 'johndoe@example.com',
      contraseña: 'password123',
      foto_perfil_url: 'https://example.com/john_doe.jpg',
      fecha_nacimiento: '1990-05-15',
      genero: 'masculino', // Opciones:
      /*
        "masculino"
        "femenino"
        "otro"
      */
    },
    medidas_fisicas: {
      peso_kg: 75.0,
      altura_cm: 170.0,
      nivel_actividad: 'moderadamente_activo', // Opciones:
      /*
        "sedentario"
        "ligeramente_activo"
        "moderadamente_activo"
        "activo"
        "muy_activo"
      */
    },
    preferencias: {
      preferencias_dietarias: ['omnivoro'], // Opciones:
      /*
        "vegetariano"
        "vegano"
        "sin_gluten"
        "omnivoro"
        "paleo"
        "keto"
        "mediterraneo"
        "bajo_en_carbohidratos"
        "alta_proteina"
      */
      condiciones_salud: [''], // Opciones:
      /*
        "diabetes"
        "intolerante_lactosa"
        "hipertension"
        "celiaco"
        "colesterol_alto"
        "anemia"
        "enfermedad_celiaca"
      */
    },
    objetivos: {
      meta_calorias: 2500.0, // Ejemplo: Calorías diarias objetivo
      distribucion_macronutrientes: {
        carbohidratos: 50.0, // Porcentaje de carbohidratos
        proteinas: 30.0,    // Porcentaje de proteínas
        grasas: 20.0,        // Porcentaje de grasas
      },
      objetivo_peso: {
        peso_objetivo_kg: 70.0,
        tipo_objetivo: 'perder_peso', // Opciones:
        /*
          "perder_peso"
          "mantener_peso"
          "ganar_peso"
        */
      },
    },
    recetas_favoritas: [
      // Array para almacenar IDs de recetas favoritas
    ],
    seguimiento_progreso: {
      historial_peso: [
        {
          fecha: new Date().toISOString().split('T')[0], // Formato: "YYYY-MM-DD"
          peso_kg: 75.0,
        },
      ],
    },
  },
}));

export default useStore;
