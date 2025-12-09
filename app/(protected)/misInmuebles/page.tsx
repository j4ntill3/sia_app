"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";
import InmuebleCard from "@/app/components/InmuebleCard";
import type { Inmueble } from "@/types/inmueble";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import { downloadCSV } from "@/lib/csv-export";
import { useSearchWithPagination } from "@/hooks/useSearchWithPagination";

const misInmuebles = () => {
  const [session, setSession] = useState<any>(null);
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
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
    inmuebles,
    [
      'direccion',
      'barrio.nombre',
      'zona.nombre',
      'localidad.nombre',
      'categoria.categoria'
    ],
    12 // items por página
  );

  // Función para autenticar al usuario
  const authenticateUser = async () => {
    try {
      const sessionData = await getSession();

      if (!sessionData) {
        setError("No autenticado. Por favor inicia sesión.");
        return null;
      }

      if (sessionData.user.role !== "agente") {
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

  // Función para obtener todos los inmuebles
  const fetchMisInmuebles = async () => {
    try {
      const response = await fetch('/api/misInmuebles?all=true');
      if (!response.ok) {
        throw new Error("Error al obtener los inmuebles.");
      }
      const inmueblesData = await response.json();
      setInmuebles(inmueblesData.data || []);
    } catch (err) {
      setError("Error al obtener los inmuebles.");
    }
  };

  useEffect(() => {
    const init = async () => {
      const userSession = await authenticateUser();
      if (userSession) {
        await fetchMisInmuebles();
      }
      setIsLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownloadCSV = async (exportAll: boolean = true) => {
    setIsExporting(true);
    try {
      const dataToExport = exportAll ? inmuebles : (searchQuery ? filteredData : paginatedData);

      const filename = exportAll
        ? "mis-inmuebles-todos.csv"
        : searchQuery
          ? `mis-inmuebles-filtrados.csv`
          : `mis-inmuebles-pagina-${currentPage}.csv`;

      downloadCSV(
        dataToExport,
        ["ID", "Dirección", "Categoría", "Localidad", "Zona", "Barrio", "Dormitorios", "Baños", "Superficie", "Cochera", "Estado"],
        filename,
        (inmueble) => [
          inmueble.id,
          inmueble.direccion,
          inmueble.categoria?.categoria || "",
          inmueble.localidad?.nombre || "",
          inmueble.zona?.nombre || "",
          inmueble.barrio?.nombre || "",
          inmueble.dormitorios,
          inmueble.banos,
          inmueble.superficie,
          inmueble.cochera ? "Sí" : "No",
          inmueble.estado?.estado || ""
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

  // Renderizar los inmuebles
  return (
    <div className="min-h-[calc(100vh-80px-56px)] bg-gray-100 p-4">
      <div className="w-full px-2">
        {/* Título de bienvenida */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Mis Inmuebles Asignados
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona las propiedades que tienes asignadas
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto">
              <SearchBar
                value={searchQuery}
                onSearch={setSearchQuery}
                placeholder="Buscar inmuebles por dirección, barrio, zona, localidad, categoría..."
                totalCount={inmuebles.length}
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
                        <p className="text-sm text-gray-500">Todos los registros ({inmuebles.length})</p>
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
                          {searchQuery ? 'Exportar resultados de búsqueda' : 'Exportar resultados actuales'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {totalItems} {totalItems === 1 ? 'registro' : 'registros'}
                          {searchQuery && ` (filtrado por "${searchQuery}")`}
                        </p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Grid de inmuebles */}
        <div className="mb-6">
          {paginatedData.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium">
                No se encontraron inmuebles
              </p>
              <p className="text-gray-500 mt-2">
                {searchQuery
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No tienes inmuebles asignados en este momento"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {paginatedData.map((inmueble) => (
                <InmuebleCard key={inmueble.id} inmueble={inmueble} />
              ))}
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-md p-4">
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
  );
};

export default misInmuebles;
