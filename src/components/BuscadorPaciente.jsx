import Search from "lucide-react"

const BuscadorPaciente = ({texto, onChange}) => {
    return (
        <input 
        className="border-2 rounded-2xl "
        type="search" 
        value={texto}
        placeholder="Ingresar Datos para Busqueda"
        onChange={(e) => {onChange(e.target.value)} }
        />
    );

}

export default BuscadorPaciente;