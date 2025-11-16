"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "@/actions/auth-actions";
import {
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  MapPin,
  Home,
  Bed,
  Bath,
  Maximize,
  Car,
  ArrowLeft,
} from "lucide-react";

interface ConsultaDetalle {
  id: string;
  fecha: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  descripcion?: string;
  inmueble: {
    id: string;
    direccion: string;
    categoria?: string;
    estado?: string;
    localidad?: string;
    zona?: string;
    barrio?: string;
    dormitorios: string;
    banos: string;
    superficie: string;
    cochera: boolean;
  };
  agente: {
    id: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
  };
}

const ConsultaDetallePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";

  const [consulta, setConsulta] = useState<ConsultaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsulta = async () => {
      try {
        // Verificar autenticación
        const session = await getSession();
        if (!session) {
          router.push("/login");
          return;
        }
        setUserRole(session.user.role);

        // Obtener la consulta
        const res = await fetch(`/api/consultas/${id}`);
        if (!res.ok) throw new Error("No se encontró la consulta");

        const data = await res.json();
        setConsulta(data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar la consulta");
        setLoading(false);
      }
    };

    if (id) {
      fetchConsulta();
    }
  }, [id, router]);

  const handleBack = () => {
    if (userRole === "administrador") {
      router.push("/consultasClientes");
    } else {
      router.push("/misConsultasClientes");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6FC6D1] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando consulta...</p>
        </div>
      </div>
    );
  }

  if (error || !consulta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#083C2C] mb-2">
            Consulta no encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "La consulta que buscas no está disponible."}
          </p>
          <button
            onClick={handleBack}
            className="inline-block bg-[#6FC6D1] text-white px-6 py-2 rounded-lg hover:bg-[#5ab5c1] transition-colors"
          >
            Volver a consultas
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header con botón volver */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#083C2C] hover:text-[#6FC6D1] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver a consultas</span>
          </button>
          <h1 className="text-3xl font-bold text-[#083C2C] flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#6FC6D1]" />
            Detalle de Consulta
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Información del Cliente */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#083C2C] mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-[#6FC6D1]" />
              Información del Cliente
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nombre Completo</p>
                <p className="font-medium text-[#083C2C] text-lg">
                  {consulta.nombre} {consulta.apellido}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#6FC6D1]" />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium text-[#083C2C]">{consulta.telefono}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#6FC6D1]" />
                <div>
                  <p className="text-sm text-gray-500">Correo Electrónico</p>
                  <p className="font-medium text-[#083C2C]">{consulta.correo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#6FC6D1]" />
                <div>
                  <p className="text-sm text-gray-500">Fecha de Consulta</p>
                  <p className="font-medium text-[#083C2C]">
                    {formatDate(consulta.fecha)}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensaje del Cliente */}
            {consulta.descripcion && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-[#083C2C] mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#6FC6D1]" />
                  Mensaje
                </h3>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {consulta.descripcion}
                </p>
              </div>
            )}
          </div>

          {/* Información del Agente */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#083C2C] mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-[#6FC6D1]" />
              Agente Asignado
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nombre Completo</p>
                <p className="font-medium text-[#083C2C] text-lg">
                  {consulta.agente.nombre} {consulta.agente.apellido}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#6FC6D1]" />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium text-[#083C2C]">
                    {consulta.agente.telefono}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#6FC6D1]" />
                <div>
                  <p className="text-sm text-gray-500">Correo Electrónico</p>
                  <p className="font-medium text-[#083C2C]">
                    {consulta.agente.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Inmueble */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#083C2C] mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#6FC6D1]" />
            Inmueble Consultado
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Información General */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tipo de Propiedad</p>
                <p className="font-medium text-[#083C2C] text-lg">
                  {consulta.inmueble.categoria || "N/A"}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#6FC6D1] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium text-[#083C2C]">
                    {consulta.inmueble.direccion}
                  </p>
                  {consulta.inmueble.barrio && (
                    <p className="text-sm text-gray-600">
                      {consulta.inmueble.barrio}
                      {consulta.inmueble.localidad && `, ${consulta.inmueble.localidad}`}
                    </p>
                  )}
                </div>
              </div>
              {consulta.inmueble.estado && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estado</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      consulta.inmueble.estado.toLowerCase() === "disponible"
                        ? "bg-green-100 text-green-800"
                        : consulta.inmueble.estado.toLowerCase() === "vendido"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {consulta.inmueble.estado}
                  </span>
                </div>
              )}
            </div>

            {/* Características */}
            <div>
              <h3 className="text-lg font-semibold text-[#083C2C] mb-3">
                Características
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-[#6FC6D1]/20 p-2 rounded-lg">
                    <Bed className="w-5 h-5 text-[#083C2C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dormitorios</p>
                    <p className="font-semibold text-[#083C2C]">
                      {consulta.inmueble.dormitorios}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#6FC6D1]/20 p-2 rounded-lg">
                    <Bath className="w-5 h-5 text-[#083C2C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Baños</p>
                    <p className="font-semibold text-[#083C2C]">
                      {consulta.inmueble.banos}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#6FC6D1]/20 p-2 rounded-lg">
                    <Maximize className="w-5 h-5 text-[#083C2C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Superficie</p>
                    <p className="font-semibold text-[#083C2C]">
                      {consulta.inmueble.superficie} m²
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      consulta.inmueble.cochera ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <Car
                      className={`w-5 h-5 ${
                        consulta.inmueble.cochera ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cochera</p>
                    <p className="font-semibold text-[#083C2C]">
                      {consulta.inmueble.cochera ? "Sí" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón para ver el inmueble */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <a
              href={`/inmuebles/${consulta.inmueble.id}`}
              className="inline-flex items-center gap-2 bg-[#6FC6D1] text-white px-6 py-3 rounded-lg hover:bg-[#5ab5c1] transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              Ver detalles completos del inmueble
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultaDetallePage;
