"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";
import InmuebleCard from "@/app/components/InmuebleCard";
import type { Property as Inmueble } from "@/types/inmueble";
import InmuebleSearch from "@/app/components/InmuebleSearch";
import Pagination from "@/app/components/Pagination";

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
      setInmuebles(inmueblesData.data.data || []);
      setTotalPages(inmueblesData.data.totalPages || 1);
      setTotalItems(inmueblesData.data.total || 0);
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
      inmueble.title?.toLowerCase().includes(q) ||
      inmueble.neighborhood?.toLowerCase().includes(q) ||
      inmueble.address?.toLowerCase().includes(q)
    );
  });

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
      <InmuebleSearch onSearch={setSearchQuery} />
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
