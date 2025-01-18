import React from "react";
import type Inmueble from "@/types/inmueble";

interface InmuebleCardProps {
  inmueble: Inmueble;
}

const InmuebleCard: React.FC<InmuebleCardProps> = ({ inmueble }) => {
  return (
    <div className="w-full max-w-sm p-6 bg-white shadow-md flex flex-col">
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
        <strong>Habitaciones:</strong> {inmueble.numHabitaciones} -{" "}
        <strong>Baños:</strong> {inmueble.numBaños}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Superficie:</strong> {inmueble.superficie} m²
      </p>
      <p className="text-gray-600 text-sm mb-4">
        <strong>Garaje:</strong> {inmueble.garaje ? "Sí" : "No"}
      </p>
      <button className="w-full bg-gray-800 text-white py-2 px-4 text-center">
        Ver Más
      </button>
    </div>
  );
};

export default InmuebleCard;
