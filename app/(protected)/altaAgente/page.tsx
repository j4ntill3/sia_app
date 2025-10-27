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
  fechaNacimiento: string;
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
    fechaNacimiento: "",
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
      fechaNacimiento: formData.fechaNacimiento,
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
    <div className="min-h-[calc(100vh-80px-56px)] flex flex-col items-center bg-gray-100 p-4 md:p-8">
      <div className="w-full max-w-5xl py-6 px-6 md:px-10 bg-white shadow-md rounded-2xl">
        <h2 className="text-3xl font-bold text-center mt-2 mb-6 text-[#083C2C]">
          Alta Agente
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-4">
              {/* Columna 1 */}
              <div>
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

              <div>
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

              <div>
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

              <div>
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

              <div>
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
            </div>

            <div className="space-y-4">
              {/* Columna 2 */}
              <div>
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

              <div>
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

              <div>
                <label
                  htmlFor="fechaNacimiento"
                  className="block text-sm font-sans font-medium text-[#083C2C]"
                >
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-[#083C2C]">
                  Imagen de perfil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C] rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6FC6D1] file:text-white hover:file:bg-[#5ab5c0]"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Previsualización"
                    className="mt-2 w-32 h-32 object-cover rounded-full border"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="submit"
              className="w-full bg-[#6FC6D1] text-white py-3 px-4 rounded-full text-sm font-sans hover:bg-[#5ab5c0] transition-colors"
            >
              Crear Agente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
