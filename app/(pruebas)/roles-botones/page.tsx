"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions"; // Lógica de autenticación

const BotonesRoles = () => {
  const [session, setSession] = useState<any>(null); // Sesión actual
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
        // Aquí podrías agregar la lógica para obtener los inmuebles si el usuario está autenticado
      }

      setIsLoading(false); // Finaliza la carga al completar
    };

    init();
  }, []);

  // Mostrar un mensaje de carga mientras se resuelve la sesión
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

  // Verificación y renderización del botón solo si el rol es "administrador"
  return (
    <div>
      {session.user.role === "administrador" ? (
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg"
        >
          Botón
        </button>
      ) : null}
    </div>
  );
};

export default BotonesRoles;
