"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";
import InmuebleCard from "@/app/components/InmuebleCard";
import type Inmueble from "@/types/inmueble";

const Inmuebles = () => {
  const [session, setSession] = useState<any>(null);
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para manejar la carga

  useEffect(() => {
    const fetchSessionAndInmuebles = async () => {
      try {
        const sessionData = await getSession();

        if (!sessionData) {
          setError("No autenticado. Por favor inicia sesión.");
          return;
        }

        setSession(sessionData);

        const response = await fetch("/api/inmuebles");
        if (!response.ok) throw new Error("Error al obtener los inmuebles");

        const data = await response.json();
        setInmuebles(data);
      } catch (err) {
        setError("Error al obtener inmuebles o sesión.");
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    fetchSessionAndInmuebles();
  }, []);

  // Mostrar un mensaje de carga mientras se resuelve la sesión y los datos
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Mostrar errores si ocurren
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Mostrar mensaje si no hay sesión
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No autenticado. Por favor inicia sesión.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 bg-gray-100 p-4">
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
