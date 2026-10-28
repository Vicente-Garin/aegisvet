import * as service from '../services/pacientes.service.js';

export const listar = async (req, res) => {
  try {
    const data = await service.listarPacientes();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscar = async (req, res) => {
  try {
    const texto = req.query.q || '';
    const data = await service.buscarPacientes(texto);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrar = async (req, res) => {
  try {
    const data = await service.registrarPaciente(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resumen = async (req, res) => {
  try {
    const data = await service.obtenerResumenEspecies();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  listar,
  buscar,
  registrar,
  resumen
};
