const API_URL = import.meta.env.VITE_API_URL || 'https://vetchiloe.onrender.com/api/pacientes';

const obtenerJSON = async (url, options, mensajeError) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || mensajeError);
  }
  return await res.json();
};

export const getPacientes = async () => {
  return obtenerJSON(API_URL, undefined, 'Error al obtener la lista de pacientes');
};

export const buscarPacientes = async (q) => {
  return obtenerJSON(
    `${API_URL}/buscar?q=${encodeURIComponent(q)}`,
    undefined,
    'Error al buscar pacientes'
  );
};

export const getResumenEspecies = async () => {
  return obtenerJSON(
    `${API_URL}/resumen`,
    undefined,
    'Error al obtener el resumen por especie'
  );
};

export const createPaciente = async (paciente) => {
  return obtenerJSON(
    API_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paciente)
    },
    'Error al registrar el paciente en el servidor'
  );
};

export const pacienteService = {
  obtenerPacientes: getPacientes,
  registrarPaciente: createPaciente,
  getPacientes,
  buscarPacientes,
  getResumenEspecies,
  createPaciente
};

export default pacienteService;
