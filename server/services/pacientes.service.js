const repository = require('../repositories/pacientes.repository');

const listarPacientes = async () => {
  return await repository.obtenerTodos();
};

const buscarPacientes = async (texto) => {
  return await repository.buscar((texto || '').trim());
};

const registrarPaciente = async (datos) => {
  if (!datos.nombre || !datos.especie) {
    throw new Error('Nombre y especie son obligatorios');
  }
  return await repository.guardar(datos);
};

const obtenerResumenEspecies = async () => {
  const filas = await repository.obtenerResumen();
  return filas.map(f => ({
    especie: f.especie,
    total: Number(f.total)
  }));
};

module.exports = {
  listarPacientes,
  buscarPacientes,
  registrarPaciente,
  obtenerResumenEspecies
};
