"use client";

import { useState, useEffect } from "react";
import { InmuebleRubro } from "@/types/inmueble_rubro";
import { InmuebleEstado } from "@/types/inmueble_estado";
import { getSession } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const [rubros, setRubros] = useState<InmuebleRubro[]>([]);
  const [estados, setEstados] = useState<InmuebleEstado[]>([]);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      ruta_imagen: "/img/image-icon-600nw-211642900.webp",
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
        router.push("/inmuebles");
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
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">No autenticado o no autorizado.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-4 items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm py-4 px-6 bg-white shadow-md rounded-2xl">
        <h2 className="text-3xl font-bold text-center mt-2 mb-2 text-[#083C2C]">
          Alta Inmueble
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa el título del inmueble"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="id_rubro"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Rubro
            </label>
            <select
              id="id_rubro"
              name="id_rubro"
              value={formData.id_rubro}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
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
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Localidad
            </label>
            <input
              type="text"
              id="localidad"
              name="localidad"
              value={formData.localidad}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa la localidad"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="direccion"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa la dirección"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="barrio"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Barrio
            </label>
            <input
              type="text"
              id="barrio"
              name="barrio"
              value={formData.barrio}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa el barrio"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="num_habitaciones"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Número de Habitaciones
            </label>
            <input
              type="number"
              id="num_habitaciones"
              name="num_habitaciones"
              value={formData.num_habitaciones}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Número de habitaciones"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="num_baños"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Número de Baños
            </label>
            <input
              type="number"
              id="num_baños"
              name="num_baños"
              value={formData.num_baños}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Número de baños"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="superficie"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Superficie
            </label>
            <input
              type="number"
              id="superficie"
              name="superficie"
              value={formData.superficie}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Superficie en m²"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="garaje"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              ¿Cuenta con garaje?
            </label>
            <input
              type="checkbox"
              id="garaje"
              name="garaje"
              checked={formData.garaje}
              onChange={handleInputChange}
              className="rounded mt-1 focus:ring-[#083C2C]"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="id_estado"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Estado
            </label>
            <select
              id="id_estado"
              name="id_estado"
              value={formData.id_estado}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
            >
              <option value="">Seleccione un estado</option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.estado}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-1.5">
            <button
              type="submit"
              className="w-full bg-[#6FC6D1] text-white py-2 px-4 rounded-full text-sm font-sans hover:underline"
            >
              Crear Inmueble
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
