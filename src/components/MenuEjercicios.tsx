import { useState, useMemo } from "react";

interface MenuEjerciciosProps {
    ejercicios: any[];
    onSeleccionar: (ejercicio: any) => void;
    onCerrar: () => void;
}

const MenuEjercicios = ({ ejercicios, onSeleccionar, onCerrar }: MenuEjerciciosProps) => {
  const [busqueda, setBusqueda] = useState('');
  const [grupo, setGrupo] = useState('');
  const [pagina, setPagina] = useState(1);
  const ejerciciosPorPagina = 10;

  const gruposMusculares = useMemo(() => {
    const grupos = [...new Set(ejercicios.map(e => e.bodyPart))];
    return grupos.sort();
  }, [ejercicios]);

  const ejerciciosFiltrados = useMemo(() => {
    let filtrados = ejercicios;

    if (grupo) {
      filtrados = filtrados.filter(e => e.bodyPart === grupo);
    }

    if (busqueda.trim() !== '') {
      filtrados = filtrados.filter(e =>
        e.name.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    return filtrados.sort((a, b) => a.name.localeCompare(b.name));
  }, [ejercicios, grupo, busqueda]);

  const totalPaginas = Math.ceil(ejerciciosFiltrados.length / ejerciciosPorPagina);
  const ejerciciosPagina = ejerciciosFiltrados.slice(
    (pagina - 1) * ejerciciosPorPagina,
    pagina * ejerciciosPorPagina
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-start pt-20">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-xl shadow-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Buscar ejercicios</h2>
          <button onClick={onCerrar} className="text-red-400 hover:text-red-600">Cerrar</button>
        </div>

        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(1);
          }}
        />

        <select
          className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={grupo}
          onChange={(e) => {
            setGrupo(e.target.value);
            setPagina(1);
          }}
        >
          <option value="">Todos los grupos musculares</option>
          {gruposMusculares.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <ul className="max-h-64 overflow-y-auto space-y-2 mb-4">
          {ejerciciosPagina.map((ej) => (
            <li key={ej.id}>
              <button
                className="w-full text-left hover:underline"
                onClick={() => onSeleccionar(ej)}
              >
                {ej.name}
              </button>
            </li>
          ))}
          {ejerciciosPagina.length === 0 && (
            <li className="text-gray-400 text-sm">No se encontraron ejercicios</li>
          )}
        </ul>

        <div className="flex justify-between text-sm">
          <button
            disabled={pagina === 1}
            onClick={() => setPagina(p => p - 1)}
            className="disabled:text-gray-600 hover:underline"
          >
            Anterior
          </button>
          <span>Página {pagina} de {totalPaginas}</span>
          <button
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(p => p + 1)}
            className="disabled:text-gray-600 hover:underline"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuEjercicios;
