import { pacientesRepository } from '../repositories/pacientes.repository.js';

export class PacientesService {
  async obtenerTodos() {
    return await pacientesRepository.obtenerTodos();
  }

  async crear(datosPaciente) {
    return await pacientesRepository.crear(datosPaciente);
  }

  async eliminar(id) {
    return await pacientesRepository.eliminar(id);
  }
}