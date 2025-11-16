"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";

interface Metricas {
  // Métricas de administrador
  totalInmuebles?: number;
  inmueblesActivos?: number;
  totalAgentes?: number;
  totalConsultas?: number;
  inmueblesPorEstado?: { nombre: string; cantidad: number }[];
  consultasRecientes?: any[];
  // Métricas de agente
  misInmuebles?: number;
  misInmueblesActivos?: number;
  misConsultas?: number;
  misInmueblesPorEstado?: { nombre: string; cantidad: number }[];
  misConsultasRecientes?: any[];
}

const HomePage = () => {
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [loadingMetricas, setLoadingMetricas] = useState(false);

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

  // Función para obtener métricas
  const fetchMetricas = async () => {
    try {
      setLoadingMetricas(true);
      const response = await fetch("/api/metricas");
      const result = await response.json();

      if (response.ok && result.data) {
        setMetricas(result.data);
      } else {
        console.error("Error al obtener métricas:", result.error);
      }
    } catch (err) {
      console.error("Error al obtener métricas:", err);
    } finally {
      setLoadingMetricas(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const userSession = await authenticateUser();
      if (userSession) {
        await fetchMetricas();
      }
      setIsLoading(false);
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

  // Componente de tarjeta de métrica
  const MetricCard = ({
    title,
    value,
    icon,
    color = "bg-blue-500",
  }: {
    title: string;
    value: number | string;
    icon?: string;
    color?: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        {icon && (
          <div className={`${color} rounded-full p-3 text-white text-2xl`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  // Renderizado principal
  return (
    <div className="min-h-[calc(100vh-80px-56px)] bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Título de bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido, {session?.user?.name || "Usuario"}
          </h1>
          <p className="text-gray-600 mt-2">
            {session?.user?.role === "administrador"
              ? "Panel de administración - Vista general del sistema"
              : "Tu panel personal - Resumen de tus actividades"}
          </p>
        </div>

        {/* Indicador de carga */}
        {loadingMetricas && (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando métricas...</p>
          </div>
        )}

        {/* Métricas */}
        {!loadingMetricas && metricas && (
          <>
            {/* Métricas para administrador */}
            {session?.user?.role === "administrador" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <MetricCard
                    title="Total Inmuebles"
                    value={metricas.totalInmuebles || 0}
                    icon="🏠"
                    color="bg-blue-500"
                  />
                  <MetricCard
                    title="Inmuebles Activos"
                    value={metricas.inmueblesActivos || 0}
                    icon="✓"
                    color="bg-green-500"
                  />
                  <MetricCard
                    title="Agentes"
                    value={metricas.totalAgentes || 0}
                    icon="👥"
                    color="bg-purple-500"
                  />
                </div>

                {/* Consultas recientes */}
                {metricas.consultasRecientes &&
                  metricas.consultasRecientes.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Consultas Recientes
                      </h2>
                      <div className="space-y-3">
                        {metricas.consultasRecientes.map((consulta) => (
                          <div
                            key={consulta.id}
                            className="border-l-4 border-blue-500 pl-4 py-2"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {consulta.nombre_cliente}{" "}
                                {consulta.apellido_cliente}
                              </p>
                              <p className="text-sm text-gray-600">
                                {consulta.inmueble?.titulo}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )}

            {/* Métricas para agente */}
            {session?.user?.role === "agente" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <MetricCard
                    title="Mis Inmuebles"
                    value={metricas.misInmuebles || 0}
                    icon="🏠"
                    color="bg-blue-500"
                  />
                  <MetricCard
                    title="Inmuebles Activos"
                    value={metricas.misInmueblesActivos || 0}
                    icon="✓"
                    color="bg-green-500"
                  />
                  <MetricCard
                    title="Mis Consultas"
                    value={metricas.misConsultas || 0}
                    icon="📧"
                    color="bg-purple-500"
                  />
                </div>

                {/* Consultas recientes */}
                {metricas.misConsultasRecientes &&
                  metricas.misConsultasRecientes.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Mis Consultas Recientes
                      </h2>
                      <div className="space-y-3">
                        {metricas.misConsultasRecientes.map((consulta) => (
                          <div
                            key={consulta.id}
                            className="border-l-4 border-blue-500 pl-4 py-2"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {consulta.nombre_cliente}{" "}
                                {consulta.apellido_cliente}
                              </p>
                              <p className="text-sm text-gray-600">
                                {consulta.inmueble?.titulo}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )}
          </>
        )}

        {/* Sin métricas */}
        {!loadingMetricas && !metricas && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No hay métricas disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
