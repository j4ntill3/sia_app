"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/actions/auth-actions";
import { PropertyCategory } from "@/types/inmueble_rubro";
import { PropertyStatus } from "@/types/inmueble_estado";

const InmuebleDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [session, setSession] = useState<any>(null);
  const [inmueble, setInmueble] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editField, setEditField] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [rubros, setRubros] = useState<PropertyCategory[]>([]);
  const [estados, setEstados] = useState<PropertyStatus[]>([]);
  const [agentId, setAgentId] = useState<number | null>(null);

  const router = useRouter();

  const fetchInmueble = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/inmuebles/${id}`);
      if (!response.ok) throw new Error("Error al obtener el inmueble");

      const data = await response.json();
      setInmueble(data.data);
    } catch {
      setError("Ocurrió un error al cargar los detalles.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchRubros = async () => {
      const response = await fetch("/api/inmuebleRubros");
      const data = await response.json();
      setRubros(data.data || []);
    };

    const fetchEstados = async () => {
      const response = await fetch("/api/inmuebleEstados");
      const data = await response.json();
      setEstados(data.data || []);
    };

    fetchRubros();
    fetchEstados();
  }, []);

  useEffect(() => {
    const resolveSessionAndParams = async () => {
      try {
        const sessionData = await getSession();

        if (!sessionData) {
          setError("No autenticado. Por favor inicia sesión.");
          return;
        }

        setSession(sessionData);

        const resolvedParams = await params;
        setId(resolvedParams.id);
      } catch {
        setError("No se pudieron obtener los datos necesarios.");
      } finally {
        setIsLoading(false);
      }
    };

    resolveSessionAndParams();
  }, [params]);

  const handleAssignAgent = async () => {
    if (agentId && id) {
      // Realizar la solicitud PUT a la API para asignar el agente
      try {
        const response = await fetch(`/api/asignacionAgente/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agentId: agentId,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al asignar el agente.");
        }

        const data = await response.json();
        console.log(data.message);

        alert("Agente asignado al inmueble con éxito");

        setIsAgentModalOpen(false);
      } catch (error) {
        console.error("Error al asignar el agente:", error);
        setError("Ocurrió un error al asignar el agente.");
      }
    }
  };

  const closeModal = () => {
    setIsImageModalOpen(false);
    setIsAgentModalOpen(false);
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "¿Estás seguro que deseas eliminar este inmueble?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/inmuebles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error desconocido al eliminar el inmueble");
      }

      alert("Inmueble eliminado exitosamente.");
      router.push("/inmuebles");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Ocurrió un error al eliminar el inmueble.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSaveImage = async () => {
    if (!imageFile || !id) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      try {
        const response = await fetch("/api/uploadImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: base64Image,
            fileName: imageFile.name,
            propertyId: id,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setIsImageModalOpen(false);
          window.location.reload();
        } else {
          setError("Error al guardar la imagen.");
        }
      } catch (error) {
        setError("Error al conectar con el servidor.");
      }
    };
    reader.readAsDataURL(imageFile);
  };

  useEffect(() => {
    if (!id) return;
    fetchInmueble();
  }, [id]);

  const handleEdit = (field: string, value: string) => {
    setEditField(field);
    setNewValue("");
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!editField || !newValue) return;

    let valueToSend: string | number = newValue;

    // Si el campo editado es uno de tipo numérico (habitaciones, baños, superficie)
    if (["habitaciones", "baños", "superficie"].includes(editField)) {
      const parsedValue = Number(newValue);
      if (isNaN(parsedValue)) {
        setError("El valor ingresado no es un número válido.");
        return;
      }
      valueToSend = parsedValue; // Asignamos el valor numérico
    }

    try {
      const response = await fetch(`/api/inmuebles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: editField,
          value: valueToSend,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar los cambios.");
      }

      await fetchInmueble();
    } catch (error) {
      console.error("Error al guardar el dato:", error);
      setError("Error al guardar los cambios.");
    } finally {
      setEditMode(false);
    }
  };

  if (isLoading) {
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
        <p className="text-gray-600">
          No autenticado. Por favor inicia sesión.
        </p>
      </div>
    );
  }

  if (!inmueble) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No se encontraron detalles del inmueble.
        </p>
      </div>
    );
  }

  const {
    title,
    propertyCategory,
    locality,
    address,
    neighborhood,
    numBedrooms,
    numBathrooms,
    surface,
    garage,
    propertyStatus,
    propertyImage,
    // id, // Eliminar esta línea para evitar la redeclaración
  } = inmueble;

  return (
    <div className=" flex items-center justify-center bg-gray-100 p-4">
      <div className="flex py-2 items-start justify-center bg-gray-100 p-4">
        <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
          <div className="space-y-4">
            {[{ label: "Título", value: title }].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <p className=" text-[#083C2C] font-semibold">
                  <span className="font-semibold"></span> {value}
                </p>
                {session.user.role === "administrador" && (
                  <button
                    className="p-0 m-0"
                    onClick={() => handleEdit(label.toLowerCase(), value)}
                  >
                    <img
                      src="/EDITAR-01.svg"
                      alt="Editar"
                      className="w-5 h-5" // Tamaño más pequeño
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
          <img
            src={
              inmueble.propertyImage &&
              Array.isArray(inmueble.propertyImage) &&
              inmueble.propertyImage.length > 0 &&
              inmueble.propertyImage[0].imagePath
                ? inmueble.propertyImage[0].imagePath
                : "/img/no-image.webp"
            }
            alt={`Imagen del inmueble: ${title}`}
            className="w-full h-64 object-cover rounded-lg mt-4"
          />
          <div className="flex flex-row justify-between w-full items-center  my-1">
            <span className="font-semibold text-[#083C2C]">ID: {id}</span>
            {session.user.role === "administrador" && (
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="p-0 m-0"
              >
                <img
                  src="/CARGAR-DOCUMENTO-01.svg"
                  alt="Cambiar Imagen"
                  className="w-8 h-8"
                />
              </button>
            )}
          </div>
          <div className="space-y-4">
            {[
              { label: "Rubro", value: propertyCategory?.category || "-" },
              { label: "Localidad", value: locality || "-" },
              { label: "Dirección", value: address || "-" },
              { label: "Barrio", value: neighborhood || "-" },
              { label: "Habitaciones", value: numBedrooms ?? "-" },
              { label: "Baños", value: numBathrooms ?? "-" },
              {
                label: "Superficie",
                value: surface !== undefined ? `${surface} m²` : "-",
              },
              { label: "Garaje", value: garage ? "Sí" : "No" },
              { label: "Estado", value: propertyStatus?.status || "-" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <p className="text-[#083C2C]">
                  <span className="font-semibold text-[#083C2C]">{label}:</span>{" "}
                  {value}
                </p>
                {session.user.role === "administrador" && (
                  <button
                    className="p-0 m-0"
                    onClick={() => handleEdit(label.toLowerCase(), value)}
                  >
                    <img
                      src="/EDITAR-01.svg"
                      alt="Editar"
                      className="w-6 h-6"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
          {session.user.role === "administrador" && (
            <div className="mt-6 space-y-4">
              <button
                onClick={() => setIsAgentModalOpen(true)}
                className="w-full px-4 py-2 bg-[#6FC6D1] text-white rounded-full hover:underline"
              >
                ASIGNAR AGENTE
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 bg-white text-[#6FC6D1] rounded-full border-2 border-[#6FC6D1] hover:underline"
              >
                ELIMINAR
              </button>
            </div>
          )}
        </div>
      </div>

      {/* modal de cambio de imagen */}

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Cambiar Imagen
            </h3>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Selecciona una imagen
                </label>
                <input
                  type="file"
                  id="image"
                  className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400"
                  onClick={() => setIsImageModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
                  onClick={handleSaveImage}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editMode && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Editar {editField}</h3>

            {editField === "rubro" ? (
              // Rubro como select
              <select
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                <option value="">Seleccionar rubro</option>
                {rubros.map((rubro) => (
                  <option key={rubro.id} value={rubro.id}>
                    {rubro.category}
                  </option>
                ))}
              </select>
            ) : editField === "estado" ? (
              // Estado como select
              <select
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                <option value="">Seleccionar estado</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.status}
                  </option>
                ))}
              </select>
            ) : editField === "garaje" ? (
              // Estado como select
              <select
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                <option value="">Seleccionar garaje</option>
                <option value="true">Si</option>
                <option value="false">No</option>
              </select>
            ) : (
              // Otros campos como input (numérico o texto según corresponda)
              <input
                type={
                  ["habitaciones", "baños", "superficie"].includes(editField)
                    ? "number"
                    : "text"
                }
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Asignar Agente</h3>
            <input
              type="number"
              value={agentId ?? ""}
              onChange={(e) => setAgentId(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Ingrese el ID del agente"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="py-2 px-4 bg-gray-400 text-white rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssignAgent}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg"
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InmuebleDetail;

/*
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/actions/auth-actions";

const InmuebleDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [session, setSession] = useState<any>(null);
  const [inmueble, setInmueble] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    const resolveSessionAndParams = async () => {
      try {
        const sessionData = await getSession();

        if (!sessionData) {
          setError("No autenticado. Por favor inicia sesión.");
          return;
        }

        setSession(sessionData);

        const resolvedParams = await params;
        setId(resolvedParams.id);
      } catch {
        setError("No se pudieron obtener los datos necesarios.");
      } finally {
        setIsLoading(false);
      }
    };

    resolveSessionAndParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchInmueble = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/inmuebles/${id}`);
        if (!response.ok) throw new Error("Error al obtener el inmueble");

        const data = await response.json();
        setInmueble(data.data);
      } catch {
        setError("Ocurrió un error al cargar los detalles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInmueble();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSaveImage = async () => {
    if (!imageFile || !id) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      try {
        const response = await fetch("/api/uploadImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: base64Image,
            fileName: imageFile.name,
            id_inmueble: id, // Pasamos el ID del inmueble
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setInmueble((prevState: any) => ({
            ...prevState,
            ruta_imagen: data.inmuebleImagen.ruta_imagen,
          }));
          setIsModalOpen(false);
        } else {
          setError("Error al guardar la imagen.");
        }
      } catch (error) {
        setError("Error al conectar con el servidor.");
      }
    };
    reader.readAsDataURL(imageFile);
  };

  if (isLoading) {
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
        <p className="text-gray-600">
          No autenticado. Por favor inicia sesión.
        </p>
      </div>
    );
  }

  if (!inmueble) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No se encontraron detalles del inmueble.
        </p>
      </div>
    );
  }

  const {
    title,
    id_rubro,
    localidad,
    direccion,
    barrio,
    num_habitaciones,
    num_baños,
    superficie,
    garaje,
    estado,
    ruta_imagen,
  } = inmueble;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Detalles del Inmueble
        </h2>
        <img
          src={ruta_imagen}
          alt={`Imagen del inmueble: ${title}`}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <div className="space-y-4">
          <p>
            <span className="font-semibold">Título:</span> {title}
          </p>
          <p>
            <span className="font-semibold">Rubro:</span> {id_rubro}
          </p>
          <p>
            <span className="font-semibold">Localidad:</span> {localidad}
          </p>
          <p>
            <span className="font-semibold">Dirección:</span> {direccion}
          </p>
          <p>
            <span className="font-semibold">Barrio:</span> {barrio}
          </p>
          <p>
            <span className="font-semibold">Habitaciones:</span>{" "}
            {num_habitaciones}
          </p>
          <p>
            <span className="font-semibold">Baños:</span> {num_baños}
          </p>
          <p>
            <span className="font-semibold">Superficie:</span> {superficie} m²
          </p>
          <p>
            <span className="font-semibold">Garaje:</span>{" "}
            {garaje ? "Sí" : "No"}
          </p>
          <p>
            <span className="font-semibold">Estado:</span> {estado}
          </p>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
          onClick={() => setIsModalOpen(true)}
        >
          Cambiar Imagen
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Cambiar Imagen
            </h3>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Selecciona una imagen
                </label>
                <input
                  type="file"
                  id="image"
                  className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
                  onClick={handleSaveImage}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InmuebleDetail;
