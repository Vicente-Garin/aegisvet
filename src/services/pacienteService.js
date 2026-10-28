const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/pacientes';

export const obtenerPacientes = async () => {
  const respuesta = await fetch(API_URL);
  if (!respuesta.ok) {
    throw new Error('Error al consultar la lista de pacientes');
  }
  return await respuesta.json();
};

export const registrarPaciente = async (nuevoPaciente) => {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevoPaciente),
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo guardar la información del paciente');
  }

  return await respuesta.json();
};

export const eliminarPaciente = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo eliminar el paciente');
  }

  return await respuesta.json();
};