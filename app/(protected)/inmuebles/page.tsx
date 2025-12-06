"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";
import InmuebleCard from "@/app/components/InmuebleCard";
import type { Inmueble } from "@/types/inmueble";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import { downloadCSV } from "@/lib/csv-export";
import { useEntitySearch } from "@/hooks/useEntitySearch";

const Inmuebles = () => {
  const [session, setSession] = useState<any>(null);
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Hook de búsqueda reutilizable
  const { searchQuery, setSearchQuery, filteredData: filteredInmuebles } = useEntitySearch(
    inmuebles,
    [
      'direccion',
      'barrio.nombre',
      'zona.nombre',
      'localidad.nombre',
      'categoria.categoria'
    ]
  );

  // Función para autenticar al usuario
  const authenticateUser = async () => {
    try {
      const sessionData = await getSession();

      if (!sessionData) {
        setError("No autenticado. Por favor inicia sesión.");
        return null;
      }

      if (
        sessionData.user.role !== "administrador" &&
        sessionData.user.role !== "agente"
      ) {
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

  // Función para obtener los inmuebles
  const fetchInmuebles = async (pageToFetch = 1) => {
    try {
      const response = await fetch(
        `/api/inmuebles?page=${pageToFetch}&pageSize=5`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los inmuebles.");
      }
      const inmueblesData = await response.json();
  setInmuebles(inmueblesData.data || []);
  setTotalPages(inmueblesData.totalPages || 1);
  setTotalItems(inmueblesData.total || 0);
    } catch (err) {
      setError("Error al obtener los inmuebles.");
    }
  };

  useEffect(() => {
    const init = async () => {
      const userSession = await authenticateUser();
      if (userSession) {
        await fetchInmuebles(page);
      }
      setIsLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDownloadCSV = () => {
    downloadCSV(
      inmuebles,
      ["ID", "Dirección", "Categoría", "Localidad", "Zona", "Barrio", "Dormitorios", "Baños", "Superficie", "Cochera", "Estado"],
      "inmuebles.csv",
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
            Inmuebles Disponibles
          </h1>
          <p className="text-gray-600 mt-2">
            {session?.user?.role === "administrador"
              ? "Gestiona todos los inmuebles del sistema"
              : "Explora el catálogo completo de propiedades"}
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto flex-1">
              <SearchBar
                value={searchQuery}
                onSearch={setSearchQuery}
                placeholder="Buscar inmuebles por dirección, barrio, zona, localidad, categoría..."
                totalCount={inmuebles.length}
                filteredCount={filteredInmuebles.length}
              />
            </div>
            {session?.user?.role === "administrador" && (
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Exportar CSV
              </button>
            )}
          </div>
        </div>

        {/* Grid de inmuebles */}
        <div className="mb-6">
          {filteredInmuebles.length === 0 ? (
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
                  : "No hay inmuebles disponibles en este momento"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {filteredInmuebles.map((inmueble) => (
                <InmuebleCard key={inmueble.id} inmueble={inmueble} />
              ))}
            </div>
          )}
        </div>

        {/* Paginación */}
        {filteredInmuebles.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              totalItems={totalItems}
              pageSize={5}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Inmuebles;
