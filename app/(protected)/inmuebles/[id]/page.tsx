"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "@/actions/auth-actions";
import InmuebleForm from "@/components/InmuebleForm";
import ConsultaForm from "@/components/ConsultaForm";
import AsignarAgente from "@/components/AsignarAgente";

const InmuebleEdit = () => {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [inmueble, setInmueble] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!inmueble) return <div className="p-8 text-center">No se encontró el inmueble.</div>;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4 gap-6">
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
            // Actualizar el estado con los datos del servidor
            setInmueble(resData.data);
            alert("Inmueble actualizado con éxito.");
            setSaving(false);
          } catch (error) {
            alert("Hubo un error al actualizar el inmueble.");
            setSaving(false);
          }
        } : () => {}}
      />

      {/* Componente de asignación de agente - solo visible para administradores */}
      {isAdmin && (
        <div className="w-full max-w-4xl">
          <AsignarAgente
            inmuebleId={id}
            agenteActual={inmueble.agenteAsignado}
            onAsignacionExitosa={recargarInmueble}
          />
        </div>
      )}

      {/* Formulario de consulta - solo visible para administradores o agentes asignados */}
      {(isAdmin || isAssignedAgent) && (
        <div className="w-full max-w-4xl">
          <ConsultaForm inmuebleId={id} />
        </div>
      )}

      {/* Mensaje para agentes no asignados */}
      {session?.user?.role === "agente" && !isAssignedAgent && (
        <div className="w-full max-w-4xl bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 text-center">
            Este inmueble no está asignado a tu cuenta. Solo puedes registrar consultas en inmuebles que te han sido asignados.
          </p>
        </div>
      )}
    </div>
  );
};

export default InmuebleEdit;
