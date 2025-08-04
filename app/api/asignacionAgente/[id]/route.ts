import { prisma } from "@/lib/prisma";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { agentId } = await request.json();

    // Verificamos si el inmueble existe
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
    });
    if (!property) {
      return jsonError("Inmueble no encontrado", 404);
    }

    // Verificamos si ya existe un agente asignado al inmueble
    const existingAgent = await prisma.propertyAgent.findFirst({
      where: {
        propertyId: Number(id),
        deleted: false,
      },
    });
    if (existingAgent) {
      // Si ya existe un agente asignado, lo marcamos como eliminado
      await prisma.propertyAgent.update({
        where: { id: existingAgent.id },
        data: { deleted: true },
      });
    }

    // Insertamos el nuevo registro de agente
    const newPropertyAgent = await prisma.propertyAgent.create({
      data: {
        propertyId: Number(id),
        agentId: agentId,
        deleted: false,
      },
    });

    return jsonSuccess({
      message: "Agente asignado correctamente",
      data: {
        id: newPropertyAgent.id.toString(),
        propertyId: newPropertyAgent.propertyId,
        agentId: newPropertyAgent.agentId,
        deleted: newPropertyAgent.deleted,
      },
    });
  } catch (error) {
    console.error("Error en la API:", error);
    return jsonError("Ocurrió un error al asignar el agente", 500);
  }
}
