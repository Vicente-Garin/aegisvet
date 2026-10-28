import pool from '../config/db.js';

class PacientesRepository {
  async obtenerTodos() {
    const resultado = await pool.query('SELECT * FROM pacientes ORDER BY id DESC');
    return resultado.rows;
  }

  async crear(datos) {
    const { nombre, especie, raza, edad, nombre_dueno, telefono_dueno } = datos;
    const consulta = `
      INSERT INTO pacientes (nombre, especie, raza, edad, nombre_dueno, telefono_dueno)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const valores = [nombre, especie, raza, edad, nombre_dueno, telefono_dueno];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
  }

  async eliminar(id) {
    const resultado = await pool.query('DELETE FROM pacientes WHERE id = $1 RETURNING *', [id]);
    return resultado.rows[0];
  }
}

export default new PacientesRepository();