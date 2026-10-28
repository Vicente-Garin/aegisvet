import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const obtenerTodos = async () => {
  const resultado = await pool.query('SELECT * FROM pacientes ORDER BY id DESC');
  return resultado.rows;
};

export const buscar = async (texto) => {
  const resultado = await pool.query('SELECT * FROM buscar_pacientes($1)', [texto]);
  return resultado.rows;
};

export const guardar = async (paciente) => {
  const query = 'SELECT * FROM registrar_paciente($1, $2, $3, $4, $5)';
  const valores = [
    paciente.nombre,
    paciente.especie,
    paciente.edad,
    paciente.diagnostico,
    paciente.foto
  ];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

export const obtenerResumen = async () => {
  const resultado = await pool.query('SELECT * FROM resumen_por_especie()');
  return resultado.rows;
};

export default {
  obtenerTodos,
  buscar,
  guardar,
  obtenerResumen
};
