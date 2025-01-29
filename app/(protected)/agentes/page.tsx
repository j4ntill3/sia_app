"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions"; // Lógica de autenticación
import AgenteItem from "@/app/components/AgenteItem";

const Agentes = () => {
  const [session, setSession] = useState<any>(null); // Sesión actual
  const [agentes, setAgentes] = useState<any[]>([]); // Lista de agentes
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

      if (sessionData.user.role !== "administrador") {
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

  // Función para obtener los agentes
  const fetchAgentes = async () => {
    try {
      const response = await fetch("/api/agentes");
      if (!response.ok) {
        throw new Error("Error al obtener los agentes.");
      }

      const agentesData = await response.json();
      setAgentes(agentesData);
    } catch (err) {
      setError("Error al obtener los agentes.");
    }
  };

  useEffect(() => {
    const init = async () => {
      const userSession = await authenticateUser();

      if (userSession) {
        await fetchAgentes();
      }

      setIsLoading(false); // Finaliza la carga al completar
    };

    init();
  }, []);

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

  // Renderizar la tabla de agentes
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Lista de Agentes
        </h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full table-auto bg-white border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  CUIT
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  Fecha de Alta
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  Fecha de Baja
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  Teléfono
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  Estado
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {agentes.map((agente) => (
                <AgenteItem key={agente.empleado.id} agente={agente} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Agentes;
