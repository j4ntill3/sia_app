"use client";

import { useEffect, useState } from "react";
import InmuebleCard from "@/app/components/InmuebleCard";
import type { Inmueble } from "@/types/inmueble";
import InmuebleSearch from "@/app/components/InmuebleSearch";
import Pagination from "@/app/components/Pagination";
import { Building2 } from "lucide-react";

const PropiedadesPublicas = () => {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Función para obtener los inmuebles públicos
  const fetchInmuebles = async (pageToFetch = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/inmuebles?page=${pageToFetch}&pageSize=9`
      );
      if (!response.ok) {
        throw new Error("Error al obtener las propiedades.");
      }
      const inmueblesData = await response.json();
      setInmuebles(inmueblesData.data || []);
      setTotalPages(inmueblesData.totalPages || 1);
      setTotalItems(inmueblesData.total || 0);
    } catch (err) {
      setError("Error al cargar las propiedades. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInmuebles(page);
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

  return (
    <div className="min-h-[calc(100vh-80px-56px)] bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-[#6FC6D1]" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#083C2C]">
              Propiedades Disponibles
            </h1>
          </div>
          <p className="text-gray-600">
            Explora nuestro catálogo completo de propiedades en venta y alquiler
          </p>
        </div>
      </div>

      {/* Search and Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <InmuebleSearch onSearch={setSearchQuery} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6FC6D1] mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando propiedades...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && !error && (
          <>
            {filteredInmuebles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No se encontraron propiedades que coincidan con tu búsqueda.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Intenta con otros términos de búsqueda.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredInmuebles.map((inmueble) => (
                    <InmuebleCard
                      key={inmueble.id}
                      inmueble={inmueble}
                      isPublic={true}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                    totalItems={totalItems}
                    pageSize={9}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropiedadesPublicas;
