"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/actions/auth-actions";
import { Mail } from "lucide-react";

type FormData = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  DNI: string;
  direccion: string;
  cuit: string;
  fechaNacimiento: string;
  activo: boolean;
};

export default function EditarAgente({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    DNI: "",
    direccion: "",
    cuit: "",
    fechaNacimiento: "",
    activo: true,
  });

  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [personaId, setPersonaId] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

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
      setError("Error al autenticar al usuario.");
      setLoading(false);
    }
  };

  // Cargar datos del agente
  const loadAgente = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/agentes/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener el agente.");
      }

      const data = await response.json();
      const { persona, empleado } = data.data;

      // Activo si NO tiene fecha de egreso
      const estaActivo = !empleado.fecha_egreso;
      console.log("Estado del empleado - fecha_egreso:", empleado.fecha_egreso, "activo:", estaActivo);

      setPersonaId(persona.id);
      setFormData({
        nombre: persona.nombre || "",
        apellido: persona.apellido || "",
        telefono: persona.telefono || "",
        email: persona.correo || "",
        DNI: persona.dni ? String(persona.dni) : "",
        direccion: persona.direccion || "",
        cuit: empleado.cuit || "",
        fechaNacimiento: persona.fecha_nacimiento
          ? new Date(persona.fecha_nacimiento).toISOString().split('T')[0]
          : "",
        activo: estaActivo,
      });

      if (persona.imagenes && persona.imagenes.length > 0) {
        setExistingImage(persona.imagenes[0].imagen);
      }

      setLoading(false);
    } catch (err) {
      setError("Error al cargar los datos del agente.");
      setLoading(false);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    if (id && session) {
      loadAgente();
    }
  }, [id, session]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
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
    setSaving(true);
    setValidationErrors({});

    const agenteData = {
      ...formData,
      DNI: formData.DNI,
      activo: formData.activo, // Enviar el estado activo al backend
    };

    try {
      const response = await fetch(`/api/agentes/${id}`, {
        method: "PUT",
        body: JSON.stringify(agenteData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Subir imagen si hay una nueva
        if (selectedImage && personaId) {
          const formDataImg = new FormData();
          formDataImg.append("id_persona", personaId);
          formDataImg.append("image", selectedImage);
          const imgRes = await fetch("/api/personaImagen", {
            method: "POST",
            body: formDataImg,
          });
          if (imgRes.ok) {
            alert("Agente actualizado con imagen.");
          } else {
            alert("Agente actualizado, pero la imagen no se pudo guardar.");
          }
        } else {
          alert("Agente actualizado con éxito.");
        }
        router.push("/agentes");
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
        setSaving(false);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Hubo un error al intentar actualizar el agente.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Está seguro de que desea eliminar este agente?")) return;

    try {
      const response = await fetch(`/api/agentes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Agente eliminado con éxito.");
        router.push("/agentes");
      } else {
        const data = await response.json();
        alert(data.error || "Error al eliminar agente.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al eliminar el agente.");
    }
  };

  const handleResendEmail = async () => {
    if (sendingEmail) return;

    if (!confirm(`¿Deseas reenviar el email de establecimiento de contraseña a ${formData.email}?`)) {
      return;
    }

    setSendingEmail(true);

    try {
      const response = await fetch("/api/send-set-password-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personaId: personaId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Email enviado exitosamente a ${formData.email}`);
      } else {
        alert(data.error || "Error al enviar el email");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión al enviar el email");
    } finally {
      setSendingEmail(false);
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Editar Agente</h1>
            <p className="text-gray-600 mt-2">Modifica los datos del agente en el sistema</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push("/agentes")}
              className="bg-gray-500 text-white py-2 px-3 rounded-md hover:bg-gray-600 transition-colors font-medium text-sm"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={sendingEmail}
              className="bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2"
              title="Reenviar email de contraseña"
            >
              <Mail size={16} />
              {sendingEmail ? "Enviando..." : "Reenviar Email Contraseña"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition-colors font-medium text-sm"
            >
              Eliminar
            </button>
            <button
              type="submit"
              form="agente-form"
              className="bg-[#6FC6D1] text-white py-2 px-3 rounded-md hover:bg-[#5AB5C1] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form id="agente-form" onSubmit={handleSubmit}>
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
                />
                {validationErrors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.nombre[0]}</p>
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
                />
                {validationErrors.apellido && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.apellido[0]}</p>
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
                  placeholder="Ingresa el teléfono"
                  required
                />
                {validationErrors.telefono && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.telefono[0]}</p>
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
                  placeholder="Ingresa el email"
                  required
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email[0]}</p>
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
                  <p className="text-red-500 text-xs mt-1">{validationErrors.DNI[0]}</p>
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
                  placeholder="Ingresa la dirección"
                  required
                />
                {validationErrors.direccion && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.direccion[0]}</p>
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
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
                  placeholder="Ingresa el CUIT"
                  required
                />
                {validationErrors.cuit && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.cuit[0]}</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] bg-white"
                  required
                />
                {validationErrors.fechaNacimiento && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.fechaNacimiento[0]}</p>
                )}
              </div>
            </div>

            {/* Checkbox Agente Activo */}
            <div className="mt-4">
              <label htmlFor="activo" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-[#6FC6D1] w-4 h-4"
                />
                Agente Activo
              </label>
            </div>

            {/* Imagen de perfil - ancho completo */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen de perfil
              </label>
              {!imagePreview && existingImage && (
                <div className="mb-2">
                  <img
                    src={existingImage}
                    alt="Imagen actual"
                    className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">Imagen actual</p>
                </div>
              )}
              <input
                ref={fileInputRef}
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
          </form>
        </div>
      </div>
    </div>
  );
}
