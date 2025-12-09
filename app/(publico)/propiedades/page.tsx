"use client";

import { useEffect, useState } from "react";
import InmuebleCard from "@/app/components/InmuebleCard";
import type { Inmueble } from "@/types/inmueble";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import { Building2 } from "lucide-react";
import { useSearchWithPagination } from "@/hooks/useSearchWithPagination";

const PropiedadesPublicas = () => {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    inmuebles,
    [
      'direccion',
      'barrio.nombre',
      'zona.nombre',
      'localidad.nombre',
      'categoria.categoria'
    ],
    9 // items por página
  );

  // Función para obtener todos los inmuebles públicos
  const fetchInmuebles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/inmuebles?all=true');
      if (!response.ok) {
        throw new Error("Error al obtener las propiedades.");
      }
      const inmueblesData = await response.json();
      setInmuebles(inmueblesData.data || []);
    } catch (err) {
      setError("Error al cargar las propiedades. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInmuebles();
  }, []);

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
        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto flex-1">
              <SearchBar
                value={searchQuery}
                onSearch={setSearchQuery}
                placeholder="Buscar propiedades por dirección, barrio, zona, localidad, categoría..."
                totalCount={inmuebles.length}
                filteredCount={totalItems}
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
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
            {paginatedData.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  {searchQuery
                    ? "No se encontraron propiedades que coincidan con tu búsqueda."
                    : "No hay propiedades disponibles en este momento."}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery && "Intenta con otros términos de búsqueda."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedData.map((inmueble) => (
                    <InmuebleCard
                      key={inmueble.id}
                      inmueble={inmueble}
                      isPublic={true}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      page={currentPage}
                      totalPages={totalPages}
                      onChange={setCurrentPage}
                      totalItems={totalItems}
                      pageSize={itemsPerPage}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropiedadesPublicas;