*/

/* Formulario con boton delete
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/actions/auth-actions";

const InmuebleDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [session, setSession] = useState<any>(null);
  const [inmueble, setInmueble] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const resolveSessionAndParams = async () => {
      try {
        const sessionData = await getSession();

        if (!sessionData) {
          setError("No autenticado. Por favor inicia sesión.");
          return;
        }

        setSession(sessionData);

        const resolvedParams = await params;
        setId(resolvedParams.id);
      } catch {
        setError("No se pudieron obtener los datos necesarios.");
      } finally {
        setIsLoading(false);
      }
    };

    resolveSessionAndParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchInmueble = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/inmuebles/${id}`);
        if (!response.ok) throw new Error("Error al obtener el inmueble");

        const data = await response.json();
        setInmueble(data.data);
      } catch {
        setError("Ocurrió un error al cargar los detalles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInmueble();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "¿Estás seguro que deseas eliminar este inmueble?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/inmuebles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error desconocido al eliminar el inmueble");
      }

      alert("Inmueble eliminado exitosamente.");
      router.push("/inmuebles");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Ocurrió un error al eliminar el inmueble.");
    }
  };

  if (isLoading) {
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
        <p className="text-gray-600">
          No autenticado. Por favor inicia sesión.
        </p>
      </div>
    );
  }

  if (!inmueble) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">
          No se encontraron detalles del inmueble.
        </p>
      </div>
    );
  }

  const {
    title,
    id_rubro,
    localidad,
    direccion,
    barrio,
    num_habitaciones,
    num_baños,
    superficie,
    garaje,
    estado,
    ruta_imagen,
  } = inmueble;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Detalles del Inmueble
        </h2>
        <img
          src={ruta_imagen}
          alt={`Imagen del inmueble: ${title}`}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <div className="space-y-4">
          <p>
            <span className="font-semibold">Título:</span> {title}
          </p>
          <p>
            <span className="font-semibold">Rubro:</span> {id_rubro}
          </p>
          <p>
            <span className="font-semibold">Localidad:</span> {localidad}
          </p>
          <p>
            <span className="font-semibold">Dirección:</span> {direccion}
          </p>
          <p>
            <span className="font-semibold">Barrio:</span> {barrio}
          </p>
          <p>
            <span className="font-semibold">Habitaciones:</span>{" "}
            {num_habitaciones}
          </p>
          <p>
            <span className="font-semibold">Baños:</span> {num_baños}
          </p>
          <p>
            <span className="font-semibold">Superficie:</span> {superficie} m²
          </p>
          <p>
            <span className="font-semibold">Garaje:</span>{" "}
            {garaje ? "Sí" : "No"}
          </p>
          <p>
            <span className="font-semibold">Estado:</span> {estado}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default InmuebleDetail;

*/
