"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions"; // Asegúrate de importar correctamente la función

export default function UserInfo() {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await getSession();
      if (sessionData) {
        setSession(sessionData);
        setStatus("authenticated");
      } else {
        setStatus("not_authenticated");
      }
    }
    fetchSession();
  }, []);

  if (status === "loading") {
    return <p>Cargando datos...</p>;
  }

  if (status === "not_authenticated") {
    return <p>No estás autenticado.</p>;
  }

  const { user } = session;

  return (
    <div className="p-4 text-black bg-gray-100 rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Información del Usuario</h1>
      <p>
        <strong>ID Persona:</strong> {user.personaId}
      </p>
      <p>
        <strong>ID Usuario:</strong> {user.usuarioId}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Rol:</strong> {user.role}
      </p>
      <p>
        <strong>ID de Empleado:</strong> {user.empleadoId ?? "No disponible"}
      </p>
    </div>
  );
}
