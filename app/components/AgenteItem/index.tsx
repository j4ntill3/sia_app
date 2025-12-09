"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Empleado } from "@/types/empleado";

interface AgenteItemProps {
  agente: {
    empleado: Empleado & { imagenes?: any[] };
    persona: {
      id: string;
      nombre: string;
      apellido: string;
      correo: string;
      telefono?: string;
      direccion?: string;
      dni?: number;
      eliminado: boolean;
      imagenes?: any[];
    };
  };
  basePath?: string;
}

const AgenteItem: React.FC<AgenteItemProps> = ({ agente, basePath = "/agentes" }) => {
  const { empleado, persona } = agente;
  const router = useRouter();

  const profileImage = persona.imagenes?.[0]?.imagen || "/img/no-image.webp";

  return (
    <tr className="border-b font-sans hover:bg-gray-50">
      <td className="px-4 py-2">
        <img
          src={profileImage}
          alt={`${persona.nombre} ${persona.apellido}`}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
        />
      </td>
      <td className="px-4 py-2 text-gray-900">{empleado.id}</td>
      <td className="px-4 py-2 text-gray-900">
        {persona.nombre} {persona.apellido}
      </td>
      <td className="px-4 py-2 text-gray-900">{empleado.cuit}</td>
      <td className="px-4 py-2 text-gray-900">
        {empleado.fecha_ingreso
          ? new Date(empleado.fecha_ingreso).toLocaleDateString("es-AR")
          : ""}
      </td>
      <td className="px-4 py-2 text-gray-900">
        {persona.correo}
      </td>
      <td className="px-4 py-2 text-gray-900">
        {persona.telefono ?? "No disponible"}
      </td>
      <td className="px-4 py-2">
        <span
          className={`px-2 py-1 text-sm rounded-full ${
            empleado.fecha_egreso
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {empleado.fecha_egreso ? "Inactivo" : "Activo"}
        </span>
      </td>
      <td className="px-4 py-2 text-center">
        <button
          onClick={() => router.push(`${basePath}/${empleado.id}`)}
          className="px-3 py-1 text-sm text-white bg-[#6FC6D1] rounded-md hover:bg-[#5AB5C1] transition-colors"
        >
          Ver
        </button>
      </td>
    </tr>
  );
};

export default AgenteItem;
