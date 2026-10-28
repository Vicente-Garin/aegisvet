import * as repository from '../repositories/pacientes.repository.js';

export const listarPacientes = async () => {
  return await repository.obtenerTodos();
};

export const buscarPacientes = async (texto) => {
  return await repository.buscar((texto || '').trim());
};

export const registrarPaciente = async (datos) => {
  if (!datos.nombre || !datos.especie) {
    throw new Error('Nombre y especie son obligatorios');
  }
  return await repository.guardar(datos);
};

export const obtenerResumenEspecies = async () => {
  const filas = await repository.obtenerResumen();
  return filas.map(f => ({
    especie: f.especie,
    total: Number(f.total)
  }));
};

export default {
  listarPacientes,
  buscarPacientes,
  registrarPaciente,
  obtenerResumenEspecies
};
