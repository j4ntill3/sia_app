"use client";

import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session, status } = useSession();

  // Verificación: comprobamos el estado de la sesión
  console.log("Estado de la sesión:", status);
  console.log("Contenido de la sesión:", session);

  if (status === "loading") {
    return <p>Cargando datos...</p>;
  }

  if (!session) {
    return <p>No estás autenticado.</p>;
  }

  // Verificación: comprobamos que 'user' tiene los datos esperados
  const { user } = session;
  console.log("Datos del usuario:", user);

  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Información del Usuario</h1>
      <p>
        <strong>ID:</strong> {user.id}
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
