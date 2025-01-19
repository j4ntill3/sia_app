"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Cambiar esto si usas el sistema de enrutamiento de Next.js

const AgenteDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [agente, setAgente] = useState<any>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params; // Desenrolla la promesa
      setId(resolvedParams.id); // Asigna el id
    };

    getParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchAgente = async () => {
      try {
        const response = await fetch(`/api/agentes/${id}`);
        if (!response.ok) throw new Error("Error al obtener el agente");

        const data = await response.json();
        setAgente(data);
      } catch (error) {
        console.error(error);
        setAgente(null);
      }
    };

    fetchAgente();
  }, [id]);

  if (!agente) return <p>No se encontró el agente.</p>;

  const { persona, empleado } = agente;

  return (
    <div>
      <h2>Detalles del Agente</h2>
      <p>
        Nombre: {persona.nombre} {persona.apellido}
      </p>
      <p>CUIT: {empleado.CUIT}</p>
      <p>Dirección: {persona.direccion}</p>
      <p>Email: {persona.email}</p>
      <p>Teléfono: {persona.telefono}</p>
      <p>Fecha de Alta: {new Date(empleado.fecha_alta).toLocaleDateString()}</p>
      {empleado.fecha_baja && (
        <p>
          Fecha de Baja: {new Date(empleado.fecha_baja).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default AgenteDetail;
