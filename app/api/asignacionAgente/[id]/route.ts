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
    const inmueble = await prisma.inmueble.findUnique({
      where: { id: id },
    });
    if (!inmueble) {
      return jsonError("Inmueble no encontrado", 404);
    }

    // Verificamos si el agente (empleado) existe
    const agente = await prisma.empleado.findUnique({
      where: { id: agentId },
    });
    if (!agente) {
      return jsonError("Agente no encontrado", 404);
    }

    // Verificamos si ya existe un agente asignado al inmueble
    const existingAgent = await prisma.agente_inmueble.findFirst({
      where: {
        inmuebleId: id,
        eliminado: false,
      },
    });
    if (existingAgent) {
      // Si ya existe un agente asignado, lo marcamos como eliminado
      await prisma.agente_inmueble.update({
        where: { id: existingAgent.id },
        data: { eliminado: true },
      });
    }

    // Insertamos el nuevo registro de agente
    const newPropertyAgent = await prisma.agente_inmueble.create({
      data: {
        inmuebleId: id,
        agentId: agentId,
        eliminado: false,
      },
    });

    return jsonSuccess({
      message: "Agente asignado correctamente",
      data: {
        id: newPropertyAgent.id,
        inmuebleId: newPropertyAgent.inmuebleId,
        agentId: newPropertyAgent.agentId,
        eliminado: newPropertyAgent.eliminado,
      },
    });
  } catch (error) {
    console.error("Error en la API:", error);
    return jsonError("Ocurrió un error al asignar el agente", 500);
  }
}
