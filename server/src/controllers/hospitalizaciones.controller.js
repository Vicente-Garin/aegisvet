import HospitalizacionService from '../services/hospitalizacionService.js';

const servicioHospitalizacion = new HospitalizacionService();

// Obtiene la lista completa de hospitalizaciones
export const getHospitalizaciones = async (req, res) => {
  try {
    const listaHospitalizaciones = await servicioHospitalizacion.listarHospitalizaciones();
    res.json(listaHospitalizaciones);
  } catch (error) {
    console.error('Error al obtener hospitalizaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Registra el ingreso de una nueva hospitalizaciones
export const createHospitalizacion = async (req, res) => {
  try {
    const nuevaHospitalizacion = await servicioHospitalizacion.registrarIngreso(req.body);
    res.status(201).json(nuevaHospitalizacion);
  } catch (error) {
    console.error('Error al registrar hospitalización:', error);
    res.status(400).json({ error: error.message || 'Error interno del servidor' });
  }
};

// Registra el alta o eliminación de la hospitalización
export const deleteHospitalizacion = async (req, res) => {
  try {
    const { id } = req.params;
    await servicioHospitalizacion.darDeAlta(id);
    res.json({ mensaje: 'Paciente dado de alta correctamente' });
  } catch (error) {
    console.error('Error al dar de alta:', error);
    res.status(400).json({ error: error.message || 'Error interno del servidor' });
  }
};