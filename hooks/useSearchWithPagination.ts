import { useState, useMemo } from 'react';

/**
 * Hook personalizado para búsqueda y paginación de entidades
 * @param data - Array de datos a filtrar y paginar
 * @param searchFields - Array de rutas de campos a buscar (ej: ['persona.nombre', 'empleado.cuit'])
 * @param itemsPerPage - Número de items por página (default: 10)
 * @returns Object con funciones y datos de búsqueda y paginación
 */
export function useSearchWithPagination<T>(
  data: T[],
  searchFields: string[],
  itemsPerPage: number = 10
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar datos según búsqueda
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const q = searchQuery.toLowerCase();

    return data.filter((item) => {
      return searchFields.some((fieldPath) => {
        const value = getNestedValue(item, fieldPath);

        if (value === null || value === undefined) {
          return false;
        }

        // Convertir a string y buscar
        const stringValue = String(value).toLowerCase();
        return stringValue.includes(q);
      });
    });
  }, [data, searchQuery, searchFields]);

  // Calcular datos de paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Cuando cambia la búsqueda, resetear a página 1
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Cambiar de página
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    // Datos
    filteredData,
    paginatedData,

    // Estado de búsqueda
    searchQuery,
    setSearchQuery: handleSearch,

    // Estado de paginación
    currentPage,
    totalPages,
    totalItems: filteredData.length,
    itemsPerPage,
    setCurrentPage: handlePageChange,
  };
}

/**
 * Obtiene un valor anidado de un objeto usando dot notation
 * @param obj - Objeto del cual extraer el valor
 * @param path - Ruta del campo (ej: 'persona.nombre')
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current?.[key];
  }, obj);
}
