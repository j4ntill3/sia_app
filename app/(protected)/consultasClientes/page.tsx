"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";
import ConsultaClienteItem from "@/app/components/ConsultaClienteItem";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import { useRouter } from "next/navigation";
import { ConsultaCliente } from "@/types/consulta_cliente";
import { downloadCSV, formatDateForCSV } from "@/lib/csv-export";
import { useSearchWithPagination } from "@/hooks/useSearchWithPagination";

const Clientes = () => {
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<ConsultaCliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const router = useRouter();

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
    clientes,
    [
      'nombre',
      'apellido',
      'telefono',
      'correo',
      'descripcion'
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

  useEffect(() => {
    const init = async () => {
      const userSession = await authenticateUser();

      if (userSession) {
        await fetchClientes();
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch("/api/consultasClientes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClientes(data.data || []);
      } else {
        setError("Error al obtener los clientes.");
      }
    } catch (err) {
      console.error("Error al obtener clientes:", err);
      setError("Error al obtener los clientes.");
    }
  };

  const handleDownloadCSV = (exportAll: boolean = true) => {
    // Si exportAll es true, exportar todos los registros
    // Si exportAll es false:
    //   - Si hay búsqueda activa: exportar todos los resultados filtrados
    //   - Si NO hay búsqueda: exportar solo la página actual
    const dataToExport = exportAll
      ? clientes
      : (searchQuery ? filteredData : paginatedData);

    const filename = exportAll
      ? "consultas-clientes-todas.csv"
      : searchQuery
        ? `consultas-clientes-filtradas.csv`
        : `consultas-clientes-pagina-${currentPage}.csv`;

    downloadCSV(
      dataToExport,
      ["Nombre", "Apellido", "Teléfono", "Correo", "Fecha", "Descripción", "ID Inmueble", "Tipo Usuario"],
      filename,
      (cliente) => [
        cliente.nombre,
        cliente.apellido,
        cliente.telefono,
        cliente.correo,
        formatDateForCSV(cliente.fecha),
        cliente.descripcion || "",
        cliente.inmueble_id,
        cliente.agente_id ? `Agente (ID: ${cliente.agente_id})` : "Usuario Público"
      ]
    );
    setShowExportMenu(false);
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No autenticado. Por favor inicia sesión.
        </p>
      </div>
    );
  }

  const handleView = (id: string) => {
    router.push(`/consulta/${id}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">No hay consultas registradas</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px-56px)] bg-gray-100 p-4">
      <div className="w-full px-2">
        {/* Título de bienvenida */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Consultas de Clientes
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona todas las consultas recibidas
          </p>
        </div>

        {/* Contenedor principal */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          {/* Barra de búsqueda y botones */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="w-full sm:w-auto">
              <SearchBar
                value={searchQuery}
                onSearch={setSearchQuery}
                placeholder="Buscar consultas por nombre, apellido, teléfono, correo, descripción..."
                totalCount={clientes.length}
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
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Exportar CSV
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showExportMenu && (
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
                        <p className="text-sm text-gray-500">Todos los registros ({clientes.length})</p>
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

          {/* Mostrar información de resultados */}
          {searchQuery && (
            <div className="mb-4 text-sm text-gray-600">
              Se encontraron <span className="font-semibold">{totalItems}</span> consultas
              {searchQuery && <span> para "{searchQuery}"</span>}
            </div>
          )}

          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full table-auto bg-white border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                    Teléfono
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                    Fecha
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                    Descripción
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                    ID Inmueble
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                    Tipo Usuario
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-600">
                      {searchQuery ? "No se encontraron consultas con ese criterio de búsqueda" : "No hay consultas registradas"}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((cliente) => (
                    <ConsultaClienteItem
                      key={cliente.id}
                      cliente={cliente}
                      onView={handleView}
                    />
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

export default Clientes;
