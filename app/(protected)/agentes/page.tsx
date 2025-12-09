"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";
import AgenteItem from "@/app/components/AgenteItem";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import { downloadCSV, formatDateForCSV } from "@/lib/csv-export";
import { useSearchWithPagination } from "@/hooks/useSearchWithPagination";

const Agentes = () => {
  const [session, setSession] = useState<any>(null);
  const [agentes, setAgentes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Hook de búsqueda con paginación
  const {
    filteredData,
    paginatedData,
    searchQuery,
    setSearchQuery,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setCurrentPage,
  } = useSearchWithPagination(
    agentes,
    [
      'persona.nombre',
      'persona.apellido',
      'persona.dni',
      'empleado.cuit',
      'persona.correo',
      'persona.telefono'
    ],
    10 // items por página
  );

  const authenticateUser = async () => {
    try {
      const sessionData = await getSession();

      if (!sessionData) {
        setError("No autenticado. Por favor inicia sesión.");
        return null;
      }

      if (sessionData.user.role !== "administrador") {
        setError("No autorizado para acceder a esta página.");
        return null;
      }

      setSession(sessionData);
      return sessionData;
    } catch (err) {
      setError("Error al autenticar al usuario.");
      return null;
    }
  };

  // Función para obtener los agentes
  const fetchAgentes = async () => {
    try {
      const response = await fetch("/api/agentes");
      if (!response.ok) {
        throw new Error("Error al obtener los agentes.");
      }

      const agentesData = await response.json();
      setAgentes(agentesData.data || []);
    } catch (err) {
      setError("Error al obtener los agentes.");
    }
  };

  useEffect(() => {
    const init = async () => {
      const userSession = await authenticateUser();

      if (userSession) {
        await fetchAgentes();
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const handleDownloadCSV = async (exportAll: boolean = true) => {
    setIsExporting(true);
    try {
      const dataToExport = exportAll ? agentes : (searchQuery ? filteredData : paginatedData);

      const filename = exportAll
        ? "agentes-todos.csv"
        : searchQuery
          ? `agentes-filtrados.csv`
          : `agentes-pagina-${currentPage}.csv`;

      downloadCSV(
        dataToExport,
        ["ID", "Nombre", "Apellido", "DNI", "CUIT", "Teléfono", "Fecha de Alta", "Email", "Estado"],
        filename,
        (agente) => [
          agente.empleado?.id || "",
          agente.persona?.nombre || "",
          agente.persona?.apellido || "",
          agente.persona?.dni || "",
          agente.empleado?.cuit || "",
          agente.persona?.telefono || "",
          formatDateForCSV(agente.empleado?.fecha_ingreso),
          agente.persona?.correo || "",
          agente.empleado?.fecha_egreso ? "Inactivo" : "Activo"
        ]
      );
    } catch (error) {
      console.error("Error al exportar CSV:", error);
      alert("Error al exportar los datos");
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  // Mostrar un mensaje de carga mientras se resuelve la sesión y los datos
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Mostrar errores si ocurren
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Mostrar mensaje si no hay sesión
  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No autenticado. Por favor inicia sesión.
        </p>
      </div>
    );
  }

  // Renderizar la tabla de agentes
  return (
    <div className="min-h-[calc(100vh-80px-56px)] bg-gray-100 p-4">
      <div className="w-full px-2">
        {/* Título de bienvenida */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Agentes
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona todos los agentes del sistema
          </p>
        </div>

        {/* Barra de búsqueda y acciones */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto">
              <SearchBar
                value={searchQuery}
                onSearch={setSearchQuery}
                placeholder="Buscar agentes por nombre, DNI, CUIT, correo, teléfono..."
                totalCount={agentes.length}
                filteredCount={totalItems}
              />
            </div>
            <div className="flex-1"></div>
            <button
              onClick={() => {
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Ver Todos
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exportando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Exportar CSV
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>

              {showExportMenu && !isExporting && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                    <button
                      onClick={() => handleDownloadCSV(true)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 border-b border-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">Exportar todos</p>
                        <p className="text-sm text-gray-500">Todos los registros ({agentes.length})</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDownloadCSV(false)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">
                          {searchQuery ? 'Exportar resultados de búsqueda' : 'Exportar página actual'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchQuery
                            ? `${totalItems} ${totalItems === 1 ? 'registro' : 'registros'} (filtrado por "${searchQuery}")`
                            : `Página ${currentPage} (${paginatedData.length} ${paginatedData.length === 1 ? 'registro' : 'registros'})`
                          }
                        </p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contenedor principal */}
        <div className="bg-white p-6 shadow-lg rounded-lg">

          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full table-auto bg-white border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                    Foto
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                    CUIT
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                    Fecha de Alta
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                    Teléfono
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                    Estado
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-600">
                      {searchQuery ? "No se encontraron agentes con ese criterio de búsqueda" : "No hay agentes registrados"}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((agente) => (
                    <AgenteItem key={agente.empleado.id} agente={agente} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onChange={setCurrentPage}
                totalItems={totalItems}
                pageSize={itemsPerPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agentes;
