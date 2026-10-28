import PacientesService from '../services/pacientes.service.js';

const service = new PacientesService();

export const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await service.obtenerTodos();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearPaciente = async (req, res) => {
  try {
    const nuevoPaciente = await service.crear(req.body);
    res.status(201).json(nuevoPaciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await service.eliminar(id);
    res.json(eliminado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};