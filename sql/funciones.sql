-- 1. Función de búsqueda flexible
CREATE OR REPLACE FUNCTION buscar_pacientes(p_texto TEXT)
RETURNS SETOF pacientes AS $$
SELECT *
FROM pacientes
WHERE nombre ILIKE '%' || p_texto || '%'
   OR especie ILIKE '%' || p_texto || '%'
ORDER BY nombre;
$$ LANGUAGE sql STABLE;

-- 2. Secuencia y generador de número de atención correlativo
CREATE SEQUENCE IF NOT EXISTS seq_atencion START 1;

CREATE OR REPLACE FUNCTION generar_numero_atencion()
RETURNS TEXT AS $$
SELECT EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
|| '-' || LPAD(nextval('seq_atencion')::TEXT, 4, '0');
$$ LANGUAGE sql VOLATILE;

-- 3. Función de registro con reglas de negocio
CREATE OR REPLACE FUNCTION registrar_paciente(
    p_nombre TEXT, 
    p_especie TEXT, 
    p_edad TEXT,
    p_diagnostico TEXT, 
    p_foto TEXT
) RETURNS pacientes AS $$
INSERT INTO pacientes (
    nombre, 
    numero_atencion, 
    especie,
    edad, 
    diagnostico, 
    foto
)
VALUES (
    TRIM(p_nombre), 
    generar_numero_atencion(),
    INITCAP(TRIM(p_especie)), 
    p_edad, 
    p_diagnostico, 
    p_foto
)
RETURNING *;
$$ LANGUAGE sql;

-- 4. Función de resumen estadístico por especie
CREATE OR REPLACE FUNCTION resumen_por_especie()
RETURNS TABLE (especie VARCHAR, total BIGINT) AS $$
SELECT p.especie, COUNT(*)
FROM pacientes p
GROUP BY p.especie
ORDER BY 2 DESC;
$$ LANGUAGE sql STABLE;
