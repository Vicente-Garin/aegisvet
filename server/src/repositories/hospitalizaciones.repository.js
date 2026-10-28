import pool from '../config/db.js';

class HospitalizacionesRepository {
  async obtenerTodas() {
    const query = `
      SELECT 
        h.id,
        h.paciente_id,
        h.motivo,
        h.estado,
        h.cuidados,
        h.fecha_ingreso,
        p.nombre AS paciente,
        p.especie,
        p.nombre_dueno AS tutor,
        p.telefono AS contacto
      FROM hospitalizaciones h
      JOIN pacientes p ON h.paciente_id = p.id
      ORDER BY h.id DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  async crear(hospitalizacion) {
    const { paciente_id, motivo, estado, cuidados } = hospitalizacion;
    const query = `
      INSERT INTO hospitalizaciones (paciente_id, motivo, estado, cuidados)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [paciente_id, motivo, estado || 'En observación / Estable', cuidados];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async eliminar(id) {
    const query = 'DELETE FROM hospitalizaciones WHERE id = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

export default new HospitalizacionesRepository();