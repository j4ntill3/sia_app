import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { ClientInquiry } from "@/types/consulta_cliente";

export async function GET(request: NextRequest) {
  const { session, error, status } = await requireAuth(request, "agente");
  if (error) return jsonError(error, status);
  try {
    const agentId = session.user.empleadoId;
    if (!agentId) {
      return jsonError("No se encontró el ID del agente", 400);
    }
    const clientQueriesDb = await prisma.consulta_cliente.findMany({
      where: {
        agentId: agentId,
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
        date: "desc",
      },
    });
    // Mapear a tipo ClientInquiry
    const clientQueries: ClientInquiry[] = clientQueriesDb.map((c) => ({
      id: c.id,
      propertyId: c.inmuebleId,
      agentId: c.agentId,
      firstName: c.firstName,
      lastName: c.lastName,
      phone: c.phone,
      email: c.email,
      date: c.date,
      description: c.description || undefined,
    }));
    return jsonSuccess<ClientInquiry[]>(clientQueries);
  } catch (error) {
    console.error("Error al obtener mis consultas de clientes:", error);
    return jsonError("Error interno del servidor", 500);
  }
}
