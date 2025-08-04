"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/actions/auth-actions";
import { FaEdit } from "react-icons/fa";

const AgenteDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [agente, setAgente] = useState<any>(null);
  const [id, setId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [editField, setEditField] = useState<string>("");
  const [editValue, setEditValue] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchAgente = async () => {
      try {
        const response = await fetch(`/api/agentes/${id}`);
        if (!response.ok) throw new Error("Error al obtener el agente");
        const data = await response.json();
        setAgente(data.data || data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAgente();
  }, [id]);

  useEffect(() => {
    const fetchSession = async () => {
      const s = await getSession();
      setSession(s);
    };
    fetchSession();
  }, []);

  if (!agente) return null;
  const { persona, empleado } = agente;
  const canEdit =
    session &&
    (session.user.role === "administrador" ||
      session.user.email === persona.email);

  // --- Edición de campos ---
  const openEditModal = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value || "");
    setEditMode(true);
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
  };
  const closeEditModal = () => {
    setEditMode(false);
    setEditField("");
    setEditValue("");
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
  };
  const handleEditSave = async () => {
    if (!editField || (!editValue && editField !== "imagen" && !selectedImage))
      return;
    try {
      if (editField === "imagen" && selectedImage) {
        // Subir imagen
        const formDataImg = new FormData();
        formDataImg.append("id_persona", persona.id?.toString() || "");
        formDataImg.append("image", selectedImage);
        const imgRes = await fetch("/api/personaImagen", {
          method: "POST",
          body: formDataImg,
        });
        if (!imgRes.ok) throw new Error("Error al subir la imagen");
      } else {
        // PUT campo
        const res = await fetch(`/api/agentes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field: editField, value: editValue }),
        });
        if (!res.ok) throw new Error("Error al actualizar el campo");
      }
      closeEditModal();
      // Refrescar datos
      const response = await fetch(`/api/agentes/${id}`);
      const data = await response.json();
      setAgente(data.data || data);
    } catch (err: any) {
      setError(err.message || "Error al guardar los cambios");
    }
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

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Detalles del Agente
        </h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {persona.imagen && (
              <img
                src={persona.imagen}
                alt="Foto de perfil"
                className="w-32 h-32 object-cover rounded-full border mb-2"
              />
            )}
            {canEdit && (
              <button
                className="absolute top-0 right-0 bg-white rounded-full p-1 border shadow"
                onClick={() => openEditModal("imagen", "")}
                title="Editar imagen"
              >
                <FaEdit />
              </button>
            )}
          </div>
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Nombre:</span>{" "}
                {persona.nombre}
              </p>
              {canEdit && (
                <button
                  onClick={() => openEditModal("nombre", persona.nombre)}
                  title="Editar nombre"
                >
                  <FaEdit />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Apellido:</span>{" "}
                {persona.apellido}
              </p>
              {canEdit && (
                <button
                  onClick={() => openEditModal("apellido", persona.apellido)}
                  title="Editar apellido"
                >
                  <FaEdit />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Dirección:</span>{" "}
                {persona.direccion}
              </p>
              {canEdit && (
                <button
                  onClick={() => openEditModal("direccion", persona.direccion)}
                  title="Editar dirección"
                >
                  <FaEdit />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Email:</span>{" "}
                {persona.email}
              </p>
              {canEdit && (
                <button
                  onClick={() => openEditModal("email", persona.email)}
                  title="Editar email"
                >
                  <FaEdit />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Teléfono:</span>{" "}
                {persona.telefono}
              </p>
              {canEdit && (
                <button
                  onClick={() => openEditModal("telefono", persona.telefono)}
                  title="Editar teléfono"
                >
                  <FaEdit />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">CUIT:</span>{" "}
                {empleado.CUIT}
              </p>
              {/* Si se desea permitir edición de CUIT, agregar botón aquí */}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Fecha de Alta:
                </span>{" "}
                {new Date(empleado.fecha_alta).toLocaleDateString()}
              </p>
            </div>
            {empleado.fecha_baja && (
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Fecha de Baja:
                  </span>{" "}
                  {new Date(empleado.fecha_baja).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Modal de edición */}
        {editMode && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-[90vw]">
              <h3 className="text-lg font-semibold mb-4">
                Editar{" "}
                {editField === "imagen"
                  ? "Imagen"
                  : editField.charAt(0).toUpperCase() + editField.slice(1)}
              </h3>
              {editField === "imagen" ? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Previsualización"
                      className="mt-2 w-32 h-32 object-cover rounded-full border"
                    />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  className="border rounded p-2 w-full"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
              )}
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-[#083C2C] text-white rounded hover:bg-[#0A4A35]"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgenteDetail;
