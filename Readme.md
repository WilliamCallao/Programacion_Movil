# Asistente de Recetas y Planes Alimenticios Personalizados

![Group 493 (2)](https://github.com/user-attachments/assets/0a22339e-106a-460c-a8dc-3a79ad690878)

Aplicación móvil desarrollada con **React Native** y **Expo**, diseñada para ayudar a los usuarios a descubrir recetas y generar planes alimenticios adaptados a sus necesidades individuales. La aplicación considera preferencias dietéticas (vegetariano, vegano, dietas no restrictivas), condiciones de salud específicas (diabetes, bajo en sodio, control de peso), y calcula los requerimientos calóricos basados en datos del usuario (estatura, peso, nivel de actividad física). Además, permite el seguimiento del progreso y el reajuste de los planes alimenticios conforme el usuario avanza hacia sus objetivos.

## Características Principales

*   **Perfil de Usuario Personalizado:** Configuración de preferencias dietéticas y condiciones de salud.
*   **Cálculo de Necesidades Calóricas:** Estimación automática de calorías diarias requeridas.
*   **Generación de Planes Alimenticios:** Creación de planes de comidas personalizados.
*   **Amplia Base de Datos de Recetas:** Acceso a diversas recetas filtrables.
*   **Seguimiento de Progreso:** Monitorización de la evolución del peso y otros indicadores.
*   **Reajuste Dinámico de Dietas:** Adaptación de los planes según el progreso del usuario.

## Requisitos Previos

Se requiere tener instalado lo siguiente en el entorno de desarrollo:

*   **Node.js**
*   **Expo CLI**: Si no se encuentra instalado, ejecutar:
    ```bash
    npm install -g expo-cli
    ```

## Instalación

1.  Clonar el repositorio:
    ```bash
    git clone https://github.com/WilliamCallao/Programacion_Movil.git
    cd Programacion_Movil
    ```

2.  Instalar las dependencias del proyecto:
    ```bash
    npm install
    ```

## Inicio de Sesión en Expo

Para una correcta gestión con las herramientas de Expo, es necesario iniciar sesión. Si no se posee una cuenta, es posible registrarse en [Expo](https://expo.dev/signup).

1.  Iniciar sesión desde la terminal:
    ```bash
    expo login
    ```

2.  Ingresar las credenciales de Expo (correo electrónico y contraseña) cuando sean solicitadas.

## Ejecución en Dispositivo Móvil (utilizando Expo Go)

1.  Instalar la aplicación **Expo Go** en el dispositivo móvil:
    *   [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
    *   [Apple App Store](https://apps.apple.com/app/expo-go/id982107779)

2.  Iniciar el servidor de desarrollo:
    ```bash
    npm start
    ```
    O también se puede usar:
    ```bash
    expo start
    ```

3.  Escanear el código QR (mostrado en la terminal) utilizando la aplicación **Expo Go** en el dispositivo móvil.

## Tecnologías Utilizadas

*   **React Native**: Framework para construir aplicaciones móviles multiplataforma utilizando React.
*   **Expo**: Plataforma y conjunto de herramientas que facilitan el desarrollo, la compilación y las pruebas de aplicaciones React Native.
