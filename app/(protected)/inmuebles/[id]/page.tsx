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
