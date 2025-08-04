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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const agenteData = {
      ...formData,
      tipoId: Number(formData.tipoId),
      DNI: Number(formData.DNI),
      fechaAlta: formData.fechaAlta,
      fechaBaja: formData.fechaBaja || null,
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

      if (response.ok && data.data && data.data.personaId) {
        // Subir imagen si hay
        if (selectedImage) {
          const formDataImg = new FormData();
          formDataImg.append("id_persona", data.data.personaId.toString());
          formDataImg.append("image", selectedImage);
          const imgRes = await fetch("/api/personaImagen", {
            method: "POST",
            body: formDataImg,
          });
          const imgData = await imgRes.json();
          if (imgRes.ok && imgData.data?.image?.imagePath) {
            alert("Agente creado con imagen.");
          } else {
            alert("Agente creado, pero la imagen no se pudo guardar.");
          }
        } else {
          alert("Agente creado con éxito.");
        }
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
    <div className="min-h-[calc(100vh-80px-56px)] flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full my-4 max-w-sm px-8 bg-white shadow-md text-[#083C2C] rounded-2xl">
        <h2 className="text-3xl font-bold pt-4 text-center text-[#083C2C]">
          Alta Agente
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa el nombre"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="apellido"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa el apellido"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="telefono"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa el teléfono"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa el email"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="DNI"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              DNI
            </label>
            <input
              type="number"
              id="DNI"
              name="DNI"
              value={formData.DNI}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa el DNI"
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
              htmlFor="cuit"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              CUIT
            </label>
            <input
              type="text"
              id="cuit"
              name="cuit"
              value={formData.cuit}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa el CUIT"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="fechaAlta"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Fecha de Alta
            </label>
            <input
              type="date"
              id="fechaAlta"
              name="fechaAlta"
              value={formData.fechaAlta}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="fechaBaja"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Fecha de Baja (opcional)
            </label>
            <input
              type="date"
              id="fechaBaja"
              name="fechaBaja"
              value={formData.fechaBaja}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-sans font-medium text-[#083C2C]">
              Imagen de perfil
            </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Previsualización"
                className="mt-2 w-32 h-32 object-cover rounded-full border"
              />
            )}
          </div>

          <div className="pb-4">
            <button
              type="submit"
              className="w-full bg-[#083C2C] text-white rounded-full py-2 hover:bg-[#0A4A35] transition-colors"
            >
              Crear Agente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
