"use client";

import React from "react";
import { ConsultaCliente } from "@/types/consulta_cliente";
import { getSession } from "@/actions/auth-actions";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface ConsultaClienteItemProps {
  cliente: ConsultaCliente;
  onView: (id: string) => void;
}

const ConsultaClienteItem: React.FC<ConsultaClienteItemProps> = ({ cliente, onView }) => {
  const [session, setSession] = useState<any>(null);

  // Función para autenticar al usuario
  const authenticateUser = async () => {
    try {
      const sessionData = await getSession();

      if (!sessionData) {
        return null;
      }

      if (
        sessionData.user.role !== "administrador" &&
        sessionData.user.role !== "agente"
      ) {
        return null;
      }

      setSession(sessionData);
      return sessionData;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      await authenticateUser();
    };

    init();
  }, []);

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 font-sans py-2 text-gray-900">
        {cliente.nombre} {cliente.apellido}
      </td>
      <td className="px-4 font-sans py-2 text-gray-900">
        {cliente.telefono ?? "No disponible"}
      </td>
      <td className="px-4 font-sans py-2 text-gray-900">
        {cliente.correo ?? "No disponible"}
      </td>
      <td className="px-4 font-sans py-2 text-gray-900">
        {new Date(cliente.fecha).toLocaleDateString("es-AR")}
      </td>
      <td className="px-4 font-sans py-2 text-gray-900">
        {cliente.descripcion ?? "Sin descripción"}
      </td>
      <td className="px-4 font-sans py-2 text-gray-900">
        {cliente.inmueble_id}
      </td>
      {session && session.user && session.user.role === "administrador" ? (
        <td className="px-4 font-sans py-2 text-gray-900">
          {cliente.agente_id}
        </td>
      ) : null}
      <td className="px-4 py-2">
        <button
          onClick={() => onView(cliente.id)}
          className="flex items-center gap-1 bg-[#6FC6D1] text-white px-3 py-1 rounded-lg hover:bg-[#5ab5c1] transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          Ver
        </button>
      </td>
    </tr>
  );
};

export default ConsultaClienteItem;
