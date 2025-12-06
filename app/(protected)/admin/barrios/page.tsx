"use client";
import { useState, useEffect } from "react";

interface Barrio {
  id: string;
  nombre: string;
  localidad_id: string;
}

interface Localidad {
  id: string;
  nombre: string;
}

export default function BarriosPage() {
  const [barrios, setBarrios] = useState<Barrio[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nombre: "", localidad_id: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterLocalidad, setFilterLocalidad] = useState("");

  useEffect(() => {
    fetchLocalidades();
    fetchBarrios();
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

  const fetchBarrios = async () => {
    try {
      const response = await fetch("/api/barrios");
      const data = await response.json();
      setBarrios(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar barrios:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/barrios/${editingId}` : "/api/barrios";
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

      alert(editingId ? "Barrio actualizado correctamente" : "Barrio creado correctamente");
      setFormData({ nombre: "", localidad_id: "" });
      setEditingId(null);
      setShowForm(false);
      fetchBarrios();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar");
    }
  };

  const handleEdit = (barrio: Barrio) => {
    setFormData({ nombre: barrio.nombre, localidad_id: barrio.localidad_id });
    setEditingId(barrio.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este barrio?")) return;

    try {
      const response = await fetch(`/api/barrios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Error al eliminar");
        return;
      }

      alert("Barrio eliminado correctamente");
      fetchBarrios();
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

  const filteredBarrios = filterLocalidad
    ? barrios.filter((b) => b.localidad_id === filterLocalidad)
    : barrios;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#083C2C]">Administración de Barrios</h1>
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
                {editingId ? "Editar" : "Nuevo"} Barrio
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
                    Nombre del Barrio
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Ej: Palermo, Recoleta, Belgrano"
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
                  <th className="text-left py-3 px-4 text-[#083C2C] font-semibold">Barrio</th>
                  <th className="text-right py-3 px-4 text-[#083C2C] font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredBarrios.map((barrio) => (
                  <tr key={barrio.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{getLocalidadNombre(barrio.localidad_id)}</td>
                    <td className="py-3 px-4 text-gray-900">{barrio.nombre}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(barrio)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(barrio.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBarrios.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                No hay barrios registrados
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
