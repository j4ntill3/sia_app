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
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Mostrar errores si ocurren
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Mostrar mensaje si no hay sesión
  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No autenticado. Por favor inicia sesión.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-2xl">
        {/* Título de la carta */}
        <div className="flex flex-row justify-center">
          {session.user.role === "administrador" ? (
            <span className="text-3xl font-bold text-center mb-6 text-[#083C2C]">
              ADM/
            </span>
          ) : null}
          {session.user.role === "agente" ? (
            <span className="text-3xl font-bold text-center mb-6 text-[#083C2C]">
              AGENTE/
            </span>
          ) : null}

          <span className="text-2xl regular text-center mb-6 text-[#083C2C] pt-0.5">
            Operaciones
          </span>
        </div>

        <div className="flex flex-col gap-4 items-stretch">
          {session.user.role === "administrador" ||
          session.user.role === "agente" ? (
            <Link href="/inmuebles">
              <button className="w-full px-4 py-2 bg-[#6FC6D1] text-white rounded-full hover:underline">
                Inmuebles
              </button>
            </Link>
          ) : null}
          {session.user.role === "agente" ? (
            <Link href="/misInmuebles">
              <button className="w-full px-4 py-2 bg-white text-[#6FC6D1] rounded-full border-2 border-[#6FC6D1] hover:underline">
                Mis Inmuebles
              </button>
            </Link>
          ) : null}
          {session.user.role === "administrador" ? (
            <Link href="/altaInmueble">
              <button className="w-full px-4 py-2 bg-white text-[#6FC6D1] rounded-full border-2 border-[#6FC6D1] hover:underline">
                Alta Inmuebles
              </button>
            </Link>
          ) : null}
          {session.user.role === "administrador" ? (
            <Link href="/agentes">
              <button className="w-full px-4 py-2 bg-[#6FC6D1] text-white rounded-full hover:underline">
                Agentes
              </button>
            </Link>
          ) : null}
          {session.user.role === "administrador" ? (
            <Link href="/altaAgente">
              <button className="w-full px-4 py-2 bg-white text-[#6FC6D1] rounded-full border-2 border-[#6FC6D1] hover:underline">
                Alta Agente
              </button>
            </Link>
          ) : null}
          {session.user.role === "agente" ? (
            <Link href="/misConsultasClientes">
              <button className="w-full px-4 py-2 bg-[#6FC6D1] text-white rounded-full hover:underline">
                Mis Clientes y Consultas
              </button>
            </Link>
          ) : null}
          {session.user.role === "agente" ? (
            <Link href="/registrarConsultaCliente">
              <button className="w-full px-4 py-2 bg-white text-[#6FC6D1] rounded-full border-2 border-[#6FC6D1] hover:underline">
                Registrar Cliente y Consulta
              </button>
            </Link>
          ) : null}
          {session.user.role === "administrador" ? (
            <Link href="/consultasClientes">
              <button className="w-full px-4 py-2 bg-[#6FC6D1] text-white rounded-full hover:underline">
                Consultas Clientes
              </button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
