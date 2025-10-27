"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";
import AgenteItem from "@/app/components/AgenteItem";
import { downloadCSV, formatDateForCSV } from "@/lib/csv-export";

const Agentes = () => {
  const [session, setSession] = useState<any>(null);
  const [agentes, setAgentes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setAgentes(agentesData.data || []);
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

  const handleDownloadCSV = () => {
    downloadCSV(
      agentes,
      ["ID", "Nombre", "Apellido", "DNI", "CUIT", "Correo", "Teléfono", "Fecha de Alta", "Fecha de Baja", "Estado"],
      "agentes.csv",
      (agente) => [
        agente.empleado?.id || "",
        agente.persona?.nombre || "",
        agente.persona?.apellido || "",
        agente.persona?.dni || "",
        agente.empleado?.cuit || "",
        agente.persona?.correo || "",
        agente.persona?.telefono || "",
        formatDateForCSV(agente.empleado?.fecha_ingreso),
        formatDateForCSV(agente.empleado?.fecha_egreso),
        agente.empleado?.eliminado ? "Inactivo" : "Activo"
      ]
    );
  };

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
    <div className="min-h-[calc(100vh-80px-56px)] flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-900">
          Lista de Agentes
        </h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full table-auto bg-white border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                  Foto
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                  CUIT
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                  Fecha de Alta
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                  Fecha de Baja
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                  Teléfono
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                  Estado
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {agentes.map((agente) => (
                <AgenteItem key={agente.empleado.id} agente={agente} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex w-full justify-end mt-4">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Agentes;
