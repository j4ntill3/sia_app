"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";
import ConsultaClienteItem from "@/app/components/ConsultaClienteItem";
import { useRouter } from "next/navigation";
import ConsultaCliente from "@/types/consulta_cliente";

const Clientes = () => {
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<ConsultaCliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const authenticateUser = async () => {
    try {
      const sessionData = await getSession();

      if (!sessionData) {
        setError("No autenticado. Por favor inicia sesión.");
        return null;
      }

      if (sessionData.user.role !== "agente") {
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
        await fetchClientes();
      }

      setIsLoading(false);
    };

    init();
  }, []);

  // Función para obtener los clientes desde la API
  const fetchClientes = async () => {
    try {
      const response = await fetch("/api/misConsultasClientes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClientes(data); // Asume que la API devuelve un array de clientes
      } else {
        setError("Error al obtener los clientes.");
      }
    } catch (err) {
      console.error("Error al obtener clientes:", err);
      setError("Error al obtener los clientes.");
    }
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No autenticado. Por favor inicia sesión.
        </p>
      </div>
    );
  }

  const handleView = (id: number) => {
    router.push(`/clientes/${id}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white p-6 shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Lista de Consultas
        </h2>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full table-auto bg-white border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  Teléfono
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  Fecha
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  Descripción
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                  ID Inmueble
                </th>
                {session &&
                session.user &&
                session.user.role === "administrador" ? (
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                    ID Agente
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <ConsultaClienteItem
                  key={cliente.id}
                  cliente={cliente}
                  onView={handleView}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
