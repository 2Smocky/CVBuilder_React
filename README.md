# Mi CV Designer

Este es un proyecto de creación de CVs (Currículum Vitae) que permite a los usuarios crear, personalizar y descargar sus propios CVs. La aplicación está construida con React y Vite, y cuenta con un panel de administración para gestionar usuarios y ver registros.

## Características

- **Creación de CVs:** Los usuarios pueden crear CVs a partir de una plantilla inicial.
- **Personalización:** Permite la personalización de la información del CV, como datos personales, experiencia laboral, educación, etc.
- **Previsualización en tiempo real:** Los cambios realizados en el CV se reflejan en una previsualización en tiempo real.
- **Descarga de CV:** Los usuarios pueden descargar su CV en formato PDF.
- **Autenticación de usuarios:** Sistema de registro e inicio de sesión para usuarios.
- **Panel de administración:** Un panel para administradores con las siguientes características:
    - **Gestión de usuarios:** Ver y gestionar los usuarios registrados.
    - **Estadísticas:** Ver estadísticas de la aplicación.
    - **Registros:** Ver registros de actividad en la aplicación.

## Arquitectura y Organización del Proyecto

La arquitectura del proyecto está diseñada para ser escalable, mantenible y eficiente. Se basa en una estructura modular y separada por características, lo que aporta los siguientes beneficios:

- **Escalabilidad:** Al tener el código separado en módulos (componentes, servicios, páginas), es más fácil agregar nuevas funcionalidades sin afectar las existentes.
- **Mantenibilidad:** La separación de responsabilidades (por ejemplo, la lógica de la interfaz de usuario en los componentes, la lógica de negocio en los servicios) hace que el código sea más fácil de entender, depurar y modificar.
- **Reutilización de código:** Los componentes reutilizables se encuentran en la carpeta `src/components`, lo que permite su uso en diferentes partes de la aplicación, reduciendo la duplicación de código.
- **Eficiencia en el desarrollo:** La estructura clara y organizada permite a los desarrolladores encontrar rápidamente los archivos que necesitan modificar, lo que agiliza el proceso de desarrollo.

### Estructura del Proyecto

El proyecto está estructurado de la siguiente manera:

```
├── public/                # Archivos estáticos
├── src/
│   ├── admin/             # Componentes y lógica del panel de administración
│   │   ├── components/    # Componentes específicos del panel de administración
│   │   ├── routes/        # Rutas protegidas para administradores
│   │   └── style/         # Estilos para el panel de administración
│   ├── assets/            # Imágenes y otros recursos
│   ├── components/        # Componentes reutilizables de la aplicación
│   ├── data/              # Datos iniciales o mock data
│   ├── hooks/             # Hooks personalizados de React
│   ├── pages/             # Páginas principales de la aplicación (Login, Register, CVBuilder)
│   │   └── styles/        # Estilos para las páginas
│   ├── services/          # Lógica de negocio y comunicación con APIs
│   ├── App.css            # Estilos principales de la aplicación
│   ├── App.jsx            # Componente principal de la aplicación
│   ├── index.css          # Estilos globales
│   └── main.jsx           # Punto de entrada de la aplicación
├── .gitignore             # Archivos y carpetas a ignorar por Git
├── eslint.config.js       # Configuración de ESLint
├── index.html             # Plantilla HTML principal
├── package.json           # Metadatos y dependencias del proyecto
├── README.md              # Documentación del proyecto
└── vite.config.js         # Configuración de Vite
```

### Comunicación con la API

La comunicación con el backend (API) se gestiona a través de una capa de servicios centralizada en la carpeta `src/services`. Este enfoque ofrece varias ventajas:

- **Centralización:** Toda la lógica de comunicación con la API se encuentra en un solo lugar, lo que facilita su gestión y mantenimiento.
- **Abstracción:** Los componentes no interactúan directamente con la API, sino que utilizan los servicios. Esto desacopla la lógica de la interfaz de usuario de la lógica de comunicación, lo que permite cambiar la implementación de la API sin tener que modificar los componentes.
- **Manejo de errores:** Los servicios pueden implementar un manejo de errores centralizado, lo que simplifica el código en los componentes.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm run dev`

Ejecuta la aplicación en modo de desarrollo.
Abre [http://localhost:5173](http://localhost:5173) para verla en tu navegador.

La página se recargará si haces cambios.
También verás cualquier error de lint en la consola.

### `npm run build`

Construye la aplicación para producción en la carpeta `dist`.
Empaqueta React en modo de producción y optimiza la compilación para el mejor rendimiento.

### `npm run lint`

Ejecuta el linter de ESLint para verificar el código.

### `npm run preview`

Ejecuta la aplicación en modo de producción localmente para previsualizar la compilación de producción.

## Dependencias Principales

- **React:** Biblioteca para construir interfaces de usuario.
- **React Router:** Para el enrutamiento en la aplicación.
- **Vite:** Herramienta de compilación rápida para desarrollo web moderno.
- **html2pdf.js:** Para generar el PDF del CV.
- **SweetAlert2:** Para mostrar alertas y modales atractivos.
- **ESLint:** Para el análisis estático del código y la aplicación de reglas de estilo.

---

© 2025 vertexcode. Todos los derechos reservados.