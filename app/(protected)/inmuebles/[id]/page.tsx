"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/actions/auth-actions"; // Función de autenticación

const InmuebleDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [session, setSession] = useState<any>(null); // Estado de sesión
  const [inmueble, setInmueble] = useState<any>(null); // Estado del inmueble
  const [error, setError] = useState<string | null>(null); // Estado de error
  const [id, setId] = useState<string | null>(null); // ID del inmueble
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const router = useRouter();

  // Función para autenticar al usuario
  const authenticateUser = async () => {
    try {
      const sessionData = await getSession();

      if (!sessionData) {
        setError("No autenticado. Por favor inicia sesión.");
        return null;
      }

      if (
        sessionData.user.role !== "administrador" &&
        sessionData.user.role !== "agente"
      ) {
        setError("No autorizado para acceder a esta página.");
        return null;
      }

      setSession(sessionData);
      return sessionData;
    } catch (err) {
      setError("Error al autenticar al usuario.");
      return null;
    }
  };

  // Función para obtener los detalles del inmueble
  const fetchInmueble = async (id: string) => {
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

  // Resolución de parámetros y autenticación
  useEffect(() => {
    const resolveSessionAndParams = async () => {
      try {
        const sessionData = await authenticateUser();
        if (!sessionData) return;

        const resolvedParams = await params;
        const inmuebleId = resolvedParams.id;
        setId(inmuebleId);

        // Solo se obtiene el inmueble si se obtuvo correctamente el ID
        if (inmuebleId) {
          await fetchInmueble(inmuebleId);
        }
      } catch {
        setError("No se pudieron obtener los datos necesarios.");
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    resolveSessionAndParams();
  }, [params]);

  // Función de eliminación de inmueble
  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "¿Estás seguro que deseas eliminar este inmueble?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/inmuebles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error desconocido al eliminar el inmueble");
      }

      alert("Inmueble eliminado exitosamente.");
      router.push("/inmuebles"); // Redirige a la página de inmuebles
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Ocurrió un error al eliminar el inmueble.");
    }
  };

  // Mostrar un mensaje de carga mientras se resuelve la sesión y los datos
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Mostrar errores si ocurren
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Mostrar mensaje si no hay sesión
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No autenticado. Por favor inicia sesión.
        </p>
      </div>
    );
  }

  // Mostrar mensaje si no se encuentra el inmueble
  if (!inmueble) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No se encontraron detalles del inmueble.
        </p>
      </div>
    );
  }

  // Desestructuración de los datos del inmueble
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
            <span className="font-semibold">Rubro:</span> {idRubro}
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
            {numHabitaciones}
          </p>
          <p>
            <span className="font-semibold">Baños:</span> {numBaños}
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
        <button
          onClick={handleDelete}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default InmuebleDetail;
