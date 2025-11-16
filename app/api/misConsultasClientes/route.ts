import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { ConsultaCliente } from "@/types/consulta_cliente";

export async function GET(request: NextRequest) {
  const { session, error, status } = await requireAuth(request, "agente");
  if (error) return jsonError(error, status);
  try {
    const agentId = session.user.empleadoId;
    if (!agentId) {
      return jsonError("No se encontró el ID del agente", 400);
    }
    const consultasDb = await prisma.consulta_cliente.findMany({
      where: {
        agente_id: agentId,
      },
      include: {
        inmueble: true,
        empleado: {
          include: {
            personas_empleado: {
              include: {
                persona: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha: "desc",
      },
    });
    // Mapear a tipo ConsultaCliente
    const consultas: ConsultaCliente[] = consultasDb.map((c) => ({
      id: c.id,
      inmueble_id: c.inmueble_id,
      agente_id: c.agente_id,
      nombre: c.nombre,
      apellido: c.apellido,
      telefono: c.telefono,
      correo: c.correo,
      fecha: c.fecha,
      descripcion: c.descripcion || undefined,
    }));
    return jsonSuccess<ConsultaCliente[]>(consultas);
  } catch (error) {
    console.error("Error al obtener mis consultas de clientes:", error);
    return jsonError("Error interno del servidor", 500);
  }
}
