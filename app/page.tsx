"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";
import Link from "next/link";

export default function Home() {
  const [session, setSession] = useState<any>(null); // Sesión actual
  const [error, setError] = useState<string | null>(null); // Estado de errores
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // Función para autenticar al usuario
  const authenticateUser = async () => {
    try {
      const sessionData = await getSession();

      if (!sessionData) {
        setError("No autenticado. Por favor inicia sesión.");
        return null;
      }

      if (
        sessionData.user.role !== "administrador" &&
        sessionData.user.role !== "agente"
      ) {
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
        // Aquí podrías agregar la lógica para obtener los inmuebles si el usuario está autenticado
      }

      setIsLoading(false); // Finaliza la carga al completar
    };

    init();
  }, []);

  // Mostrar un mensaje de carga mientras se resuelve la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Mostrar errores si ocurren
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Mostrar mensaje si no hay sesión
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No autenticado. Por favor inicia sesión.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen justify-center">
      <div className="flex flex-wrap items-center justify-center bg-gray-100 p-0">
        {session.user.role === "administrador" ||
        session.user.role === "agente" ? (
          <Link href="/inmuebles">
            <div className="m-4 w-80 h-56 bg-white shadow-md rounded-lg active:shadow-inner active:bg-gray-200 flex items-center justify-center cursor-pointer">
              Inmuebles
            </div>
          </Link>
        ) : null}
        {session.user.role === "agente" ? (
          <Link href="/misInmuebles">
            <div className="m-4 w-80 h-56 bg-white shadow-md rounded-lg active:shadow-inner active:bg-gray-200 flex items-center justify-center cursor-pointer">
              Mis Inmuebles
            </div>
          </Link>
        ) : null}
        {session.user.role === "administrador" ? (
          <Link href="/altaInmueble">
            <div className="m-4 w-80 h-56 bg-white shadow-md rounded-lg active:shadow-inner active:bg-gray-200 flex items-center justify-center cursor-pointer">
              Alta Inmuebles
            </div>
          </Link>
        ) : null}
        {session.user.role === "administrador" ? (
          <Link href="/agentes">
            <div className="m-4 w-80 h-56 bg-white shadow-md rounded-lg active:shadow-inner active:bg-gray-200 flex items-center justify-center cursor-pointer">
              Agentes
            </div>
          </Link>
        ) : null}
        {session.user.role === "administrador" ? (
          <Link href="/altaAgente">
            <div className="m-4 w-80 h-56 bg-white shadow-md rounded-lg active:shadow-inner active:bg-gray-200 flex items-center justify-center cursor-pointer">
              Alta Agente
            </div>
          </Link>
        ) : null}
        {session.user.role === "agente" ? (
          <Link href="/misClientes">
            <div className="m-4 w-80 h-56 bg-white shadow-md rounded-lg active:shadow-inner active:bg-gray-200 flex items-center justify-center cursor-pointer">
              Mis Clientes y Consultas
            </div>
          </Link>
        ) : null}
        {session.user.role === "agente" ? (
          <Link href="/registrarClienteConsulta">
            <div className="m-4 w-80 h-56 bg-white shadow-md rounded-lg active:shadow-inner active:bg-gray-200 flex items-center justify-center cursor-pointer">
              Registrar Cliente y Consulta
            </div>
          </Link>
        ) : null}
        {session.user.role === "administrador" ? (
          <Link href="/consultasClientes">
            <div className="m-4 w-80 h-56 bg-white shadow-md rounded-lg active:shadow-inner active:bg-gray-200 flex items-center justify-center cursor-pointer">
              Consultas Clientes
            </div>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
