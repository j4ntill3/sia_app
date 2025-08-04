"use client";

import { useState, useEffect } from "react";
import { PropertyCategory } from "@/types/inmueble_rubro";
import { PropertyStatus } from "@/types/inmueble_estado";
import { getSession } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";

type FormData = {
  title: string;
  id_rubro: number | string;
  localidad: string;
  direccion: string;
  barrio: string;
  num_habitaciones: number;
  num_baños: number;
  superficie: number;
  garaje: boolean;
  id_estado: number | string;
};

export default function CrearInmueble() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    id_rubro: "",
    localidad: "",
    direccion: "",
    barrio: "",
    num_habitaciones: 0,
    num_baños: 0,
    superficie: 0,
    garaje: false,
    id_estado: "",
  });

  const router = useRouter();

  const [rubros, setRubros] = useState<PropertyCategory[]>([]);
  const [estados, setEstados] = useState<PropertyStatus[]>([]);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      [name]:
        name === "garaje" ? (e.target as HTMLInputElement).checked : value,
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

    // 1. Crear el inmueble sin imagen
    const inmuebleData = {
      title: formData.title,
      categoryId: Number(formData.id_rubro),
      locality: formData.localidad,
      address: formData.direccion,
      neighborhood: formData.barrio,
      numBedrooms: Number(formData.num_habitaciones),
      numBathrooms: Number(formData.num_baños),
      surface: Number(formData.superficie),
      garage: Boolean(formData.garaje),
      statusId: Number(formData.id_estado),
      imagePath: "/img/no-image.webp",
    };
    try {
      const response = await fetch("/api/inmuebles", {
        method: "POST",
        body: JSON.stringify(inmuebleData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok || !data.data || !data.data.id) {
        alert(data.error || "Error desconocido al crear el inmueble.");
        return;
      }
      const newPropertyId = data.data.id;
      // 2. Si hay imagen seleccionada, subirla con el id real
      if (selectedImage) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          try {
            console.log("Subiendo imagen...");
            console.log("Enviando a /api/uploadImage:", {
              file: base64,
              fileName: selectedImage.name,
              propertyId: newPropertyId,
            });
            const uploadRes = await fetch("/api/uploadImage", {
              method: "POST",
              body: JSON.stringify({
                file: base64,
                fileName: selectedImage.name,
                propertyId: newPropertyId,
              }),
              headers: { "Content-Type": "application/json" },
            });
            const uploadData = await uploadRes.json();
            console.log("Respuesta de /api/uploadImage:", uploadData);
            if (uploadRes.ok && uploadData.data?.image?.imagePath) {
              alert("Inmueble creado con imagen.");
            } else {
              alert("Inmueble creado, pero la imagen no se pudo guardar.");
            }
            router.push("/inmuebles");
          } catch (error) {
            alert("Inmueble creado, pero hubo un error al subir la imagen.");
            router.push("/inmuebles");
          }
        };
        reader.readAsDataURL(selectedImage);
      } else {
        alert("Inmueble creado con éxito.");
        router.push("/inmuebles");
      }
    } catch (error) {
      alert("Hubo un error al intentar crear el inmueble.");
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
      <div className="w-full max-w-sm py-4 px-6 bg-white shadow-md rounded-2xl">
        <h2 className="text-3xl font-bold text-center mt-2 mb-2 text-[#083C2C]">
          Alta Inmueble
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa el título del inmueble"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="id_rubro"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Rubro
            </label>
            <select
              id="id_rubro"
              name="id_rubro"
              value={formData.id_rubro}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
            >
              <option value="">Seleccione un rubro</option>
              {rubros.map((rubro) => (
                <option key={rubro.id} value={rubro.id}>
                  {rubro.category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="localidad"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Localidad
            </label>
            <input
              type="text"
              id="localidad"
              name="localidad"
              value={formData.localidad}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa la localidad"
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
              htmlFor="barrio"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Barrio
            </label>
            <input
              type="text"
              id="barrio"
              name="barrio"
              value={formData.barrio}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa el barrio"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="num_habitaciones"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Número de Habitaciones
            </label>
            <input
              type="number"
              id="num_habitaciones"
              name="num_habitaciones"
              value={formData.num_habitaciones}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Número de habitaciones"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="num_baños"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Número de Baños
            </label>
            <input
              type="number"
              id="num_baños"
              name="num_baños"
              value={formData.num_baños}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Número de baños"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="superficie"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Superficie
            </label>
            <input
              type="number"
              id="superficie"
              name="superficie"
              value={formData.superficie}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Superficie en m²"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="garaje"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              ¿Cuenta con garaje?
            </label>
            <input
              type="checkbox"
              id="garaje"
              name="garaje"
              checked={formData.garaje}
              onChange={handleInputChange}
              className="rounded mt-1 focus:ring-[#083C2C]"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="id_estado"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Estado
            </label>
            <select
              id="id_estado"
              name="id_estado"
              value={formData.id_estado}
              onChange={handleInputChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
            >
              <option value="">Seleccione un estado</option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="imagen"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Imagen del inmueble
            </label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              accept="image/*"
              onChange={handleImageChange}
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 rounded-lg w-full h-40 object-cover border"
              />
            )}
          </div>
          <div className="mb-1.5">
            <button
              type="submit"
              className="w-full bg-[#6FC6D1] text-white py-2 px-4 rounded-full text-sm font-sans hover:underline"
            >
              Crear Inmueble
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
