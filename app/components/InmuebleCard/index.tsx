"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { Property as Inmueble } from "@/types/inmueble";

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
        src={
          inmueble.propertyImage &&
          Array.isArray(inmueble.propertyImage) &&
          inmueble.propertyImage.length > 0 &&
          inmueble.propertyImage[0].imagePath
            ? inmueble.propertyImage[0].imagePath
            : "/img/no-image.webp"
        }
        alt={inmueble.title}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h3 className="text-xl font-semibold text-[#083C2C] mb-2">
        {" "}
        {/* Color actualizado */}
        {inmueble.title}
      </h3>
      <p className="text-[#083C2C] text-sm mb-2">
        <strong>Dirección:</strong> {inmueble.address}
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        <strong>Barrio:</strong> {inmueble.neighborhood}
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        <strong>Habitaciones:</strong> {inmueble.numBedrooms} -{" "}
        <strong>Baños:</strong> {inmueble.numBathrooms}
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        <strong>Superficie:</strong> {inmueble.surface} m²
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        <strong>Garaje:</strong> {inmueble.garage ? "Sí" : "No"}
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        <strong>Rubro:</strong> {inmueble.propertyCategory?.category || "-"}
      </p>
      <p className="text-[#083C2C] text-sm mb-4">
        <strong>Estado:</strong> {inmueble.propertyStatus?.status || "-"}
      </p>
      <button
        onClick={handleViewMore}
        className="w-full text-xs text-white bg-[#6FC6D1] py-2 px-4 text-center rounded-full hover:underline"
      >
        VER MÁS
      </button>
    </div>
  );
};

export default InmuebleCard;
