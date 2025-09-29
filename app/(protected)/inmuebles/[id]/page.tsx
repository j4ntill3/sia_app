"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const InmuebleDetail = () => {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [inmueble, setInmueble] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/inmuebles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se encontró el inmueble");
        return res.json();
      })
      .then((data) => {
        setInmueble(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar el inmueble");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!inmueble) return <div className="p-8 text-center">No se encontró el inmueble.</div>;

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-[#083C2C]">Detalle del inmueble</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#083C2C]">Rubro:</span>
            <span className="text-gray-800">{inmueble.categoria?.categoria || "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#083C2C]">Localidad:</span>
            <span className="text-gray-800">{inmueble.localidad_id || "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#083C2C]">Dirección:</span>
            <span className="text-gray-800">{inmueble.direccion || "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#083C2C]">Barrio:</span>
            <span className="text-gray-800">{inmueble.barrio || "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#083C2C]">Dormitorios:</span>
            <span className="text-gray-800">{inmueble.dormitorios ?? "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#083C2C]">Baños:</span>
            <span className="text-gray-800">{inmueble.banos ?? "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#083C2C]">Superficie:</span>
            <span className="text-gray-800">{inmueble.superficie !== undefined ? `${inmueble.superficie} m²` : "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#083C2C]">Cochera:</span>
            <span className="text-gray-800">{inmueble.cochera ? "Sí" : "No"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#083C2C]">Estado:</span>
            <span className="text-gray-800">{inmueble.estado?.estado || "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#083C2C]">Imagen:</span>
            {inmueble.imagenes && inmueble.imagenes.length > 0 ? (
              <img src={inmueble.imagenes[0].imagen} alt="Imagen inmueble" style={{ maxWidth: 200 }} />
            ) : <span className="text-gray-800">Sin imagen</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InmuebleDetail;
