"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ConsultaForm from "@/components/ConsultaForm";
import ImageCarousel from "@/components/ImageCarousel";
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Car,
  Home,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Inmueble {
  id: string;
  categoria?: { id: string; categoria: string };
  localidad?: { id: string; nombre: string };
  zona?: { id: string; nombre: string };
  barrio?: { id: string; nombre: string };
  direccion: string;
  dormitorios: string;
  banos: string;
  superficie: string;
  cochera: boolean;
  estado?: { id: string; estado: string };
  descripcion?: string;
  imagenes: { id: string; imagen?: string; es_principal: boolean }[];
}

const PropiedadDetalle = () => {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [inmueble, setInmueble] = useState<Inmueble | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInmueble = async () => {
      try {
        if (!id) return;
        const res = await fetch(`/api/inmuebles/${id}`);
        if (!res.ok) throw new Error("No se encontró la propiedad");
        const data = await res.json();
        setInmueble(data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar la propiedad");
        setLoading(false);
      }
    };
    fetchInmueble();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6FC6D1] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (error || !inmueble) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#083C2C] mb-2">
            Propiedad no encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "La propiedad que buscas no está disponible."}
          </p>
          <a
            href="/propiedades"
            className="inline-block bg-[#6FC6D1] text-white px-6 py-2 rounded-lg hover:bg-[#5ab5c1] transition-colors"
          >
            Ver todas las propiedades
          </a>
        </div>
      </div>
    );
  }

  // Preparar imágenes para el carrusel
  const imagenes = inmueble.imagenes?.length > 0
    ? inmueble.imagenes.map(img => img.imagen || "/img/no-image.webp")
    : ["/img/no-image.webp"];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header con título */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-[#6FC6D1]" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#083C2C]">
              {inmueble.categoria?.categoria || "Propiedad"}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>{inmueble.direccion}</span>
            {inmueble.barrio && <span>• {inmueble.barrio.nombre}</span>}
            {inmueble.localidad && <span>• {inmueble.localidad.nombre}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna principal - Imágenes y descripción */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carrusel de imágenes */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ImageCarousel images={imagenes} />
            </div>

            {/* Estado */}
            {inmueble.estado && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#083C2C] mb-3">Estado</h2>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  inmueble.estado.estado.toLowerCase() === "disponible"
                    ? "bg-green-100 text-green-800"
                    : inmueble.estado.estado.toLowerCase() === "vendido"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {inmueble.estado.estado.toLowerCase() === "disponible" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {inmueble.estado.estado}
                </span>
              </div>
            )}

            {/* Descripción */}
            {inmueble.descripcion && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#083C2C] mb-3">Descripción</h2>
                <p className="text-gray-600 leading-relaxed">{inmueble.descripcion}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Características */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#083C2C] mb-4">Características</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#6FC6D1]/20 p-2 rounded-lg">
                    <Bed className="w-6 h-6 text-[#083C2C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dormitorios</p>
                    <p className="font-semibold text-[#083C2C]">{inmueble.dormitorios}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#6FC6D1]/20 p-2 rounded-lg">
                    <Bath className="w-6 h-6 text-[#083C2C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Baños</p>
                    <p className="font-semibold text-[#083C2C]">{inmueble.banos}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#6FC6D1]/20 p-2 rounded-lg">
                    <Maximize className="w-6 h-6 text-[#083C2C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Superficie</p>
                    <p className="font-semibold text-[#083C2C]">{inmueble.superficie} m²</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${inmueble.cochera ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Car className={`w-6 h-6 ${inmueble.cochera ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cochera</p>
                    <p className="font-semibold text-[#083C2C]">
                      {inmueble.cochera ? "Sí" : "No"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#6FC6D1]/20 p-2 rounded-lg">
                    <Home className="w-6 h-6 text-[#083C2C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo</p>
                    <p className="font-semibold text-[#083C2C]">
                      {inmueble.categoria?.categoria || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#083C2C] mb-4">Ubicación</h2>
              <div className="space-y-3">
                {inmueble.localidad && (
                  <div>
                    <p className="text-sm text-gray-500">Localidad</p>
                    <p className="font-medium text-[#083C2C]">{inmueble.localidad.nombre}</p>
                  </div>
                )}
                {inmueble.zona && (
                  <div>
                    <p className="text-sm text-gray-500">Zona</p>
                    <p className="font-medium text-[#083C2C]">{inmueble.zona.nombre}</p>
                  </div>
                )}
                {inmueble.barrio && (
                  <div>
                    <p className="text-sm text-gray-500">Barrio</p>
                    <p className="font-medium text-[#083C2C]">{inmueble.barrio.nombre}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium text-[#083C2C]">{inmueble.direccion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de consulta */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-[#083C2C] mb-2 text-center">
              ¿Te interesa esta propiedad?
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Completa el formulario y uno de nuestros agentes se contactará contigo a la brevedad
            </p>
            <ConsultaForm inmuebleId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropiedadDetalle;
