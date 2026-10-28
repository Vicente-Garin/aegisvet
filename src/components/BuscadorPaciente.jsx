import { Search } from "lucide-react";

const BuscadorPaciente = ({ texto, onChange, className }) => {
  return (
    <label className={className}>
      <input
        className="min-w-0 flex-1"
        type="search"
        value={texto}
        placeholder="Ingresar nombre o especie"
        onChange={(e) => onChange(e.target.value)}
      />
      <Search className="mx-3 shrink-0" aria-hidden="true" size={14} />
    </label>
  );
};

export default BuscadorPaciente;
