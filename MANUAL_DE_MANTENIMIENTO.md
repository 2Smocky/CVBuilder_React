# Manual de Mantenimiento - CV Designer

## 1. Introducción

Este documento proporciona toda la información necesaria para mantener, modificar y desplegar la aplicación CV Designer. Está dirigido a desarrolladores que necesiten trabajar sobre el código fuente.

## 2. Arquitectura y Tecnologías

El frontend de CV Designer está construido principalmente con las siguientes tecnologías:

*   **React:** Biblioteca para construir la interfaz de usuario.
*   **html2pdf.js:** Para generar el archivo PDF a partir del contenido HTML del CV.
*   **CSS:** Para los estilos de la aplicación y las plantillas de CV.

El proyecto fue inicializado con `create-react-app`.

### Estructura de Carpetas

```
/
├── public/
│   └── index.html
├── src/
│   ├── components/  # Componentes reutilizables de React
│   ├── styles/      # Archivos CSS
│   ├── App.js       # Componente principal
│   └── index.js     # Punto de entrada de la aplicación
└── package.json     # Dependencias y scripts
```

## 3. Instalación y Despliegue

### Requisitos
*   Node.js (v14 o superior)
*   npm (v6 o superior) o yarn

### Pasos para la Instalación

1.  Clona el repositorio.
2.  Navega a la carpeta raíz del proyecto: `cd mi-cv-designer`
3.  Instala las dependencias: `npm install`

### Ejecutar en Modo Desarrollo
Para iniciar el servidor de desarrollo y ver la aplicación en `http://localhost:3000`:
`npm start`

### Compilar para Producción
Para crear una versión optimizada para producción en la carpeta `build/`:
`npm run build`