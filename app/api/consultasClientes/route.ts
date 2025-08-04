import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { ClientInquiry } from "@/types/consulta_cliente";

export async function GET(request: NextRequest) {
  const { session, error, status } = await requireAuth(
    request,
    "administrador"
  );
  if (error) return jsonError(error, status);
  try {
    const consultasDb = await prisma.clientInquiry.findMany();
    // Mapear a tipo ClientInquiry
    const consultasClientes: ClientInquiry[] = consultasDb.map((c) => ({
      id: c.id,
      propertyId: c.propertyId,
      agentId: c.agentId,
      firstName: c.firstName,
      lastName: c.lastName,
      phone: c.phone,
      email: c.email,
      date: c.date,
      description: c.description || undefined,
    }));
    return jsonSuccess<ClientInquiry[]>(consultasClientes);
  } catch (error) {
    console.error("Error al obtener consultas de clientes:", error);
    return jsonError("Error al obtener consultas de clientes", 500);
  }
}
