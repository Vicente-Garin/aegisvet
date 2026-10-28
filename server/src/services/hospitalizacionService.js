import hospitalizacionesRepository from '../repositories/hospitalizaciones.repository.js';

export default class HospitalizacionService {
  async listarHospitalizaciones() {
    return await hospitalizacionesRepository.obtenerTodas();
  }

  async registrarIngreso(datos) {
    if (!datos.paciente_id) {
      throw new Error('El ID del paciente es obligatorio.');
    }
    if (!datos.motivo) {
      throw new Error('El motivo de hospitalización es obligatorio.');
    }

    return await hospitalizacionesRepository.crear(datos);
  }

  async darDeAlta(id) {
    if (!id) {
      throw new Error('Se requiere el ID para dar de alta.');
    }
    return await hospitalizacionesRepository.eliminar(id);
  }
}