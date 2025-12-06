import { useState, useMemo } from 'react';

/**
 * Hook personalizado para búsqueda y filtrado de entidades
 * @param data - Array de datos a filtrar
 * @param searchFields - Array de rutas de campos a buscar (ej: ['persona.nombre', 'empleado.cuit'])
 * @returns Object con query, setSearchQuery y filteredData
 */
export function useEntitySearch<T>(
  data: T[],
  searchFields: string[]
) {
  const [searchQuery, setSearchQuery] = useState("");

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

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
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
