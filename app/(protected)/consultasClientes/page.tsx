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

  const router = useRouter();

  // Hook de búsqueda con paginación
  const {
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

  const handleDownloadCSV = () => {
    downloadCSV(
      clientes,
      ["Nombre", "Apellido", "Teléfono", "Correo", "Fecha", "Descripción", "ID Inmueble", "ID Agente"],
      "consultas-clientes.csv",
      (cliente) => [
        cliente.nombre,
        cliente.apellido,
        cliente.telefono,
        cliente.correo,
        formatDateForCSV(cliente.fecha),
        cliente.descripcion || "",
        cliente.inmueble_id,
        cliente.agente_id || ""
      ]
    );
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
          {/* Barra de búsqueda */}
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Buscar consultas por nombre, apellido, teléfono, correo, descripción..."
            className="mb-4"
          />

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
                  {session?.user?.role === "administrador" && (
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                      ID Agente
                    </th>
                  )}
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

          <div className="flex w-full justify-end mt-4">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Exportar CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
