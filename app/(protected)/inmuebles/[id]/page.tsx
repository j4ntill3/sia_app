"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/actions/auth-actions";
import { InmuebleRubro } from "@/types/inmueble_rubro";
import { InmuebleEstado } from "@/types/inmueble_estado";

const InmuebleDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [session, setSession] = useState<any>(null);
  const [inmueble, setInmueble] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState<boolean>(false); // Para saber si estamos en el modal de edición
  const [editField, setEditField] = useState<string>(""); // El campo que estamos editando
  const [newValue, setNewValue] = useState<string>("");
  const [rubros, setRubros] = useState<InmuebleRubro[]>([]);
  const [estados, setEstados] = useState<InmuebleEstado[]>([]); // El nuevo valor para el campo

  const router = useRouter();

  const fetchInmueble = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/inmuebles/${id}`);
      if (!response.ok) throw new Error("Error al obtener el inmueble");

      const data = await response.json();
      setInmueble(data);
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
      setRubros(data);
    };

    const fetchEstados = async () => {
      const response = await fetch("/api/inmuebleEstados");
      const data = await response.json();
      setEstados(data);
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

  useEffect(() => {
    if (!id) return;
    fetchInmueble();
  }, [id]);

  const handleEdit = (field: string, value: string) => {
    setEditField(field);
    setNewValue(""); // Limpiamos el valor cuando se abre el modal
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
      setEditMode(false); // Cerramos el modal
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
          {[
            { label: "Título", value: title },
            { label: "Rubro", value: id_rubro },
            { label: "Localidad", value: localidad },
            { label: "Dirección", value: direccion },
            { label: "Barrio", value: barrio },
            { label: "Habitaciones", value: num_habitaciones },
            { label: "Baños", value: num_baños },
            { label: "Superficie", value: `${superficie} m²` },
            { label: "Garaje", value: garaje ? "Sí" : "No" },
            { label: "Estado", value: estado },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <p>
                <span className="font-semibold">{label}:</span> {value}
              </p>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleEdit(label.toLowerCase(), value)}
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>

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
                    {rubro.rubro}
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
                    {estado.estado}
                  </option>
                ))}
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
        setInmueble(data);
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
        setInmueble(data);
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
