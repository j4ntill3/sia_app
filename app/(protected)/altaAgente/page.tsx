"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/actions/auth-actions";

type FormData = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  DNI: number;
  direccion: string;
  tipoId: number | string;
  cuit: string;
  fechaAlta: string;
  fechaBaja: string;
};

export default function CrearAgente() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    DNI: 0,
    direccion: "",
    tipoId: "",
    cuit: "",
    fechaAlta: "",
    fechaBaja: "",
  });

  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const sessionData = await getSession();

        if (!sessionData) {
          setError("No autenticado. Por favor inicia sesión.");
          setLoading(false);
          return;
        }

        if (sessionData.user.role !== "administrador") {
          setError("No autorizado para acceder a esta página.");
          setLoading(false);
          return;
        }

        setSession(sessionData);
        setLoading(false);
      } catch (err) {
        setError("Error al autenticar al usuario.");
        setLoading(false);
      }
    };

    authenticateUser();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const agenteData = {
      ...formData,
      tipoId: Number(formData.tipoId),
      DNI: Number(formData.DNI),
      fechaAlta: formData.fechaAlta,
      fechaBaja: formData.fechaBaja || null, // Puede no tener fecha de baja aún
      eliminado: false,
    };

    try {
      const response = await fetch("/api/agentes", {
        method: "POST",
        body: JSON.stringify(agenteData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Agente creado con éxito.");
      } else {
        alert(data.error || "Error desconocido.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Hubo un error al intentar crear el agente.");
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
          Crear Agente
        </h2>
        <form onSubmit={handleSubmit}>
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
              placeholder="Ingresa el nombre"
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
              placeholder="Ingresa el apellido"
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
              placeholder="Ingresa el teléfono"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa el email"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="DNI"
              className="block text-sm font-medium text-gray-800"
            >
              DNI
            </label>
            <input
              type="number"
              id="DNI"
              name="DNI"
              value={formData.DNI}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa el DNI"
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
              htmlFor="cuit"
              className="block text-sm font-medium text-gray-800"
            >
              CUIT
            </label>
            <input
              type="text"
              id="cuit"
              name="cuit"
              value={formData.cuit}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa el CUIT"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg"
          >
            Crear Agente
          </button>
        </form>
      </div>
    </div>
  );
}
