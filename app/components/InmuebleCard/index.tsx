"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type Inmueble from "@/types/inmueble";

interface InmuebleCardProps {
  inmueble: Inmueble;
}

const InmuebleCard: React.FC<InmuebleCardProps> = ({ inmueble }) => {
  const router = useRouter();

  const handleViewMore = () => {
    router.push(`/inmuebles/${inmueble.id}`); // Redirige a la página de detalles
  };

  return (
    <div className="w-full max-w-sm p-6 bg-white shadow-md flex flex-col">
      <img
        src={inmueble.ruta_imagen}
        alt={inmueble.title}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {inmueble.title}
      </h3>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Dirección:</strong> {inmueble.direccion}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Barrio:</strong> {inmueble.barrio}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Habitaciones:</strong> {inmueble.num_habitaciones} -{" "}
        <strong>Baños:</strong> {inmueble.num_baños}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Superficie:</strong> {inmueble.superficie} m²
      </p>
      <p className="text-gray-600 text-sm mb-4">
        <strong>Garaje:</strong> {inmueble.garaje ? "Sí" : "No"}
      </p>
      <button
        onClick={handleViewMore}
        className="w-full bg-gray-800 text-white py-2 px-4 text-center rounded"
      >
        Ver Más
      </button>
    </div>
  );
};

export default InmuebleCard;
