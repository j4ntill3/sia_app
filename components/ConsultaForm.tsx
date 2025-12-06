"use client";

import { useState } from "react";

interface ConsultaFormProps {
  inmuebleId: string;
  onSuccess?: () => void;
  hideTitle?: boolean;
}

const ConsultaForm: React.FC<ConsultaFormProps> = ({ inmuebleId, onSuccess, hideTitle = false }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [telefonoError, setTelefonoError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Validar teléfono en tiempo real
    if (name === "telefono") {
      if (value && !/^\d+$/.test(value)) {
        setTelefonoError("El teléfono solo puede contener números");
      } else if (value && value.length < 8) {
        setTelefonoError("El teléfono debe tener al menos 8 dígitos");
      } else if (value && value.length > 20) {
        setTelefonoError("El teléfono no puede exceder 20 dígitos");
      } else {
        setTelefonoError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que no haya errores de teléfono antes de enviar
    if (telefonoError) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/consultas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inmueble_id: inmuebleId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar la consulta");
      }

      setSuccess(true);
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        descripcion: "",
      });

      // Si hay callback onSuccess, ejecutarlo después de 1.5 segundos
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Error al enviar la consulta");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-green-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-semibold">¡Consulta enviada exitosamente!</h3>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-green-800 underline hover:text-green-900"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <div className={hideTitle ? "" : "bg-white shadow-md rounded-lg p-6"}>
      {!hideTitle && (
        <h3 className="text-2xl font-semibold text-[#083C2C] mb-4">
          Consultar sobre esta propiedad
        </h3>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${
                telefonoError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#6FC6D1]"
              }`}
            />
            {telefonoError && (
              <p className="mt-1 text-sm text-red-600">{telefonoError}</p>
            )}
          </div>
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] text-gray-900"
            />
          </div>
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] text-gray-900"
            placeholder="Cuéntanos más sobre tu interés en esta propiedad..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6FC6D1] text-white py-3 px-4 rounded-md hover:bg-[#5AB5C1] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? "Enviando..." : "Enviar consulta"}
        </button>
      </form>
    </div>
  );
};

export default ConsultaForm;
