import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const agente = await prisma.empleado.findUnique({
      where: { id: Number(id) },
      include: {
        persona_empleado: {
          include: {
            persona: true,
          },
        },
      },
    });

    if (!agente) {
      return NextResponse.json(
        { error: "Agente no encontrado" },
        { status: 404 }
      );
    }

    const persona = agente.persona_empleado[0]?.persona;

    const responseData = {
      empleado: {
        id: agente.id,
        CUIT: agente.CUIT,
        fecha_alta: agente.Fecha_Alta,
        fecha_baja: agente.Fecha_Baja,
        tipo: agente.tipoId === 1 ? "agente" : "administrador",
        eliminado: agente.eliminado,
      },
      persona,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error al obtener el agente:", error);
    return NextResponse.json(
      { error: "Error al obtener el agente" },
      { status: 500 }
    );
  }
}
