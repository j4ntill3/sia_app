"use client";
import { useState, useEffect } from "react";

interface Entity {
  id: string;
  [key: string]: any;
}

interface AdminEntityManagerProps {
  title: string;
  entityName: string;
  apiEndpoint: string;
  displayField: string;
  inputLabel: string;
  inputPlaceholder: string;
}

export default function AdminEntityManager({
  title,
  entityName,
  apiEndpoint,
  displayField,
  inputLabel,
  inputPlaceholder,
}: AdminEntityManagerProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ [displayField]: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      setEntities(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error(`Error al cargar ${entityName}:`, error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `${apiEndpoint}/${editingId}` : apiEndpoint;
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

      alert(editingId ? `${entityName} actualizado correctamente` : `${entityName} creado correctamente`);
      setFormData({ [displayField]: "" });
      setEditingId(null);
      setShowForm(false);
      fetchEntities();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar");
    }
  };

  const handleEdit = (entity: Entity) => {
    setFormData({ [displayField]: entity[displayField] });
    setEditingId(entity.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`¿Está seguro de eliminar este ${entityName}?`)) return;

    try {
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Error al eliminar");
        return;
      }

      alert(`${entityName} eliminado correctamente`);
      fetchEntities();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar");
    }
  };

  const handleCancel = () => {
    setFormData({ [displayField]: "" });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#083C2C]">{title}</h1>
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
                {editingId ? "Editar" : "Nuevo"} {entityName}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#083C2C] mb-2">
                    {inputLabel}
                  </label>
                  <input
                    type="text"
                    value={formData[displayField]}
                    onChange={(e) =>
                      setFormData({ ...formData, [displayField]: e.target.value })
                    }
                    placeholder={inputPlaceholder}
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

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-[#083C2C] font-semibold">{inputLabel}</th>
                  <th className="text-right py-3 px-4 text-[#083C2C] font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entities.map((entity) => (
                  <tr key={entity.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{entity[displayField]}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(entity)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(entity.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {entities.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                No hay {entityName}s registrados
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
