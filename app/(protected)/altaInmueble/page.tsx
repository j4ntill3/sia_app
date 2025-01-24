"use client";

import { useState, useEffect } from "react";
import { InmuebleRubro } from "@/types/inmueble_rubro";
import { InmuebleEstado } from "@/types/inmueble_estado";
import { getSession } from "@/actions/auth-actions";

type FormData = {
  title: string;
  id_rubro: number | string;
  localidad: string;
  direccion: string;
  barrio: string;
  num_habitaciones: number;
  num_baños: number;
  superficie: number;
  garaje: boolean;
  id_estado: number | string;
};

export default function CrearInmueble() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    id_rubro: "",
    localidad: "",
    direccion: "",
    barrio: "",
    num_habitaciones: 0,
    num_baños: 0,
    superficie: 0,
    garaje: false,
    id_estado: "",
  });

  const [rubros, setRubros] = useState<InmuebleRubro[]>([]);
  const [estados, setEstados] = useState<InmuebleEstado[]>([]);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Agregado para mostrar el estado de carga

  useEffect(() => {
    const fetchRubros = async () => {
      const response = await fetch("/api/inmuebleRubros");
      const data = await response.json();
      setRubros(data);
    };

    const fetchEstados = async () => {
      const response = await fetch("/api/inmuebleEstados");
      const data = await response.json();
      setEstados(data);
    };

    fetchRubros();
    fetchEstados();
  }, []);

  // Función de autenticación
  const authenticateUser = async () => {
    try {
      const sessionData = await getSession();

      if (!sessionData) {
        setError("No autenticado. Por favor inicia sesión.");
        setLoading(false); // Finalizamos el estado de carga
        return;
      }

      if (sessionData.user.role !== "administrador") {
        setError("No autorizado para acceder a esta página.");
        setLoading(false); // Finalizamos el estado de carga
        return;
      }

      setSession(sessionData);
      setLoading(false); // Finalizamos el estado de carga
    } catch (err) {
      setError("Error al autenticar al usuario.");
      setLoading(false); // Finalizamos el estado de carga
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "garaje" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const inmuebleData = {
      ...formData,
      id_rubro: Number(formData.id_rubro),
      id_estado: Number(formData.id_estado),
      num_habitaciones: Number(formData.num_habitaciones),
      num_baños: Number(formData.num_baños),
      superficie: Number(formData.superficie),
      ruta_imagen: "/img/imagen_generica.webp",
      eliminado: false,
    };

    console.log("Datos del formulario a enviar:", inmuebleData);

    try {
      const response = await fetch("/api/inmuebles", {
        method: "POST",
        body: JSON.stringify(inmuebleData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Inmueble creado con éxito.");
      } else {
        alert(data.error || "Error desconocido.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Hubo un error al intentar crear el inmueble.");
    }
  };

  if (loading) {
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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">No autenticado o no autorizado.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Crear Inmueble
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-800"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa el título del inmueble"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="id_rubro"
              className="block text-sm font-medium text-gray-800"
            >
              Rubro
            </label>
            <select
              id="id_rubro"
              name="id_rubro"
              value={formData.id_rubro}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione un rubro</option>
              {rubros.map((rubro) => (
                <option key={rubro.id} value={rubro.id}>
                  {rubro.rubro}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="localidad"
              className="block text-sm font-medium text-gray-800"
            >
              Localidad
            </label>
            <input
              type="text"
              id="localidad"
              name="localidad"
              value={formData.localidad}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa la localidad"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="direccion"
              className="block text-sm font-medium text-gray-800"
            >
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa la dirección"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="barrio"
              className="block text-sm font-medium text-gray-800"
            >
              Barrio
            </label>
            <input
              type="text"
              id="barrio"
              name="barrio"
              value={formData.barrio}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa el barrio"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="num_habitaciones"
              className="block text-sm font-medium text-gray-800"
            >
              Número de Habitaciones
            </label>
            <input
              type="number"
              id="num_habitaciones"
              name="num_habitaciones"
              value={formData.num_habitaciones}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Número de habitaciones"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="num_baños"
              className="block text-sm font-medium text-gray-800"
            >
              Número de Baños
            </label>
            <input
              type="number"
              id="num_baños"
              name="num_baños"
              value={formData.num_baños}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Número de baños"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="superficie"
              className="block text-sm font-medium text-gray-800"
            >
              Superficie
            </label>
            <input
              type="number"
              id="superficie"
              name="superficie"
              value={formData.superficie}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Superficie en m²"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="garaje"
              className="block text-sm font-medium text-gray-800"
            >
              ¿Cuenta con garaje?
            </label>
            <input
              type="checkbox"
              id="garaje"
              name="garaje"
              checked={formData.garaje}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="id_estado"
              className="block text-sm font-medium text-gray-800"
            >
              Estado
            </label>
            <select
              id="id_estado"
              name="id_estado"
              value={formData.id_estado}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione un estado</option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.estado}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg"
          >
            Crear Inmueble
          </button>
        </form>
      </div>
    </div>
  );
}
