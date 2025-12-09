"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "@/actions/auth-actions";
import InmuebleForm from "@/components/InmuebleForm";
import ConsultaForm from "@/components/ConsultaForm";
import AsignarAgente from "@/components/AsignarAgente";
import { Building2, MapPin, Bed, Bath, Maximize, Car, Tag, UserCheck } from "lucide-react";

const InmuebleEdit = () => {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [inmueble, setInmueble] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAssignedAgent, setIsAssignedAgent] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Obtener sesión
        const sessionData = await getSession();
        if (!sessionData) {
          setError("No autenticado. Por favor inicia sesión.");
          setLoading(false);
          return;
        }
        setSession(sessionData);
        const isAdminUser = sessionData.user?.role === "administrador";
        setIsAdmin(isAdminUser);

        // Cargar inmueble
        if (!id) return;
        const res = await fetch(`/api/inmuebles/${id}`);
        if (!res.ok) throw new Error("No se encontró el inmueble");
        const data = await res.json();
        setInmueble(data);

        // Verificar si el agente está asignado a este inmueble
        if (sessionData.user?.role === "agente" && sessionData.user?.empleadoId) {
          const esAsignado = data.agenteAsignado?.id === sessionData.user.empleadoId;
          setIsAssignedAgent(esAsignado);
        }

        setLoading(false);
      } catch (err) {
        setError("Error al cargar el inmueble");
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const recargarInmueble = async () => {
    try {
      const res = await fetch(`/api/inmuebles/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInmueble(data);

        // Actualizar estado de agente asignado si el usuario es agente
        if (session?.user?.role === "agente" && session?.user?.empleadoId) {
          const esAsignado = data.agenteAsignado?.id === session.user.empleadoId;
          setIsAssignedAgent(esAsignado);
        }
      }
    } catch (err) {
      console.error("Error al recargar inmueble:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este inmueble? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/inmuebles/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al eliminar el inmueble.");
        setDeleting(false);
        return;
      }

      alert("Inmueble eliminado exitosamente.");
      router.push("/inmuebles");
    } catch (error) {
      console.error("Error al eliminar inmueble:", error);
      alert("Hubo un error al eliminar el inmueble.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px-56px)] flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px-56px)] flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!inmueble) {
    return (
      <div className="min-h-[calc(100vh-80px-56px)] flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">No se encontró el inmueble</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px-56px)] bg-gray-100">
      {/* Hero Section con información destacada */}
      <div className="bg-gradient-to-r from-[#083C2C] to-[#05271d] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-6 h-6 text-[#6FC6D1]" />
                <span className="text-[#6FC6D1] text-sm font-medium">
                  {inmueble.categoria?.categoria || "Propiedad"}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {inmueble.direccion || "Dirección no especificada"}
              </h1>
              <div className="flex items-center gap-2 text-[#6FC6D1]">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {inmueble.barrio?.nombre}, {inmueble.zona?.nombre} - {inmueble.localidad?.nombre}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                inmueble.estado?.estado === "Disponible"
                  ? "bg-green-500"
                  : inmueble.estado?.estado === "Vendido"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}>
                {inmueble.estado?.estado || "N/A"}
              </span>
              {inmueble.agenteAsignado && (
                <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1 rounded-full">
                  <UserCheck className="w-4 h-4" />
                  <span>{inmueble.agenteAsignado.nombre} {inmueble.agenteAsignado.apellido}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Características destacadas */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#6FC6D1]/20 p-3 rounded-full">
                <Bed className="w-5 h-5 text-[#083C2C]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{inmueble.dormitorios || 0}</p>
                <p className="text-sm text-gray-600">Habitaciones</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#6FC6D1]/20 p-3 rounded-full">
                <Bath className="w-5 h-5 text-[#083C2C]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{inmueble.banos || 0}</p>
                <p className="text-sm text-gray-600">Baños</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#6FC6D1]/20 p-3 rounded-full">
                <Maximize className="w-5 h-5 text-[#083C2C]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{inmueble.superficie || 0}</p>
                <p className="text-sm text-gray-600">m²</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#6FC6D1]/20 p-3 rounded-full">
                <Car className="w-5 h-5 text-[#083C2C]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{inmueble.cochera ? "Sí" : "No"}</p>
                <p className="text-sm text-gray-600">Cochera</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-[1600px] mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Columna principal - Información del inmueble (8 columnas) */}
          <div className="xl:col-span-8">
            <InmuebleForm
              mode={isAdmin ? "edit" : "view"}
              initialData={inmueble}
              loading={saving}
              readOnly={!isAdmin}
              onSubmit={isAdmin ? async (data) => {
                setSaving(true);
                try {
                  const response = await fetch(`/api/inmuebles/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json" },
                  });
                  const resData = await response.json();
                  if (!response.ok || !resData.data) {
                    alert(resData.error || "Error al actualizar el inmueble.");
                    setSaving(false);
                    return;
                  }
                  // Recargar inmueble completo con todos los datos de relaciones
                  await recargarInmueble();
                  alert("Inmueble actualizado con éxito.");
                  setSaving(false);
                } catch (error) {
                  alert("Hubo un error al actualizar el inmueble.");
                  setSaving(false);
                }
              } : () => {}}
              onDelete={isAdmin ? handleDelete : undefined}
              deleting={deleting}
            />
          </div>

          {/* Columna lateral - Acciones y consultas (4 columnas) */}
          <div className="xl:col-span-4 space-y-6">
            {/* Componente de asignación de agente */}
            {isAdmin && (
              <AsignarAgente
                inmuebleId={id}
                agenteActual={inmueble.agenteAsignado}
                onAsignacionExitosa={recargarInmueble}
              />
            )}

            {/* Formulario de consulta - SOLO PARA AGENTES */}
            {session?.user?.role === "agente" && isAssignedAgent && (
              <ConsultaForm inmuebleId={id} />
            )}

            {/* Mensaje para agentes no asignados */}
            {session?.user?.role === "agente" && !isAssignedAgent && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-yellow-800 font-medium mb-1">
                      Inmueble no asignado
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      Este inmueble no está asignado a tu cuenta. Solo puedes registrar consultas en inmuebles que te han sido asignados.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InmuebleEdit;
