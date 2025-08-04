"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Persona } from "@/types/persona";
import { Employee } from "@/types/empleado";

interface AgenteItemProps {
  agente: {
    empleado: Employee;
    persona: Persona;
  };
}

const AgenteItem: React.FC<AgenteItemProps> = ({ agente }) => {
  const { empleado, persona } = agente;
  const router = useRouter();

  return (
    <tr className="border-b font-sans hover:bg-gray-50">
      <td className="px-4 py-2 text-gray-900">{empleado.id}</td>
      <td className="px-4 py-2 text-gray-900">
        {persona.firstName} {persona.lastName}
      </td>
      <td className="px-4 py-2 text-gray-900">{empleado.cuit}</td>
      <td className="px-4 py-2 text-gray-900">
        {empleado.hireDate
          ? new Date(empleado.hireDate).toLocaleDateString("es-AR")
          : ""}
      </td>
      <td className="px-4 py-2 text-gray-900">
        {empleado.terminationDate
          ? new Date(empleado.terminationDate).toLocaleDateString("es-AR")
          : "-"}
      </td>
      <td className="px-4 py-2 text-gray-900">
        {persona.telefono ?? "No disponible"}
      </td>
      <td className="px-4 py-2">
        <span
          className={`px-2 py-1 text-sm rounded-full ${
            empleado.deleted
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {empleado.deleted ? "Eliminado" : "Activo"}
        </span>
      </td>
      <td className="px-4 py-2 text-center">
        <button
          onClick={() => router.push(`/agentes/${empleado.id}`)}
          className="px-4 py-2 text-white bg-[#6FC6D1] rounded-full hover:underline"
        >
          Ver
        </button>
      </td>
    </tr>
  );
};

export default AgenteItem;
