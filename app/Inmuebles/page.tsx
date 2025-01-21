"use client";

import React, { useEffect, useState } from "react";
import InmuebleCard from "@/app/components/InmuebleCard";
import type Inmueble from "@/types/inmueble";

const Inmuebles = () => {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        const response = await fetch("/api/inmuebles");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setInmuebles(data);
        } else {
          throw new Error("Datos incorrectos recibidos de la API");
        }
      } catch (error) {
        setError("Error al obtener inmuebles");
        console.error("Error fetching inmuebles:", error);
      }
    };

    fetchInmuebles();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 bg-gray-100 p-4">
      {error && <p className="text-red-600">{error}</p>}
      {inmuebles.length === 0 ? (
        <p>No se encontraron inmuebles disponibles.</p>
      ) : (
        inmuebles.map((inmueble) => (
          <InmuebleCard key={inmueble.id} inmueble={inmueble} />
        ))
      )}
    </div>
  );
};

export default Inmuebles;
