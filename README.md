# vetChiloé (AegisVet) - Sistema de Gestión Veterinaria

Proyecto desarrollado para la asignatura **Tecnologías Web y Móviles**. Implementación de una arquitectura desacoplada multicapa (Frontend SPA, Backend API REST y Base de Datos Relacional Serverless).

---

## Enlaces de Despliegue en Producción
- **Frontend (Vercel):** https://aegisvet.vercel.app
- **Backend API (Render Web Service):** https://vetchiloe.onrender.com/api/pacientes
- **Base de Datos:** PostgreSQL en Neon Cloud (Serverless)

---

## Arquitectura y Componentes
- **Capa de Presentación (Frontend):** React + Vite. Incluye buscador reactivo en vivo por nombre y especie, contador dinámico, badges estadísticos por especie y visualización de fichas clínicas.
- **Capa de Negocio y Servicios (Backend):** Node.js + Express en arquitectura N-Capas (rutas, controladores, servicios y repositorios desacoplados).
- **Capa de Datos (Database):** PostgreSQL en Neon con funciones almacenadas (`buscar_pacientes`, `generar_numero_atencion`, `registrar_paciente`, `resumen_por_especie`) y correlativo automático con formato `YYYY-0001`.

---

## Documentación y Cumplimiento
- Funciones SQL: `sql/funciones.sql`
- Bitácora de Inteligencia Artificial Generativa: `docs/bitacora-ia.md`
