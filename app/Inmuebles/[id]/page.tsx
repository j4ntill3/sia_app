"use client";

import { useEffect, useState } from "react";

const InmuebleDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [inmueble, setInmueble] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
      } catch (err) {
        console.error("Error al resolver los parámetros:", err);
        setError("No se pudieron obtener los parámetros necesarios.");
      }
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchInmueble = async () => {
      try {
        const response = await fetch(`/api/inmuebles/${id}`);
        if (!response.ok) throw new Error("Error al obtener el inmueble");

        const data = await response.json();
        setInmueble(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Ocurrió un error al cargar los detalles.");
      }
    };

    fetchInmueble();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!inmueble) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando detalles del inmueble...</p>
      </div>
    );
  }

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
    id_estado,
    ruta_imagen,
  } = inmueble;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Detalles del Inmueble
        </h2>
        <img
          src={ruta_imagen}
          alt={`Imagen del inmueble: ${title}`}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
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
            {id_estado}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InmuebleDetail;
