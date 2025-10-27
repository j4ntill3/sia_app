"use client";
import { useState, useEffect } from "react";

interface Zona {
  id: string;
  nombre: string;
  localidad_id: string;
}

interface Localidad {
  id: string;
  nombre: string;
}

export default function ZonasPage() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nombre: "", localidad_id: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterLocalidad, setFilterLocalidad] = useState("");

  useEffect(() => {
    fetchLocalidades();
    fetchZonas();
  }, []);

  const fetchLocalidades = async () => {
    try {
      const response = await fetch("/api/localidades");
      const data = await response.json();
      setLocalidades(data.data || []);
    } catch (error) {
      console.error("Error al cargar localidades:", error);
    }
  };

  const fetchZonas = async () => {
    try {
      const response = await fetch("/api/zonas");
      const data = await response.json();
      setZonas(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar zonas:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/zonas/${editingId}` : "/api/zonas";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Error al guardar");
        return;
      }

      alert(editingId ? "Zona actualizada correctamente" : "Zona creada correctamente");
      setFormData({ nombre: "", localidad_id: "" });
      setEditingId(null);
      setShowForm(false);
      fetchZonas();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar");
    }
  };

  const handleEdit = (zona: Zona) => {
    setFormData({ nombre: zona.nombre, localidad_id: zona.localidad_id });
    setEditingId(zona.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar esta zona?")) return;

    try {
      const response = await fetch(`/api/zonas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Error al eliminar");
        return;
      }

      alert("Zona eliminada correctamente");
      fetchZonas();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar");
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: "", localidad_id: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const getLocalidadNombre = (localidadId: string) => {
    const loc = localidades.find((l) => l.id === localidadId);
    return loc ? loc.nombre : "N/A";
  };

  const filteredZonas = filterLocalidad
    ? zonas.filter((z) => z.localidad_id === filterLocalidad)
    : zonas;

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#083C2C]">Administración de Zonas</h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#6FC6D1] text-white px-6 py-2 rounded-full hover:bg-[#5ab5c0] transition-colors"
              >
                + Agregar
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-[#083C2C]">
                {editingId ? "Editar" : "Nueva"} Zona
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#083C2C] mb-2">
                    Localidad
                  </label>
                  <select
                    value={formData.localidad_id}
                    onChange={(e) =>
                      setFormData({ ...formData, localidad_id: e.target.value })
                    }
                    className="w-full rounded-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
                    required
                  >
                    <option value="">Seleccione una localidad</option>
                    {localidades.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#083C2C] mb-2">
                    Nombre de la Zona
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Ej: Centro, Norte, Sur"
                    className="w-full rounded-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-[#6FC6D1] text-white px-6 py-2 rounded-full hover:bg-[#5ab5c0] transition-colors"
                  >
                    {editingId ? "Actualizar" : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#083C2C] mb-2">
              Filtrar por Localidad
            </label>
            <select
              value={filterLocalidad}
              onChange={(e) => setFilterLocalidad(e.target.value)}
              className="w-full rounded-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
            >
              <option value="">Todas las localidades</option>
              {localidades.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-[#083C2C] font-semibold">Localidad</th>
                  <th className="text-left py-3 px-4 text-[#083C2C] font-semibold">Zona</th>
                  <th className="text-right py-3 px-4 text-[#083C2C] font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredZonas.map((zona) => (
                  <tr key={zona.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{getLocalidadNombre(zona.localidad_id)}</td>
                    <td className="py-3 px-4 text-gray-900">{zona.nombre}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(zona)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(zona.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredZonas.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                No hay zonas registradas
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
