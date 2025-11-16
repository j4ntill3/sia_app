"use client";

import { useEffect, useState } from "react";
import { User, Check, AlertCircle } from "lucide-react";

interface AsignarAgenteProps {
  inmuebleId: string;
  agenteActual?: {
    id: string;
    nombre: string;
    apellido: string;
  };
  onAsignacionExitosa?: () => void;
}

interface Agente {
  empleado: {
    id: string;
  };
  persona: {
    nombre: string;
    apellido: string;
  };
}

const AsignarAgente: React.FC<AsignarAgenteProps> = ({
  inmuebleId,
  agenteActual,
  onAsignacionExitosa
}) => {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [agenteSeleccionado, setAgenteSeleccionado] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingAgentes, setLoadingAgentes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    cargarAgentes();
  }, []);

  useEffect(() => {
    if (agenteActual) {
      setAgenteSeleccionado(agenteActual.id);
    }
  }, [agenteActual]);

  const cargarAgentes = async () => {
    try {
      setLoadingAgentes(true);
      const response = await fetch("/api/agentes");
      if (!response.ok) throw new Error("Error al cargar agentes");

      const data = await response.json();
      setAgentes(data.data || []);
    } catch (err) {
      console.error("Error al cargar agentes:", err);
      setError("No se pudieron cargar los agentes");
    } finally {
      setLoadingAgentes(false);
    }
  };

  const handleAsignar = async () => {
    if (!agenteSeleccionado) {
      setError("Por favor selecciona un agente");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/asignacionAgente/${inmuebleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: agenteSeleccionado,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al asignar el agente");
      }

      setSuccess(true);

      if (onAsignacionExitosa) {
        onAsignacionExitosa();
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Error al asignar el agente");
    } finally {
      setLoading(false);
    }
  };

  if (loadingAgentes) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#083C2C] mb-4">
          Agente Asignado
        </h3>
        <p className="text-gray-500">Cargando agentes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold text-[#083C2C] mb-4 flex items-center gap-2">
        <User size={24} />
        Agente Asignado
      </h3>

      {/* Agente actual */}
      {agenteActual && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Agente actual:</p>
          <p className="font-semibold text-gray-900">
            {agenteActual.nombre} {agenteActual.apellido}
          </p>
        </div>
      )}

      {/* Selector de agente */}
      <div className="mb-4">
        <label htmlFor="agente" className="block text-sm font-medium text-gray-700 mb-2">
          {agenteActual ? "Cambiar agente a:" : "Seleccionar agente:"}
        </label>
        <select
          id="agente"
          value={agenteSeleccionado}
          onChange={(e) => setAgenteSeleccionado(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] bg-white"
        >
          <option value="">-- Seleccionar agente --</option>
          {agentes.map((agente) => (
            <option key={agente.empleado.id} value={agente.empleado.id}>
              {agente.persona.nombre} {agente.persona.apellido}
            </option>
          ))}
        </select>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-800">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-800">
          <Check size={18} />
          <span className="text-sm">Agente asignado correctamente</span>
        </div>
      )}

      {/* Botón de asignar */}
      <button
        onClick={handleAsignar}
        disabled={loading || !agenteSeleccionado}
        className="w-full bg-[#6FC6D1] text-white py-2 px-4 rounded-md hover:bg-[#5AB5C1] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
      >
        {loading ? (
          "Asignando..."
        ) : (
          <>
            <User size={18} />
            {agenteActual ? "Cambiar Agente" : "Asignar Agente"}
          </>
        )}
      </button>
    </div>
  );
};

export default AsignarAgente;
