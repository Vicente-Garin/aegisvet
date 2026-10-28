import { useEffect, useRef, useState } from 'react'
import './App.css'
import FlipCard from './components/FlipCard.jsx'
import FormularioPaciente from './components/FormularioPaciente.jsx'
import { guardarPaciente, obtenerPacientes } from './data/pacienteApi.js'
const imagenesPacientes = {
  'sin-foto.svg': imagenSinFoto
};

const resolverFotoPaciente = foto => imagenesPacientes[foto] || foto || imagenSinFoto;

const formatearFecha = fecha => fecha.split('-').reverse().join('/');
const formatearEdad = edad => typeof edad === 'number'
  ? `${edad} ${edad === 1 ? 'año' : 'años'}`
  : edad;
const formatearPeso = peso => peso === null || peso === undefined || peso === ''
  ? 'No registrado'
  : `${peso} kg`;

const normalizarTexto = texto => texto
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('es');

const leerTemaGuardado = () => {
  try {
    return window.localStorage.getItem('vetchiloe-tema') === 'oscuro' ? 'oscuro' : 'claro';
  } catch (error) {
    console.error('No se pudo leer el tema guardado.', error);
    return 'claro';
  }
};

// Esta función muestra el estado del componente para almacenar
// la lista de pacientes de la veterinaria
function App() {
  const [pacientes, setPacientes] = useState([]);
  const [cargandoPacientes, setCargandoPacientes] = useState(true);
  const [errorPacientes, setErrorPacientes] = useState('');
  const [errorRegistro, setErrorRegistro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [tema, setTema] = useState(leerTemaGuardado);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const botonCerrarFichaRef = useRef(null);
  const botonAgregarRef = useRef(null);
  const botonCerrarFormularioRef = useRef(null);

  useEffect(() => {
    let cancelado = false;

    const cargarPacientes = async () => {
      try {
        const pacientesGuardados = await obtenerPacientes();
        if (!cancelado) {
          setPacientes(pacientesGuardados.map(paciente => ({
            ...paciente,
            foto: resolverFotoPaciente(paciente.foto)
          })));
          setErrorPacientes('');
        }
      } catch (error) {
        console.error('No se pudieron cargar los pacientes.', error);
        if (!cancelado) setErrorPacientes(error.message);
      } finally {
        if (!cancelado) setCargandoPacientes(false);
      }
    };

    cargarPacientes();
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    try {
      window.localStorage.setItem('vetchiloe-tema', tema);
    } catch (error) {
      console.error('No se pudo guardar el tema seleccionado.', error);
    }
  }, [tema]);

  useEffect(() => {
    if (!pacienteSeleccionado) return undefined;

    const elementoAnterior = document.activeElement;
    botonCerrarFichaRef.current?.focus();
    const manejarTecla = evento => {
      if (evento.key === 'Escape') setPacienteSeleccionado(null);
    };
    document.addEventListener('keydown', manejarTecla);

    return () => {
      document.removeEventListener('keydown', manejarTecla);
      if (elementoAnterior instanceof HTMLElement && elementoAnterior.isConnected) {
        elementoAnterior.focus();
      }
    };
  }, [pacienteSeleccionado]);

  useEffect(() => {
    if (!mostrarFormulario) return undefined;

    const botonAbrir = botonAgregarRef.current;
    const overflowAnterior = document.body.style.overflow;
    botonCerrarFormularioRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const manejarTecla = evento => {
      if (evento.key === 'Escape') setMostrarFormulario(false);
    };
    document.addEventListener('keydown', manejarTecla);

    return () => {
      document.removeEventListener('keydown', manejarTecla);
      document.body.style.overflow = overflowAnterior;
      if (botonAbrir?.isConnected) botonAbrir.focus();
    };
  }, [mostrarFormulario]);

  const pacientesFiltrados = pacientes.filter(paciente => {
    const datosPaciente = [
      paciente.nombre,
      paciente.especie,
      paciente.raza,
      paciente.diagnostico,
      paciente.dueño,
      paciente.numero_atencion
    ].filter(Boolean).join(' ');
    return normalizarTexto(datosPaciente).includes(normalizarTexto(busqueda.trim()));
  });

  const onVerFicha = paciente => setPacienteSeleccionado(paciente);

  const agregarPaciente = async (datosFormulario, formularioElemento) => {
    setErrorRegistro('');
    try {
      const resultado = await guardarPaciente(datosFormulario);
      if (!resultado.ok) {
        const entradaError = formularioElemento.elements.namedItem(resultado.error.campo);
        entradaError.setCustomValidity(resultado.error.mensaje);
        entradaError.reportValidity();
        return false;
      }

      const paciente = {
        ...resultado.paciente,
        foto: resolverFotoPaciente(resultado.paciente.foto)
      };
      setPacientes(actuales => [...actuales, paciente]);
      setMostrarFormulario(false);
      return true;
    } catch (error) {
      console.error('No se pudo guardar el paciente.', error);
      setErrorRegistro(error.message);
      return false;
    }
  };

  return (
    <div className="contenedor-principal">
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div>
            <h1 className='TituloPagina'>Sistema de Información - VetChiloé</h1>
            <p>Plataforma de control y seguimiento de pacientes</p>
          </div>
          <button
            className="boton-tema"
            type="button"
            aria-label={`Cambiar a modo ${tema === 'claro' ? 'noche' : 'día'}`}
            aria-pressed={tema === 'oscuro'}
            onClick={() => setTema(actual => actual === 'claro' ? 'oscuro' : 'claro')}
          >
            {tema === 'claro' ? '☾ Modo noche' : '☀ Modo día'}
          </button>
        </div>
      </header>

      <main>
        <section className="seccion-pacientes" aria-labelledby="titulo-pacientes">
          <div className="encabezado-pacientes">
            <div>
              <h2 id="titulo-pacientes">Lista de Pacientes Registrados</h2>
              <p className="contador-pacientes">
                {pacientesFiltrados.length} de {pacientes.length} pacientes
              </p>
            </div>
            <label className="buscador-pacientes">
              <span className="texto-solo-lectores">Buscar pacientes</span>
              <span className="icono-busqueda" aria-hidden="true">⌕</span>
              <input
                type="search"
                value={busqueda}
                onChange={evento => setBusqueda(evento.target.value)}
                placeholder="Buscar por nombre, especie o dueño..."
              />
              {busqueda && (
                <button
                  className="limpiar-busqueda"
                  type="button"
                  aria-label="Limpiar búsqueda"
                  onClick={() => setBusqueda('')}
                >
                  ×
                </button>
              )}
            </label>
          </div>

          {errorPacientes ? (
            <p className="sin-pacientes" role="alert">{errorPacientes}</p>
          ) : cargandoPacientes ? (
            <p className="sin-pacientes" role="status">Cargando pacientes...</p>
          ) : pacientesFiltrados.length > 0 ? (
            <div className="tabla-pacientes-contenedor">
              <table className="tabla-pacientes">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Paciente</th>
                    <th scope="col">Especie</th>
                    <th scope="col">Raza</th>
                    <th scope="col">Diagnóstico</th>
                    <th scope="col">Edad</th>
                    <th scope="col">Peso</th>
                    <th scope="col">Dueño</th>
                    <th scope="col">N° atención</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientesFiltrados.map(paciente => (
                    <tr
                      key={paciente.id}
                      tabIndex={0}
                      aria-label={`Abrir carnet de ${paciente.nombre}`}
                      onClick={() => onVerFicha(paciente)}
                      onKeyDown={evento => {
                        if (evento.key === 'Enter' || evento.key === ' ') {
                          evento.preventDefault();
                          onVerFicha(paciente);
                        }
                      }}
                    >
                      <td>{paciente.id}</td>
                      <th scope="row">{paciente.nombre}</th>
                      <td>{paciente.especie}</td>
                      <td>{paciente.raza}</td>
                      <td>{paciente.diagnostico || 'No registrado'}</td>
                      <td>{formatearEdad(paciente.edad)}</td>
                      <td>{formatearPeso(paciente.peso)}</td>
                      <td>{paciente.dueño}</td>
                      <td>{paciente.numero_atencion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="sin-pacientes" role="status">
              {pacientes.length === 0
                ? 'Aún no hay pacientes registrados.'
                : `No se encontraron pacientes para “${busqueda}”.`}
            </p>
          )}
        </section>

        {pacienteSeleccionado && (
          <div
            className="ficha-paciente-fondo"
            onClick={evento => {
              if (evento.target === evento.currentTarget) setPacienteSeleccionado(null);
            }}
          >
            <section
              className="ficha-paciente-dialogo"
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-ficha-paciente"
            >
              <div className="ficha-paciente-encabezado">
                <h2 id="titulo-ficha-paciente">Ficha de {pacienteSeleccionado.nombre}</h2>
                <button
                  ref={botonCerrarFichaRef}
                  className="boton-cerrar-ficha"
                  type="button"
                  aria-label="Cerrar ficha del paciente"
                  onClick={() => setPacienteSeleccionado(null)}
                >
                  ×
                </button>
              </div>
              <FlipCard
                width={300}
                height={400}
                axis="y"
                flipOnClick={true}
                respectReducedMotion={false}
                background={tema === 'oscuro' ? '#17382c' : '#e4f2e9'}
                color={tema === 'oscuro' ? '#e5f5e9' : '#183b2b'}
                ariaLabel={`Tarjeta de ${pacienteSeleccionado.nombre}. Haz clic para ver sus datos.`}
                front={
                  <div className="frente-ficha-paciente">
                    <img src={pacienteSeleccionado.foto} alt={pacienteSeleccionado.nombre} />
                    <div className="nombre-frente-ficha">{pacienteSeleccionado.nombre}</div>
                  </div>
                }
                back={
                  <div className="reverso-ficha-paciente">
                    <h3>{pacienteSeleccionado.nombre}</h3>
                    <p>ID: {pacienteSeleccionado.id}</p>
                    <p>Especie: {pacienteSeleccionado.especie}</p>
                    <p>Raza: {pacienteSeleccionado.raza}</p>
                    <p>Diagnóstico: {pacienteSeleccionado.diagnostico || 'No registrado'}</p>
                    <p>Edad: {formatearEdad(pacienteSeleccionado.edad)}</p>
                    <p>Peso: {formatearPeso(pacienteSeleccionado.peso)}</p>
                    {pacienteSeleccionado.fecha_nacimiento && <p>Fecha de nacimiento: {formatearFecha(pacienteSeleccionado.fecha_nacimiento)}</p>}
                    <p>Dueño: {pacienteSeleccionado.dueño}</p>
                    {pacienteSeleccionado.rut && <p>RUT: {pacienteSeleccionado.rut}</p>}
                    {pacienteSeleccionado.telefono && <p>Teléfono: {pacienteSeleccionado.telefono}</p>}
                    <p>N° Atención: {pacienteSeleccionado.numero_atencion}</p>
                  </div>
                }
              />
            </section>
          </div>
        )}
      </main>

      <button
        ref={botonAgregarRef}
        className="boton-agregar-flotante"
        type="button"
        aria-haspopup="dialog"
        aria-label="Agregar paciente"
        onClick={() => {
          setErrorRegistro('');
          setMostrarFormulario(true);
        }}
      >
        <span aria-hidden="true">+</span>
        Agregar paciente
      </button>

      {mostrarFormulario && (
        <div
          className="modal-formulario-fondo"
          onClick={evento => {
            if (evento.target === evento.currentTarget) setMostrarFormulario(false);
          }}
        >
          <div className="modal-formulario" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-formulario">
            <FormularioPaciente
              onGuardar={agregarPaciente}
              onCerrar={() => setMostrarFormulario(false)}
              botonCerrarRef={botonCerrarFormularioRef}
              errorEnvio={errorRegistro}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;