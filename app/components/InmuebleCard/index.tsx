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

  // Obtener la imagen principal o la primera imagen disponible
  const getDisplayImage = () => {
    if (!inmueble.imagenes || !Array.isArray(inmueble.imagenes) || inmueble.imagenes.length === 0) {
      return "/img/no-image.webp";
    }

    // Buscar la imagen marcada como principal
    const principalImage = inmueble.imagenes.find((img) => img.es_principal);
    if (principalImage?.imagen) {
      return principalImage.imagen;
    }

    // Si no hay imagen principal, usar la primera
    return inmueble.imagenes[0]?.imagen || "/img/no-image.webp";
  };

  return (
    <div className="w-full max-w-sm p-6 bg-white shadow-md flex flex-col rounded-2xl">
      <div className="relative">
        <img
          src={getDisplayImage()}
          alt={`${inmueble.categoria?.categoria || 'Inmueble'} en ${inmueble.direccion}`}
          className="w-full h-48 object-cover mb-4 rounded"
        />
      </div>
      <h3 className="text-xl font-semibold text-[#083C2C] mb-2">
        {inmueble.categoria?.categoria || 'Inmueble'}
      </h3>
      <p className="text-[#083C2C] text-sm mb-2">
        <strong>Dirección:</strong> {inmueble.direccion}
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        <strong>Barrio:</strong> {inmueble.barrio?.nombre || 'N/A'}
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        <strong>Habitaciones:</strong> {inmueble.dormitorios} - <strong>Baños:</strong> {inmueble.banos}
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        <strong>Superficie:</strong> {inmueble.superficie} m²
      </p>
      <p className="text-[#083C2C] text-sm mb-2">
        <strong>Garaje:</strong> {inmueble.cochera ? "Sí" : "No"}
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
