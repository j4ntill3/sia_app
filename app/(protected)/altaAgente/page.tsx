"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/actions/auth-actions";

type FormData = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  DNI: string;
  direccion: string;
  cuit: string;
  fechaNacimiento: string;
};

export default function CrearAgente() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    DNI: "",
    direccion: "",
    cuit: "",
    fechaNacimiento: "",
  });

  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  // Función para formatear CUIT automáticamente
  const formatCUIT = (value: string) => {
    // Remover todos los caracteres que no sean dígitos
    const digits = value.replace(/\D/g, '');

    // Formatear como XX-XXXXXXXX-X
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`;
    }
  };

  const handleCUITChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCUIT(e.target.value);
    setFormData((prev) => ({
      ...prev,
      cuit: formatted,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const agenteData = {
      ...formData,
      DNI: formData.DNI,
      fechaNacimiento: formData.fechaNacimiento,
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
            alert(`Agente creado con éxito.\n\nContraseña temporal: ${data.data.temporaryPassword}\n\nPor favor, comunique esta contraseña al agente de forma segura.`);
          } else {
            alert(`Agente creado, pero la imagen no se pudo guardar.\n\nContraseña temporal: ${data.data.temporaryPassword}`);
          }
        } else {
          alert(`Agente creado con éxito.\n\nContraseña temporal: ${data.data.temporaryPassword}\n\nPor favor, comunique esta contraseña al agente de forma segura.`);
        }

        // Limpiar formulario
        setFormData({
          nombre: "",
          apellido: "",
          telefono: "",
          email: "",
          DNI: "",
          direccion: "",
          cuit: "",
          fechaNacimiento: "",
        });
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        // Manejar errores de validación del backend
        if (data.detalles) {
          setValidationErrors(data.detalles);

          // Construir mensaje detallado con los campos con error
          const camposConError = Object.keys(data.detalles).map(campo => {
            const mensajesError = data.detalles[campo];
            const nombreCampo = {
              nombre: "Nombre",
              apellido: "Apellido",
              telefono: "Teléfono",
              email: "Email",
              DNI: "DNI",
              direccion: "Dirección",
              cuit: "CUIT",
              fechaNacimiento: "Fecha de Nacimiento"
            }[campo] || campo;

            return `• ${nombreCampo}: ${mensajesError[0]}`;
          }).join('\n');

          alert(`Hay errores en el formulario:\n\n${camposConError}`);
        } else {
          alert(data.error || "Error desconocido.");
        }
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
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
                  placeholder="Ingresa el nombre"
                  required
                  minLength={2}
                  maxLength={100}
                />
                {validationErrors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.nombre[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="apellido"
                  className="block text-sm font-sans font-medium text-[#083C2C]"
                >
                  Apellido *
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
                  placeholder="Ingresa el apellido"
                  required
                  minLength={2}
                  maxLength={100}
                />
                {validationErrors.apellido && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.apellido[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-sans font-medium text-[#083C2C]"
                >
                  Teléfono *
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
                  placeholder="Ej: +54 11 1234-5678"
                  required
                  minLength={8}
                  maxLength={20}
                  pattern="[0-9+\-\s()]+"
                  title="Solo números, +, -, espacios y paréntesis"
                />
                {validationErrors.telefono && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.telefono[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-sans font-medium text-[#083C2C]"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
                  placeholder="ejemplo@correo.com"
                  required
                  maxLength={100}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="DNI"
                  className="block text-sm font-sans font-medium text-[#083C2C]"
                >
                  DNI *
                </label>
                <input
                  type="text"
                  id="DNI"
                  name="DNI"
                  value={formData.DNI}
                  onChange={handleInputChange}
                  className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
                  placeholder="Ej: 12345678"
                  required
                  pattern="\d{7,8}"
                  minLength={7}
                  maxLength={8}
                  title="El DNI debe tener 7 u 8 dígitos"
                />
                {validationErrors.DNI && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.DNI[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Columna 2 */}
              <div>
                <label
                  htmlFor="direccion"
                  className="block text-sm font-sans font-medium text-[#083C2C]"
                >
                  Dirección *
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
                  placeholder="Ej: Av. Corrientes 1234"
                  required
                  minLength={5}
                  maxLength={200}
                />
                {validationErrors.direccion && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.direccion[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cuit"
                  className="block text-sm font-sans font-medium text-[#083C2C]"
                >
                  CUIT *
                </label>
                <input
                  type="text"
                  id="cuit"
                  name="cuit"
                  value={formData.cuit}
                  onChange={handleCUITChange}
                  className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
                  placeholder="Ej: 20-12345678-9"
                  required
                  pattern="\d{2}-\d{8}-\d{1}"
                  maxLength={13}
                  title="Formato: XX-XXXXXXXX-X"
                />
                {validationErrors.cuit && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.cuit[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="fechaNacimiento"
                  className="block text-sm font-sans font-medium text-[#083C2C]"
                >
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
                  required
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                />
                {validationErrors.fechaNacimiento && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.fechaNacimiento[0]}</p>
                )}
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
