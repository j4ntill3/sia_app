"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/actions/auth-actions";

type FormData = {
  id_inmueble: number | string;
  id_agente: number | string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  descripcion: string;
};

export default function CrearConsulta() {
  const [formData, setFormData] = useState<FormData>({
    id_inmueble: "",
    id_agente: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    descripcion: "",
  });

  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Autenticación
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const sessionData = await getSession();

        if (!sessionData) {
          setError("No autenticado. Por favor inicia sesión.");
          setLoading(false); // Finalizamos el estado de carga
          return;
        }

        setSession(sessionData);
        setLoading(false);
      } catch (err) {
        setError("Error al autenticar al usuario.");
        setLoading(false); // Finalizamos el estado de carga
      }
    };

    authenticateUser();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de campos obligatorios
    if (!formData.id_inmueble || !formData.nombre || !formData.apellido) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Asegurarnos de incluir el id_agente desde la sesión
    const consultaData = {
      ...formData,
      id_inmueble: Number(formData.id_inmueble),
      id_agente: Number(session.user.id), // Usamos id_agente de la sesión
      fecha: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/registrarConsultaCliente", {
        method: "POST",
        body: JSON.stringify(consultaData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Consulta creada con éxito.");
      } else {
        alert(data.error || "Error desconocido.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Hubo un error al intentar crear la consulta.");
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
          Crear Consulta
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="id_inmueble"
              className="block text-sm font-medium text-gray-800"
            >
              Inmueble
            </label>
            <input
              type="number"
              id="id_inmueble"
              name="id_inmueble"
              value={formData.id_inmueble}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ID del inmueble"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-800"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa nombre del cliente"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="apellido"
              className="block text-sm font-medium text-gray-800"
            >
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa apellido del cliente"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-gray-800"
            >
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa teléfono del cliente"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa correo electrónico"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-800"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe tu consulta"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg"
          >
            Crear Consulta
          </button>
        </form>
      </div>
    </div>
  );
}
