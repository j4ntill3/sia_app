"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions"; // Lógica de autenticación
import InmuebleCard from "@/app/components/InmuebleCard";
import type Inmueble from "@/types/inmueble";

const misInmuebles = () => {
  const [session, setSession] = useState<any>(null); // Sesión actual
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]); // Lista de inmuebles
  const [error, setError] = useState<string | null>(null); // Estado de errores
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

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

  useEffect(() => {
    const init = async () => {
      const userSession = await authenticateUser();

      if (userSession) {
        // Hacer la solicitud a la API para obtener los inmuebles del agente
        const response = await fetch(`/api/misInmuebles`);
        if (response.ok) {
          const inmueblesData = await response.json();
          setInmuebles(inmueblesData);
        } else {
          setError("Error al obtener los inmuebles.");
        }
      }

      setIsLoading(false);
    };

    init();
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

  // Renderizar los inmuebles
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

export default misInmuebles;
