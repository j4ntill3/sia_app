"use client";

import React from "react";
import ConsultaCliente from "@/types/consulta_cliente";
import { getSession } from "@/actions/auth-actions";
import { useEffect, useState } from "react"; // Asegúrate de tener el tipo definido para el cliente

interface ClienteItemProps {
  cliente: ConsultaCliente;
  onView: (id: number) => void;
}

const ClienteItem: React.FC<ClienteItemProps> = ({ cliente, onView }) => {
  const [session, setSession] = useState<any>(null); // Sesión actual

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
      const userSession = await authenticateUser();

      if (userSession) {
        // Aquí podrías agregar la lógica para obtener los inmuebles si el usuario está autenticado
      }
    };

    init();
  }, []);

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-2">
        {cliente.nombre} {cliente.apellido}
      </td>
      <td className="px-4 py-2">{cliente.telefono ?? "No disponible"}</td>
      <td className="px-4 py-2">{cliente.email ?? "No disponible"}</td>
      <td className="px-4 py-2">
        {new Date(cliente.fecha).toLocaleDateString("es-AR")}
      </td>
      <td className="px-4 py-2">{cliente.descripcion ?? "No disponible"}</td>
      <td className="px-4 py-2">{cliente.id_inmueble ?? "No disponible"}</td>
      {session && session.user && session.user.role === "administrador" ? (
        <td className="px-4 py-2">{cliente.id_agente ?? "No disponible"}</td>
      ) : null}
    </tr>
  );
};

export default ClienteItem;
