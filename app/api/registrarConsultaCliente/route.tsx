import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonSuccess } from "@/lib/api-helpers";
import { clientInquirySchema } from "@/lib/validation";
import type { ClientInquiry } from "@/types/consulta_cliente";

export async function POST(request: NextRequest) {
  // Solo agentes pueden registrar consultas
  const { session, error, status } = await requireAuth(request, "agente");
  if (error) return jsonError(error, status);

  try {
    const body = await request.json();
    // Validar datos con zod
    const parse = clientInquirySchema.safeParse({
      ...body,
      id_inmueble: Number(body.id_inmueble),
    });
    if (!parse.success) {
      return jsonError(
        "Datos inválidos: " + JSON.stringify(parse.error.flatten().fieldErrors),
        400
      );
    }
    const data = parse.data;
    const idAgente = session.user.empleadoId;

    if (!idAgente) {
      return jsonError("No se encontró el ID del agente", 400);
    }

    // Verificar que el inmueble pertenece al agente
    const propertyAgent = await prisma.agente_inmueble.findFirst({
      where: {
        inmuebleId: data.id_inmueble,
        agentId: idAgente,
        eliminado: false,
      },
    });
    if (!propertyAgent) {
      return jsonError("Este inmueble no le pertenece al agente.", 403);
    }

    // Crear la consulta del cliente
    const nuevaConsultaDb = await prisma.consulta_cliente.create({
      data: {
        inmuebleId: data.id_inmueble,
        agentId: idAgente,
        firstName: data.nombre,
        lastName: data.apellido,
        phone: data.telefono,
        email: data.email,
        date: new Date(),
        description: data.descripcion || "",
      },
    });

    // Mapear a tipo ClientInquiry
    const nuevaConsulta: ClientInquiry = {
      id: nuevaConsultaDb.id,
      propertyId: nuevaConsultaDb.inmuebleId,
      agentId: nuevaConsultaDb.agentId,
      firstName: nuevaConsultaDb.firstName,
      lastName: nuevaConsultaDb.lastName,
      phone: nuevaConsultaDb.phone,
      email: nuevaConsultaDb.email,
      date: nuevaConsultaDb.date,
      description: nuevaConsultaDb.description || undefined,
    };

    return jsonSuccess<{ message: string; nuevaConsulta: ClientInquiry }>(
      {
        message: "Consulta creada correctamente",
        nuevaConsulta,
      },
      201
    );
  } catch (error: any) {
    console.error("Error al crear la consulta:", error);
    return jsonError(error.message || "Error interno del servidor", 500);
  }
}
