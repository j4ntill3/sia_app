"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const InmuebleDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [inmueble, setInmueble] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [agentId, setAgentId] = useState<number | null>(null); // Estado para almacenar el ID del agente

  const router = useRouter();

  useEffect(() => {
    const resolveSessionAndParams = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
      } catch {
        setError("No se pudieron obtener los datos necesarios.");
      } finally {
        setIsLoading(false);
      }
    };

    resolveSessionAndParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchInmueble = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/inmuebles/${id}`);
        if (!response.ok) throw new Error("Error al obtener el inmueble");

        const data = await response.json();
        setInmueble(data);
      } catch {
        setError("Ocurrió un error al cargar los detalles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInmueble();
  }, [id]);

  const handleAssignAgent = async () => {
    if (agentId && id) {
      // Realizar la solicitud PUT a la API para asignar el agente
      try {
        const response = await fetch(`/api/asignacionAgente/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agentId: agentId,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al asignar el agente.");
        }

        const data = await response.json();
        console.log(data.message); // Mostrar mensaje de éxito

        // Mostrar una alerta con el mensaje de éxito
        alert("Agente asignado al inmueble con éxito");

        setIsModalOpen(false); // Cerrar el modal
      } catch (error) {
        console.error("Error al asignar el agente:", error);
        setError("Ocurrió un error al asignar el agente.");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!inmueble) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No se encontraron detalles del inmueble.
        </p>
      </div>
    );
  }

  const {
    title,
    id_rubro,
    localidad,
    direccion,
    barrio,
    num_habitaciones,
    num_baños,
    superficie,
    garaje,
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
          <p>
            <span className="font-semibold">Título:</span> {title}
          </p>
          <p>
            <span className="font-semibold">Rubro:</span> {id_rubro}
          </p>
          <p>
            <span className="font-semibold">Localidad:</span> {localidad}
          </p>
          <p>
            <span className="font-semibold">Dirección:</span> {direccion}
          </p>
          <p>
            <span className="font-semibold">Barrio:</span> {barrio}
          </p>
          <p>
            <span className="font-semibold">Habitaciones:</span>{" "}
            {num_habitaciones}
          </p>
          <p>
            <span className="font-semibold">Baños:</span> {num_baños}
          </p>
          <p>
            <span className="font-semibold">Superficie:</span> {superficie} m²
          </p>
          <p>
            <span className="font-semibold">Garaje:</span>{" "}
            {garaje ? "Sí" : "No"}
          </p>
          <p>
            <span className="font-semibold">Estado:</span> {estado}
          </p>
        </div>

        {/* Botón para abrir el modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-lg"
        >
          Asignar Agente
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-xl font-semibold mb-4">Asignar Agente</h3>
              <input
                type="number"
                value={agentId ?? ""}
                onChange={(e) => setAgentId(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Ingrese el ID del agente"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="py-2 px-4 bg-gray-400 text-white rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAssignAgent}
                  className="py-2 px-4 bg-blue-500 text-white rounded-lg"
                >
                  Asignar
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
