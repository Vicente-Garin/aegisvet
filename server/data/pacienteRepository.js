import { pool } from './db.js'

const SELECT_PACIENTES = `
  SELECT p.id,
         p.nombre,
         p.especie,
         p.raza,
         p.diagnostico,
         p.edad,
         p.peso::float8 AS peso,
         COALESCE(to_char(p.fecha_nacimiento, 'YYYY-MM-DD'), '') AS fecha_nacimiento,
         d.nombre AS "dueño",
         d.rut,
         d.telefono,
         p.foto,
         p.numero_atencion
  FROM pacientes p
  JOIN duenos d ON d.id = p.dueno_id
`

export const obtenerPacientes = async () => {
  const { rows } = await pool.query(`${SELECT_PACIENTES} ORDER BY p.id`)
  return rows
}

export const obtenerPacientePorId = async id => {
  const idNumerico = Number(id)
  if (!Number.isInteger(idNumerico) || idNumerico < 1 || idNumerico > 2147483647) {
    return null
  }
  const { rows } = await pool.query(`${SELECT_PACIENTES} WHERE p.id = $1`, [idNumerico])
  return rows[0] || null
}

export const existeRut = async rut => {
  const { rowCount } = await pool.query('SELECT 1 FROM duenos WHERE rut = $1', [rut])
  return rowCount > 0
}

export const insertarPaciente = async paciente => {
  const cliente = await pool.connect()
  let nuevoId

  try {
    await cliente.query('BEGIN')

    const dueno = await cliente.query(
      `INSERT INTO duenos (nombre, rut, telefono)
       VALUES ($1, $2, $3)
       ON CONFLICT (rut) DO UPDATE
         SET nombre = EXCLUDED.nombre, telefono = EXCLUDED.telefono
       RETURNING id`,
      [paciente['dueño'], paciente.rut, paciente.telefono]
    )

    const nuevo = await cliente.query(
      `INSERT INTO pacientes
         (nombre, especie, raza, diagnostico, edad, peso,
          fecha_nacimiento, foto, dueno_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        paciente.nombre, paciente.especie, paciente.raza, paciente.diagnostico,
        paciente.edad, paciente.peso, paciente.fecha_nacimiento || null,
        paciente.foto, dueno.rows[0].id
      ]
    )

    nuevoId = nuevo.rows[0].id
    await cliente.query('COMMIT')
  } catch (error) {
    await cliente.query('ROLLBACK')
    throw error
  } finally {
    cliente.release()
  }

  return obtenerPacientePorId(nuevoId)
}