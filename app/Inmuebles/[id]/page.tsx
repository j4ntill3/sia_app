"use client";

import { useEffect, useState } from "react";

const InmuebleDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [inmueble, setInmueble] = useState<any>(null);
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

    const fetchInmueble = async () => {
      try {
        const response = await fetch(`/api/inmuebles/${id}`);
        if (!response.ok) throw new Error("Error al obtener el inmueble");

        const data = await response.json();
        setInmueble(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInmueble();
  }, [id]);

  if (!inmueble) return null;

  const {
    title,
    idRubro,
    localidad,
    direccion,
    barrio,
    numHabitaciones,
    numBaños,
    superficie,
    garaje,
    eliminado,
    inmueble_estado,
  } = inmueble;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Detalles del Inmueble
        </h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Título:</span> {title}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Rubro ID:</span>{" "}
            {idRubro}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Localidad:</span>{" "}
            {localidad}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Dirección:</span>{" "}
            {direccion}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Barrio:</span>{" "}
            {barrio}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">
              Número de Habitaciones:
            </span>{" "}
            {numHabitaciones}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">
              Número de Baños:
            </span>{" "}
            {numBaños}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Superficie:</span>{" "}
            {superficie} m²
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Garaje:</span>{" "}
            {garaje ? "Sí" : "No"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Eliminado:</span>{" "}
            {eliminado ? "Sí" : "No"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Estado:</span>{" "}
            {inmueble_estado?.estado}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InmuebleDetail;
