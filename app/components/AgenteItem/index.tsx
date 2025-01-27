"use client";

import React from "react";
import Persona from "@/types/persona";
import Empleado from "@/types/empleado";

interface AgenteItemProps {
  agente: {
    empleado: Empleado;
    persona: Persona;
  };
  onView: (id: number) => void;
}

const AgenteItem: React.FC<AgenteItemProps> = ({ agente, onView }) => {
  const { empleado, persona } = agente;

  return (
    <tr className="border-b hover:bg-gray-50">
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
          onClick={() => onView(empleado.id)} // Llama a la función onView con el id del agente
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Ver
        </button>
      </td>
    </tr>
  );
};

export default AgenteItem;
