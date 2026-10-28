const service = require('../services/pacientes.service');

const listar = async (req, res) => {
  try {
    const data = await service.listarPacientes();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const buscar = async (req, res) => {
  try {
    const texto = req.query.q || '';
    const data = await service.buscarPacientes(texto);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registrar = async (req, res) => {
  try {
    const data = await service.registrarPaciente(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resumen = async (req, res) => {
  try {
    const data = await service.obtenerResumenEspecies();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listar,
  buscar,
  registrar,
  resumen
};
