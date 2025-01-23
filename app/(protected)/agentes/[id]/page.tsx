"use client";

import { useEffect, useState } from "react";

const AgenteDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [agente, setAgente] = useState<any>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    getParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchAgente = async () => {
      try {
        const response = await fetch(`/api/agentes/${id}`);
        if (!response.ok) throw new Error("Error al obtener el agente");

        const data = await response.json();
        setAgente(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAgente();
  }, [id]);

  if (!agente) return null;

  const { persona, empleado } = agente;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Detalles del Agente
        </h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Nombre:</span>{" "}
            {persona.nombre} {persona.apellido}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">CUIT:</span>{" "}
            {empleado.CUIT}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Dirección:</span>{" "}
            {persona.direccion}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Email:</span>{" "}
            {persona.email}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Teléfono:</span>{" "}
            {persona.telefono}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Fecha de Alta:</span>{" "}
            {new Date(empleado.fecha_alta).toLocaleDateString()}
          </p>
          {empleado.fecha_baja && (
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">
                Fecha de Baja:
              </span>{" "}
              {new Date(empleado.fecha_baja).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgenteDetail;
