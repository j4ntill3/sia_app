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

export default function CrearAdministrador() {
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    // Función de autenticación
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
      } catch (err) {
        console.error("Error en authenticateUser:", err);
        setError("Error al autenticar al usuario.");
      } finally {
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

    const administradorData = {
      ...formData,
      DNI: formData.DNI,
      fechaNacimiento: formData.fechaNacimiento,
    };

    try {
      const response = await fetch("/api/administradores", {
        method: "POST",
        body: JSON.stringify(administradorData),
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
            if (data.data.emailSent) {
              alert(`Administrador creado con éxito.\n\nSe ha enviado un email a ${data.data.email} con instrucciones para establecer su contraseña.`);
            } else {
              alert(`Administrador creado con éxito, pero el email no se pudo enviar.\n\nPuedes reenviar el email desde la lista de administradores.`);
            }
          } else {
            alert(`Administrador creado, pero la imagen no se pudo guardar.\n\n${data.data.emailSent ? `Email enviado a ${data.data.email}` : 'El email no se pudo enviar. Puedes reenviarlo desde la lista de administradores.'}`);
          }
        } else {
          if (data.data.emailSent) {
            alert(`Administrador creado con éxito.\n\nSe ha enviado un email a ${data.data.email} con instrucciones para establecer su contraseña.`);
          } else {
            alert(`Administrador creado con éxito, pero el email no se pudo enviar.\n\nPuedes reenviar el email desde la lista de administradores.`);
          }
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
      alert("Hubo un error al intentar crear el administrador.");
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
    <div className="min-h-[calc(100vh-80px-56px)] bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Alta Administrador</h1>
          <p className="text-gray-600 mt-2">Completa los datos para crear un nuevo administrador en el sistema</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
                  placeholder="Ingresa el nombre"
                  required
                  minLength={2}
                  maxLength={100}
                />
                {validationErrors.nombre && (
                  <p className="text-red-500 text-xs mt-1">
                    {Array.isArray(validationErrors.nombre) ? validationErrors.nombre[0] : validationErrors.nombre}
                  </p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
                  placeholder="Ingresa el apellido"
                  required
                  minLength={2}
                  maxLength={100}
                />
                {validationErrors.apellido && (
                  <p className="text-red-500 text-xs mt-1">
                    {Array.isArray(validationErrors.apellido) ? validationErrors.apellido[0] : validationErrors.apellido}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
                  placeholder="Ej: +54 11 1234-5678"
                  required
                  minLength={8}
                  maxLength={20}
                  pattern="[0-9+\-\s()]+"
                  title="Solo números, +, -, espacios y paréntesis"
                />
                {validationErrors.telefono && (
                  <p className="text-red-500 text-xs mt-1">
                    {Array.isArray(validationErrors.telefono) ? validationErrors.telefono[0] : validationErrors.telefono}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
                  placeholder="ejemplo@correo.com"
                  required
                  maxLength={100}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {Array.isArray(validationErrors.email) ? validationErrors.email[0] : validationErrors.email}
                  </p>
                )}
              </div>

              {/* DNI */}
              <div>
                <label htmlFor="DNI" className="block text-sm font-medium text-gray-700 mb-1">
                  DNI *
                </label>
                <input
                  type="text"
                  id="DNI"
                  name="DNI"
                  value={formData.DNI}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
                  placeholder="Ej: 12345678"
                  required
                  pattern="\d{7,8}"
                  minLength={7}
                  maxLength={8}
                  title="El DNI debe tener 7 u 8 dígitos"
                />
                {validationErrors.DNI && (
                  <p className="text-red-500 text-xs mt-1">
                    {Array.isArray(validationErrors.DNI) ? validationErrors.DNI[0] : validationErrors.DNI}
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
                  placeholder="Ej: Av. Corrientes 1234"
                  required
                  minLength={5}
                  maxLength={200}
                />
                {validationErrors.direccion && (
                  <p className="text-red-500 text-xs mt-1">
                    {Array.isArray(validationErrors.direccion) ? validationErrors.direccion[0] : validationErrors.direccion}
                  </p>
                )}
              </div>

              {/* CUIT */}
              <div>
                <label htmlFor="cuit" className="block text-sm font-medium text-gray-700 mb-1">
                  CUIT *
                </label>
                <input
                  type="text"
                  id="cuit"
                  name="cuit"
                  value={formData.cuit}
                  onChange={handleCUITChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
                  placeholder="Ej: 20-12345678-9"
                  required
                  pattern="\d{2}-\d{8}-\d{1}"
                  maxLength={13}
                  title="Formato: XX-XXXXXXXX-X"
                />
                {validationErrors.cuit && (
                  <p className="text-red-500 text-xs mt-1">
                    {Array.isArray(validationErrors.cuit) ? validationErrors.cuit[0] : validationErrors.cuit}
                  </p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
                  required
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                />
                {validationErrors.fechaNacimiento && (
                  <p className="text-red-500 text-xs mt-1">
                    {Array.isArray(validationErrors.fechaNacimiento) ? validationErrors.fechaNacimiento[0] : validationErrors.fechaNacimiento}
                  </p>
                )}
              </div>
            </div>

            {/* Imagen de perfil - ancho completo */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen de perfil
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#6FC6D1] file:text-white hover:file:bg-[#5AB5C1]"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Previsualización"
                    className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-[#6FC6D1] text-white py-3 px-4 rounded-md hover:bg-[#5AB5C1] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                Crear Administrador
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
