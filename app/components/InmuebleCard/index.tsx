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
    <div className="w-full max-w-sm p-6 bg-white shadow-md flex flex-col rounded-2xl">
      <img
        src={inmueble.ruta_imagen}
        alt={inmueble.title}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h3 className="text-xl font-semibold text-[#083C2C] mb-2">
        {" "}
        {/* Color actualizado */}
        {inmueble.title}
      </h3>
      <p className="text-[#083C2C] text-sm mb-2">
        {" "}
        {/* Color actualizado */}
        <strong>Dirección:</strong> {inmueble.direccion}
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        {" "}
        {/* Color actualizado */}
        <strong>Barrio:</strong> {inmueble.barrio}
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        {" "}
        {/* Color actualizado */}
        <strong>Habitaciones:</strong> {inmueble.num_habitaciones} -{" "}
        <strong>Baños:</strong> {inmueble.num_baños}
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        {" "}
        {/* Color actualizado */}
        <strong>Superficie:</strong> {inmueble.superficie} m²
      </p>
      <p className="text-[#083C2C] text-sm mb-4">
        {" "}
        {/* Color actualizado */}
        <strong>Garaje:</strong> {inmueble.garaje ? "Sí" : "No"}
      </p>
      <button
        onClick={handleViewMore}
        className="w-full text-xs text-white bg-[#6FC6D1] py-2 px-4 text-center rounded-full"
      >
        VER MÁS
      </button>
    </div>
  );
};

export default InmuebleCard;
