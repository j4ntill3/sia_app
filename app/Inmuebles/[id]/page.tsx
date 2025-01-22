"use client";

import { useEffect, useState } from "react";

const InmuebleDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [inmueble, setInmueble] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false); // Estado para el modal de confirmación

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
        setError(err.message || "Ocurrió un error al cargar los detalles.");
      }
    };

    fetchInmueble();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/inmuebles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el inmueble");

      const data = await response.json();
      alert("Inmueble eliminado exitosamente.");
      setInmueble(null); // Limpia el estado tras la eliminación
      setShowConfirm(false); // Cierra el modal
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Ocurrió un error al eliminar el inmueble.");
    }
  };

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
    estado,
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
            <span className="font-semibold text-gray-800">Rubro:</span>{" "}
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
            <span className="font-semibold text-gray-800">Estado:</span>{" "}
            {estado}
          </p>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Eliminar
        </button>

        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-800 font-semibold mb-4">
                ¿Estás seguro que deseas realizar esta acción?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InmuebleDetail;
