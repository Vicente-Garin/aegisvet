# Bitácora de Uso de Inteligencia Artificial Generativa

## Entrada 1: SQL - Funciones Almacenadas y Generación de Correlativo
- **Paso:** Pasos 3, 4 y 5 (Modelado y Funciones en PostgreSQL).
- **Herramienta:** Gemini (diseño y prompts) + Neon SQL Editor.
- **Prompt:** "Genera las funciones SQL para PostgreSQL que manejen el correlativo automático con formato YYYY-0001 usando secuencias, búsqueda por ILIKE y resumen estadístico agrupado por especie".
- **Resultado:** Se adoptaron las funciones `buscar_pacientes()`, `generar_numero_atencion()`, `registrar_paciente()` y `resumen_por_especie()` en el archivo `sql/funciones.sql`.
- **Verificación:** Al ejecutar inicialmente `SELECT * FROM resumen_por_especie()` en Neon arrojó el error `SQLSTATE 42883 (function does not exist)`. Tras ejecutar el script completo, la función retornó el conteo agrupado por especie y la secuencia correlativa generó identificadores como `2026-0001`.

## Entrada 2: Backend - Arquitectura N-Capas en Express
- **Paso:** Pasos 3, 4 y 5 (Repositorio, Servicio, Controlador y Rutas).
- **Herramienta:** Gemini (diseño de especificación) + GitHub Copilot (generación de código).
- **Prompt:** "Actualiza las 4 capas del backend en server/ para consumir las funciones de PostgreSQL: 1. En repository agrega buscar(texto), guardar(paciente) con registrar_paciente y obtenerResumen(). 2. En service expón los métodos convirtiendo Number(fila.total). 3. En controller añade buscar y resumen. 4. En routes declara /buscar y /resumen antes de rutas dinámicas".
- **Resultado:** Se modularizaron los 4 archivos de la carpeta `server/`, conectando las consultas parametrizadas con `pg.Pool` hacia Neon.
- **Verificación:** Pruebas directas en el navegador a los endpoints `https://vetchiloe.onrender.com/api/pacientes/resumen` y `https://vetchiloe.onrender.com/api/pacientes/buscar?q=mer`.

## Entrada 3: Frontend - Buscador Reactivo y Badges Estadísticos
- **Paso:** Etapa 3 (Componente BuscadorPaciente e integración en App).
- **Herramienta:** Gemini (especificación) + GitHub Copilot (implementación React).
- **Prompt:** "Actúa como desarrollador full-stack y completa la Etapa 3: Capa de Presentación del proyecto vetChiloé según las especificaciones de la pauta del laboratorio: 1. Crea src/components/BuscadorPaciente.jsx controlado con input search. 2. Modifica src/services/pacienteService.js agregando buscarPacientes y getResumenEspecies. 3. Modifica src/App.jsx integrando estado busqueda, resumen, filtro reactivo en memoria, badges de resumen por especie, contador 'X de Y pacientes' y mensaje 'No se encontraron pacientes'".
- **Resultado:** Se creó `BuscadorPaciente.jsx`, se actualizaron las peticiones en `pacienteService.js` y se integró el filtro reactivo en el estado de `App.jsx`.
- **Verificación:** Ejecución exitosa de `npm run build` sin errores de compilación y prueba de filtrado en tiempo real sin recargas de página.

## Entrada 4: Despliegue en la Nube y Compatibilidad de Módulos
- **Paso:** Cierre y Despliegue en Producción (Render y Vercel).
- **Herramienta:** Gemini.
- **Prompt:** "Render arroja SyntaxError: The requested module './routes/pacientes.routes.js' does not provide an export named 'default' al iniciar node server/index.js".
- **Resultado:** Se diagnosticó una inconsistencia de módulos: el proyecto utilizaba ES Modules (`type: "module"` en `package.json`), pero Copilot había generado exportaciones mixtas con CommonJS (`module.exports`). Se homogeneizó la arquitectura completa a `import`/`export default` y se conectó el servicio estático en Vercel con el backend en Render.
- **Verificación:** Despliegue en verde en Render Web Service y carga completa de la aplicación con persistencia en `https://aegisvet.vercel.app`.

---

## Reflexión en Pareja sobre el Uso de IA
La integración de asistentes de inteligencia artificial permitió acelerar el desarrollo del proyecto, particularmente al traducir los requerimientos de la pauta en código desacoplado para las capas de Express y en la sintaxis de funciones nativas de PostgreSQL. No obstante, el desarrollo exigió una constante supervisión técnica: la IA generó conflictos de compatibilidad al mezclar sintaxis CommonJS y ES Modules que impidieron el despliegue inicial en Render, y propuso estructuras de datos en el frontend incompatibles con las columnas estrictas de la base relacional en Neon. La experiencia demostró que las herramientas de IA son eficientes para la generación de plantillas y código base, pero la resolución de dependencias, la configuración de despliegue en la nube y la integridad entre capas requieren del criterio y la depuración humana[cite: 6].
