# Bitácora de Uso de Inteligencia Artificial Generativa

## Entrada 1: SQL - Funciones Almacenadas y Generación de Correlativo
- **Paso:** Paso 3, 4 y 5 (Modelado y Funciones en PostgreSQL).
- **Herramienta:** Gemini (estructuración) + Neon SQL Editor.
- **Prompt:** "Genera las funciones SQL para PostgreSQL que manejen el correlativo automático con formato YYYY-0001 usando secuencias, búsqueda por ILIKE y resumen estadístico agrupado por especie".
- **Resultado:** Se adoptaron las funciones `buscar_pacientes()`, `generar_numero_atencion()`, `registrar_paciente()` y `resumen_por_especie()` provistas en la pauta de la asignatura, guardándolas formalmente en el archivo `sql/funciones.sql`.
- **Verificación:** Al ejecutar inicialmente `SELECT * FROM resumen_por_especie()` en Neon obtuvimos el error `SQLSTATE 42883 (function does not exist)`. Tras ejecutar el script completo de creación de funciones, la prueba arrojó correctamente el conteo (`Felino: 2`, `Canino: 1`) y la generación correlativa `2026-0001`.

## Entrada 2: Backend - Conexión de N-Capas con PostgreSQL
- **Paso:** Pasos 3, 4 y 5 (Repositorio, Servicio, Controlador y Rutas en Express).
- **Herramienta:** Gemini (diseño de prompt técnico) + GitHub Copilot (generación en código).
- **Prompt:** "Actualiza las 4 capas del backend en server/ para consumir las funciones de PostgreSQL: 1. En server/repositories/pacientes.repository.js agrega buscar(texto) llamando a SELECT * FROM buscar_pacientes($1), actualiza guardar(paciente) para usar SELECT * FROM registrar_paciente($1, $2, $3, $4, $5) y agrega obtenerResumen() llamando a SELECT * FROM resumen_por_especie(). 2. En server/services/pacientes.service.js expón los métodos correspondientes convirtiendo Number(fila.total). 3. En server/controllers/pacientes.controller.js añade buscar (req.query.q) y resumen. 4. En server/routes/pacientes.routes.js declara /buscar y /resumen antes de rutas dinámicas".
- **Resultado:** Copilot modificó los 4 archivos de la carpeta `server/`, conectando las consultas parametrizadas con `pool.query` hacia las funciones de Neon y asegurando que las rutas auxiliares no fueran interceptadas por identificadores dinámicos.
- **Verificación:** Revisión de compilación en el servidor y consulta directa en navegador a las rutas `https://vetchiloe.onrender.com/api/pacientes/resumen` y `https://vetchiloe.onrender.com/api/pacientes/buscar?q=mer`.

## Entrada 3: Frontend - Buscador Reactivo y Etiquetas de Resumen
- **Paso:** Pasos 1 y 2 (Componente BuscadorPaciente e integración con Tabla).
- **Herramienta:** Gemini (especificación de requerimientos) + GitHub Copilot (edición de componentes).
- **Prompt:** "Actúa como desarrollador full-stack y completa la Etapa 3: Capa de Presentación del proyecto vetChiloé según las especificaciones de la pauta del laboratorio: 1. Crea src/components/BuscadorPaciente.jsx controlado con input search. 2. Modifica src/services/pacienteService.js agregando buscarPacientes y getResumenEspecies. 3. Modifica src/App.jsx integrando estado busqueda, resumen, filtro reactivo en memoria, badges de resumen por especie, contador 'X de Y pacientes' y mensaje 'No se encontraron pacientes'".
- **Resultado:** Copilot generó `BuscadorPaciente.jsx`, `BuscadorPaciente.css`, actualizó `pacienteService.js` y adaptó `App.jsx` para sincronizar el estado reactivo sin recargas de página.
- **Verificación:** Ejecución de `npm run build` en consola finalizada en verde (8 pasos completados, 0 errores en los archivos modificados) y validación visual del filtro escribiendo caracteres en tiempo real.

## Entrada 4: Frontend & Base de Datos - Corrección de Discrepancia en Formulario
- **Paso:** Diagnóstico y corrección de persistencia en `FormularioPaciente.jsx`.
- **Herramienta:** Gemini.
- **Prompt:** "El navegador arroja 'Error al registrar el paciente en el servidor' al intentar guardar una nueva mascota desde el formulario web en producción".
- **Resultado:** Gemini analizó el código de `FormularioPaciente.jsx` e identificó que el formulario enviaba un campo llamado `motivo` en lugar de `diagnostico` (esperado por la función SQL), y que adjuntaba la imagen codificada en una cadena extensa Base64 que excedía la capacidad del servidor. Se corrigió el payload enviando el atributo `diagnostico` normalizado y asignando una URL por defecto según la especie si no hay URL remota válida.
- **Verificación:** Tras desplegar la corrección, se ingresó el paciente de prueba "Atenea" exitosamente, registrándose en Neon y manteniéndose persistente en la tabla tras refrescar el navegador.

---

## Reflexión en Pareja sobre el Uso de IA
Trabajar con IA en este proyecto nos demostró que su mayor utilidad está en acelerar la generación de código boilerplate y en conectar la arquitectura (diseñar prompts con Gemini para que Copilot escribiera exactamente los métodos de cada capa)[cite: 20]. Sin embargo, la IA falló en la coherencia entre capas cuando trabajamos fuera del flujo básico: en el frontend inicial se asumió que enviar `motivo` y una imagen en formato Base64 funcionaría, ignorando que la base de datos relacional en Neon requería estrictamente la columna `diagnostico` y un enlace de texto liviano[cite: 8]. Tuvimos que intervenir manualmente inspeccionando los logs y la estructura de la tabla para corregir los payloads. Aprendimos que la IA es un excelente asistente de ejecución técnica, pero que la integración de sistemas y la depuración de errores de persistencia dependen de la comprensión de la arquitectura por parte de los desarrolladores[cite: 6, 20].
