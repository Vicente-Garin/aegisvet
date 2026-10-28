const API_URL = 'https://vetchiloe-psbq.onrender.com/api/hospitalizaciones';

export const obtenerHospitalizados = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener la lista de hospitalizados');
  return await res.json();
};

export const ingresarHospitalizacion = async (datos) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error('Error al ingresar a hospitalización');
  return await res.json();
};

export const darDeAltaPaciente = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al dar de alta al paciente');
  return await res.json();
};