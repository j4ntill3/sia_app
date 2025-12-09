import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { CategoriaInmueble } from "@/types/inmueble";
import { EstadoInmueble } from "@/types/inmueble";
import { InmuebleCreate } from "@/types/inmueble";
import ImageCarousel from "@/components/ImageCarousel";
import { Trash2 } from "lucide-react";

const inmuebleSchema = z.object({
  categoria_id: z.string().min(1, "El rubro es obligatorio"),
  localidad_id: z.string().min(1, "La localidad es obligatoria"),
  zona_id: z.string().min(1, "La zona es obligatoria"),
  barrio_id: z.string().min(1, "El barrio es obligatorio"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  dormitorios: z.string()
    .refine((val) => val.trim().length > 0, "El número de habitaciones es obligatorio")
    .refine((val) => /^\d+$/.test(val), "El número de habitaciones debe ser un número entero"),
  banos: z.string()
    .refine((val) => val.trim().length > 0, "El número de baños es obligatorio")
    .refine((val) => /^\d+$/.test(val), "El número de baños debe ser un número entero"),
  superficie: z.string()
    .refine((val) => val.trim().length > 0, "La superficie es obligatoria")
    .refine((val) => /^\d+(\.\d+)?$/.test(val), "La superficie debe ser un número válido (puede incluir decimales)"),
  cochera: z.boolean().optional(),
  estado_id: z.string().min(1, "El estado es obligatorio"),
  imagenes: z.array(z.string()).optional(),
});

interface InmuebleFormProps {
  mode: "create" | "edit" | "view";
  initialData?: InmuebleCreate & { agenteAsignado?: { id: string; nombre: string; apellido: string } };
  onSubmit: (data: InmuebleCreate) => void;
  loading?: boolean;
  readOnly?: boolean;
  onDelete?: () => void;
  deleting?: boolean;
}

export default function InmuebleForm({ mode, initialData, onSubmit, loading, readOnly = false, onDelete, deleting = false }: InmuebleFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<InmuebleCreate>(
    initialData || {
      descripcion: "",
      categoria_id: "",
      localidad_id: "",
      zona_id: "",
      barrio_id: "",
      direccion: "",
      dormitorios: "",
      banos: "",
      superficie: "",
      cochera: false,
      estado_id: "",
    }
  );
  const [rubros, setRubros] = useState<CategoriaInmueble[]>([]);
  const [estados, setEstados] = useState<EstadoInmueble[]>([]);
  const [localidades, setLocalidades] = useState<{id: string, nombre: string}[]>([]);
  const [zonas, setZonas] = useState<{id: string, nombre: string}[]>([]);
  const [barrios, setBarrios] = useState<{id: string, nombre: string}[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

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
    const fetchLocalidades = async () => {
      const response = await fetch("/api/localidades");
      const data = await response.json();
      setLocalidades(data.data || []);
    };
    fetchRubros();
    fetchEstados();
    fetchLocalidades();
  }, []);

  // Fetch zonas when localidad changes
  useEffect(() => {
    const fetchZonas = async () => {
      if (formData.localidad_id) {
        const response = await fetch(`/api/zonas?localidad_id=${formData.localidad_id}`);
        const data = await response.json();
        setZonas(data.data || []);
      } else {
        setZonas([]);
      }
    };
    fetchZonas();
  }, [formData.localidad_id]);

  // Fetch barrios when localidad changes
  useEffect(() => {
    const fetchBarrios = async () => {
      if (formData.localidad_id) {
        const response = await fetch(`/api/barrios?localidad_id=${formData.localidad_id}`);
        const data = await response.json();
        setBarrios(data.data || []);
      } else {
        setBarrios([]);
      }
    };
    fetchBarrios();
  }, [formData.localidad_id]);

  useEffect(() => {
    // Actualizar formData cuando initialData cambie
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    // Cargar imágenes existentes del inmueble
    if (initialData && (initialData as any).imagenes) {
      setExistingImages((initialData as any).imagenes);

      // Limpiar previews de imágenes nuevas cuando se actualizan las imágenes existentes
      // Esto ocurre después de un guardado exitoso
      if (imagePreviews.length > 0) {
        // Revocar todas las URLs para liberar memoria
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setImagePreviews([]);
        setSelectedImages([]);

        // Resetear el input de archivo
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // If localidad changes, reset zona and barrio
    if (name === "localidad_id") {
      setFormData((prev) => ({
        ...prev,
        localidad_id: value,
        zona_id: "",
        barrio_id: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedImages((prev) => [...prev, ...fileArray]);

      // Crear previews para las nuevas imágenes
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      // Revocar la URL del preview para liberar memoria
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = async (imageId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
      return;
    }

    try {
      const response = await fetch(`/api/imagenes/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Error al eliminar la imagen");
        return;
      }

      const result = await response.json();

      // Si se creó una imagen por defecto, agregarla al estado
      if (result.data.imagenPorDefecto) {
        setExistingImages([result.data.imagenPorDefecto]);
      } else {
        // Actualizar el estado local removiendo la imagen eliminada
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      }

      alert("Imagen eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      alert("Hubo un error al eliminar la imagen");
    }
  };

  const setImageAsPrincipal = async (imageId: string) => {
    try {
      const response = await fetch(`/api/imagenes/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ es_principal: true }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Error al marcar la imagen como principal");
        return;
      }

      // Actualizar el estado local
      setExistingImages((prev) =>
        prev.map((img) => ({
          ...img,
          es_principal: img.id === imageId,
        }))
      );
      alert("Imagen marcada como principal correctamente");
    } catch (error) {
      console.error("Error al marcar imagen como principal:", error);
      alert("Hubo un error al marcar la imagen como principal");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convertir imágenes a base64
    const imagePromises = selectedImages.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const imageBase64Array = await Promise.all(imagePromises);

    const inmuebleData = {
      ...formData,
      // Convertir strings vacíos a null para campos opcionales
      descripcion: formData.descripcion?.trim() || null,
      imagenes: imageBase64Array.length > 0 ? imageBase64Array : undefined,
    };
    const result = inmuebleSchema.safeParse(inmuebleData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[String(err.path[0])] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    } else {
      setFormErrors({});
    }
    onSubmit(inmuebleData);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#083C2C]">
          {mode === "view" ? "Detalle Inmueble" : mode === "edit" ? "Editar Inmueble" : "Alta Inmueble"}
        </h2>
        {!readOnly && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push('/inmuebles')}
              className="bg-gray-500 text-white py-2 px-3 rounded-md hover:bg-gray-600 transition-colors font-medium text-sm"
            >
              Volver
            </button>
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            )}
            <button
              type="submit"
              form="inmueble-form"
              className="bg-[#6FC6D1] text-white py-2 px-3 rounded-md hover:bg-[#5AB5C1] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm"
              disabled={loading}
            >
              {loading ? "Guardando..." : mode === "edit" ? "Guardar" : "Crear"}
            </button>
          </div>
        )}
      </div>
      <form id="inmueble-form" onSubmit={handleSubmit}>
        {/* Layout de 2 columnas: Datos e Imágenes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Datos del inmueble (2/3 del ancho) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rubro */}
              <div>
                <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700 mb-1">Rubro *</label>
                <select
                  id="categoria_id"
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleInputChange}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccione un rubro</option>
                  {rubros.length > 0 && rubros.map((rubro) => (
                    <option key={rubro.id} value={rubro.id}>{rubro.categoria}</option>
                  ))}
                </select>
                {formErrors.categoria_id && <p className="text-red-500 text-xs mt-1">{formErrors.categoria_id}</p>}
              </div>

              {/* Estado */}
              <div>
                <label htmlFor="estado_id" className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                <select
                  id="estado_id"
                  name="estado_id"
                  value={formData.estado_id}
                  onChange={handleInputChange}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccione un estado</option>
                  {estados.length > 0 && estados.map((estado) => (
                    <option key={estado.id} value={estado.id}>{estado.estado}</option>
                  ))}
                </select>
                {formErrors.estado_id && <p className="text-red-500 text-xs mt-1">{formErrors.estado_id}</p>}
              </div>

              {/* Agente Asignado - solo en edit/view */}
              {(mode === "edit" || mode === "view") && (
                <div className="md:col-span-2">
                  <label htmlFor="agente" className="block text-sm font-medium text-gray-700 mb-1">Agente Asignado</label>
                  <input
                    type="text"
                    id="agente"
                    name="agente"
                    value={initialData?.agenteAsignado
                      ? `${initialData.agenteAsignado.nombre} ${initialData.agenteAsignado.apellido}`
                      : 'Sin asignar'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Localidad */}
              <div>
                <label htmlFor="localidad_id" className="block text-sm font-medium text-gray-700 mb-1">Localidad *</label>
                <select
                  id="localidad_id"
                  name="localidad_id"
                  value={formData.localidad_id}
                  onChange={handleInputChange}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccione una localidad</option>
                  {localidades.length > 0 && localidades.map((localidad) => (
                    <option key={localidad.id} value={localidad.id}>{localidad.nombre}</option>
                  ))}
                </select>
                {formErrors.localidad_id && <p className="text-red-500 text-xs mt-1">{formErrors.localidad_id}</p>}
              </div>

              {/* Zona */}
              <div>
                <label htmlFor="zona_id" className="block text-sm font-medium text-gray-700 mb-1">Zona *</label>
                <select
                  id="zona_id"
                  name="zona_id"
                  value={formData.zona_id || ""}
                  onChange={handleInputChange}
                  disabled={readOnly || !formData.localidad_id}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccione una zona</option>
                  {zonas.length > 0 && zonas.map((zona) => (
                    <option key={zona.id} value={zona.id}>{zona.nombre}</option>
                  ))}
                </select>
                {formErrors.zona_id && <p className="text-red-500 text-xs mt-1">{formErrors.zona_id}</p>}
              </div>

              {/* Barrio */}
              <div>
                <label htmlFor="barrio_id" className="block text-sm font-medium text-gray-700 mb-1">Barrio *</label>
                <select
                  id="barrio_id"
                  name="barrio_id"
                  value={formData.barrio_id}
                  onChange={handleInputChange}
                  disabled={readOnly || !formData.localidad_id}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccione un barrio</option>
                  {barrios.length > 0 && barrios.map((barrio) => (
                    <option key={barrio.id} value={barrio.id}>{barrio.nombre}</option>
                  ))}
                </select>
                {formErrors.barrio_id && <p className="text-red-500 text-xs mt-1">{formErrors.barrio_id}</p>}
              </div>

              {/* Dirección */}
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Ingresa la dirección"
                />
                {formErrors.direccion && <p className="text-red-500 text-xs mt-1">{formErrors.direccion}</p>}
              </div>

              {/* Habitaciones */}
              <div>
                <label htmlFor="dormitorios" className="block text-sm font-medium text-gray-700 mb-1">Habitaciones *</label>
                <input
                  type="text"
                  id="dormitorios"
                  name="dormitorios"
                  value={formData.dormitorios}
                  onChange={handleInputChange}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Número de habitaciones"
                />
                {formErrors.dormitorios && <p className="text-red-500 text-xs mt-1">{formErrors.dormitorios}</p>}
              </div>

              {/* Baños */}
              <div>
                <label htmlFor="banos" className="block text-sm font-medium text-gray-700 mb-1">Baños *</label>
                <input
                  type="text"
                  id="banos"
                  name="banos"
                  value={formData.banos}
                  onChange={handleInputChange}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Número de baños"
                />
                {formErrors.banos && <p className="text-red-500 text-xs mt-1">{formErrors.banos}</p>}
              </div>

              {/* Superficie */}
              <div>
                <label htmlFor="superficie" className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²) *</label>
                <input
                  type="text"
                  id="superficie"
                  name="superficie"
                  value={formData.superficie}
                  onChange={handleInputChange}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Superficie en m²"
                />
                {formErrors.superficie && <p className="text-red-500 text-xs mt-1">{formErrors.superficie}</p>}
              </div>

              {/* Cochera */}
              <div className="flex items-center pt-6">
                <label htmlFor="cochera" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    id="cochera"
                    name="cochera"
                    checked={formData.cochera}
                    onChange={handleInputChange}
                    disabled={readOnly}
                    className="rounded border-gray-300 focus:ring-2 focus:ring-[#6FC6D1] w-4 h-4 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  ¿Cuenta con cochera?
                </label>
                {formErrors.cochera && <p className="text-red-500 text-xs mt-1">{formErrors.cochera}</p>}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Descripción del inmueble (opcional)"
                rows={3}
              />
              {formErrors.descripcion && <p className="text-red-500 text-xs mt-1">{formErrors.descripcion}</p>}
            </div>
          </div>

          {/* Columna derecha: Sección de Imágenes (1/3 del ancho) */}
          <div className="lg:col-span-1 space-y-4">
            {/* Imágenes existentes */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes guardadas</label>
                <ImageCarousel
                  images={existingImages}
                  onDelete={!readOnly ? removeExistingImage : undefined}
                  onSetPrincipal={!readOnly ? setImageAsPrincipal : undefined}
                  readOnly={readOnly}
                />
              </div>
            )}

            {/* Subir imágenes */}
            {!readOnly && (
              <div>
                <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
                  {existingImages.length > 0 ? "Agregar más imágenes" : "Imágenes del inmueble"}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="imagen"
                  name="imagen"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#6FC6D1] file:text-white hover:file:bg-[#5AB5C1]"
                />
                {imagePreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="rounded-md w-full h-32 object-cover border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-xs font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
