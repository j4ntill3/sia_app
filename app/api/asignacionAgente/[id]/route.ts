import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Obtenemos el cuerpo de la solicitud (debe contener el ID del agente)
    const { agentId } = await request.json();

    // Hacemos un console.log para ver cómo se está enviando el cuerpo de la solicitud
    console.log("Cuerpo de la solicitud recibido:", { agentId });

    // Verificamos si el inmueble existe
    const inmuebleExistente = await prisma.inmueble.findUnique({
      where: { id: Number(id) },
    });

    if (!inmuebleExistente) {
      return new Response("Inmueble no encontrado", { status: 404 });
    }

    // Verificamos si ya existe un agente asignado al inmueble
    const agenteAsignadoExistente = await prisma.inmueble_agente.findFirst({
      where: {
        id_inmueble: Number(id),
        eliminado: false,
      },
    });

    if (agenteAsignadoExistente) {
      // Si ya existe un agente asignado, lo marcamos como eliminado
      await prisma.inmueble_agente.update({
        where: { id: agenteAsignadoExistente.id },
        data: { eliminado: true },
      });
    }

    // Insertamos el nuevo registro de agente
    const nuevoInmuebleAgente = await prisma.inmueble_agente.create({
      data: {
        id_inmueble: Number(id),
        id_agente: agentId,
        eliminado: false, // El nuevo agente no está eliminado
      },
    });

    return new Response(
      JSON.stringify({
        message: "Agente asignado correctamente",
        data: {
          id: nuevoInmuebleAgente.id.toString(), // Convertir BigInt a String
          id_inmueble: nuevoInmuebleAgente.id_inmueble,
          id_agente: nuevoInmuebleAgente.id_agente,
          eliminado: nuevoInmuebleAgente.eliminado,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en la API:", error);
    return new Response("Ocurrió un error al asignar el agente", {
      status: 500,
    });
  }
}
