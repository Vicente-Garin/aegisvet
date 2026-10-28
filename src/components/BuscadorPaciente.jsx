import './BuscadorPaciente.css';

export function BuscadorPaciente({ texto, onCambiar }) {
  return (
    <input
      className="buscador-paciente"
      type="search"
      placeholder="Buscar por nombre o especie..."
      aria-label="Buscar pacientes por nombre o especie"
      value={texto}
      onChange={(event) => onCambiar(event.target.value)}
    />
  );
}
