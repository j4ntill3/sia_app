"use client";

import React, { useEffect, useState } from "react";
import AgenteItem from "@/app/components/AgenteItem";

const Agentes = () => {
  const [agentes, setAgentes] = useState<any[]>([]);

  useEffect(() => {
    const fetchAgentes = async () => {
      try {
        const response = await fetch("/api/agentes");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAgentes(data);
      } catch (error) {
        console.error("Error fetching agentes:", error);
      }
    };

    fetchAgentes();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Lista de Agentes
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white border-collapse">
            <thead>
              <tr className="bg-gray-200">
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
