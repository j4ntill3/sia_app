import React from "react";
import Inmueble from "@/app/types/inmueble";
import inmuebles from "@/app/db_local/inmuebles";


const InmuebleCard = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 bg-gray-100 p-4">
      {inmuebles.map((inmueble: Inmueble) => (
        <div
          key={inmueble.id}
          className="w-full max-w-sm p-6 bg-white shadow-md flex flex-col"
        >
          <img
            src="https://via.placeholder.com/300"
            alt={`Imagen del inmueble ${inmueble.id}`}
            className="w-full h-48 object-cover mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {`Inmueble en ${inmueble.localidad}`}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            <strong>Dirección:</strong> {inmueble.dirección}
          </p>
          <p className="text-gray-600 text-sm mb-2">
            <strong>Barrio:</strong> {inmueble.barrio}
          </p>
          <p className="text-gray-600 text-sm mb-2">
            <strong>Habitaciones:</strong> {inmueble.numHabitaciones} |{" "}
            <strong>Baños:</strong> {inmueble.numBaños}
          </p>
          <p className="text-gray-600 text-sm mb-2">
            <strong>Superficie:</strong> {inmueble.superficie} m²
          </p>
          <p className="text-gray-600 text-sm mb-4">
            <strong>Garaje:</strong> {inmueble.garaje ? "Sí" : "No"}
          </p>
          <p className="text-gray-800 font-medium mb-4">
            <strong>Estado:</strong> {inmueble.estado}
          </p>
          <button className="w-full bg-gray-800 text-white py-2 px-4 text-center">
            Ver Más
          </button>
        </div>
      ))}
    </div>
  );
};

export default InmuebleCard;

  