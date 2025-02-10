"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Persona from "@/types/persona";
import Empleado from "@/types/empleado";

interface AgenteItemProps {
  agente: {
    empleado: Empleado;
    persona: Persona;
  };
}

const AgenteItem: React.FC<AgenteItemProps> = ({ agente }) => {
  const { empleado, persona } = agente;
  const router = useRouter();

  return (
    <tr className="border-b font-sans hover:bg-gray-50">
      <td className="px-4 py-2">{empleado.id}</td>
      <td className="px-4 py-2">
        {persona.nombre} {persona.apellido}
      </td>
      <td className="px-4 py-2">{empleado.CUIT}</td>
      <td className="px-4 py-2">
        {new Date(empleado.fecha_alta).toLocaleDateString("es-AR")}
      </td>
      <td className="px-4 py-2">
        {empleado.fecha_baja
          ? new Date(empleado.fecha_baja).toLocaleDateString("es-AR")
          : ""}
      </td>
      <td className="px-4 py-2">{persona.telefono ?? "No disponible"}</td>
      <td className="px-4 py-2">
        <span
          className={`px-2 py-1 text-sm rounded-full ${
            empleado.eliminado
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {empleado.eliminado ? "Eliminado" : "Activo"}
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
