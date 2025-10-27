"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";
import InmuebleCard from "@/app/components/InmuebleCard";
import type { Inmueble } from "@/types/inmueble";
import InmuebleSearch from "@/app/components/InmuebleSearch";
import Pagination from "@/app/components/Pagination";
import { downloadCSV } from "@/lib/csv-export";

const Inmuebles = () => {
  const [session, setSession] = useState<any>(null);
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filtrar inmuebles según el texto de búsqueda
  const filteredInmuebles = inmuebles.filter((inmueble) => {
    const q = searchQuery.toLowerCase();
    return (
      inmueble.direccion?.toLowerCase().includes(q) ||
      inmueble.barrio?.nombre?.toLowerCase().includes(q) ||
      inmueble.zona?.nombre?.toLowerCase().includes(q) ||
      inmueble.localidad?.nombre?.toLowerCase().includes(q) ||
      inmueble.categoria?.categoria?.toLowerCase().includes(q)
    );
  });

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
    <div className="min-h-[calc(100vh-80px-56px)] flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-7xl mb-4 flex justify-between items-center">
        <InmuebleSearch onSearch={setSearchQuery} />
        {session?.user?.role === "administrador" && (
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Exportar CSV
          </button>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-6 w-full">
        {filteredInmuebles.length === 0 ? (
          <p>No se encontraron inmuebles disponibles.</p>
        ) : (
          filteredInmuebles.map((inmueble) => (
            <InmuebleCard key={inmueble.id} inmueble={inmueble} />
          ))
        )}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
        totalItems={totalItems}
        pageSize={5}
      />
    </div>
  );
};

export default Inmuebles;
