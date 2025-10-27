"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/actions/auth-actions";

type FormData = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  DNI: number;
  direccion: string;
  cuit: string;
  fechaNacimiento: string;
};

export default function EditarAgente({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    DNI: 0,
    direccion: "",
    cuit: "",
    fechaNacimiento: "",
  });

  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [personaId, setPersonaId] = useState<string>("");
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

      setPersonaId(persona.id);
      setFormData({
        nombre: persona.nombre || "",
        apellido: persona.apellido || "",
        telefono: persona.telefono || "",
        email: persona.correo || "",
        DNI: persona.dni || 0,
        direccion: persona.direccion || "",
        cuit: empleado.cuit || "",
        fechaNacimiento: persona.fecha_nacimiento
          ? new Date(persona.fecha_nacimiento).toISOString().split('T')[0]
          : "",
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
    setSaving(true);

    const agenteData = {
      ...formData,
      DNI: Number(formData.DNI),
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
        alert(data.error || "Error desconocido.");
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
          Editar Agente
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                {!imagePreview && (
                  <div className="mt-2 mb-2">
                    <img
                      src={existingImage || "/img/no-image.webp"}
                      alt="Imagen actual"
                      className="w-32 h-32 object-cover rounded-full border"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {existingImage ? "Imagen actual" : "Sin imagen"}
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
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
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/agentes")}
              className="w-full bg-gray-500 text-white py-3 px-4 rounded-full text-sm font-sans hover:bg-gray-600 transition-colors"
            >
              Volver a Agentes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-full text-sm font-sans hover:bg-red-600 transition-colors"
            >
              Eliminar Agente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
