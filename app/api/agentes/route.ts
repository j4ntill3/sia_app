import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const agentes = await prisma.empleado.findMany({
      where: {
        tipoId: 1,
        eliminado: false,
      },
      include: {
        persona_empleado: {
          include: {
            persona: true,
          },
        },
      },
    });

    const agentesConPersona = agentes.map((empleado) => {
      const persona = empleado.persona_empleado[0]?.persona;

      return {
        empleado: {
          id: empleado.id,
          CUIT: empleado.CUIT,
          fecha_alta: empleado.Fecha_Alta,
          fecha_baja: empleado.Fecha_Baja,
          tipo: empleado.tipoId === 1 ? "agente" : "administrador",
          eliminado: empleado.eliminado,
        },
        persona: persona,
      };
    });

    return new Response(JSON.stringify(agentesConPersona), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener agentes:", error);
    return new Response(JSON.stringify({ error: "Error al obtener agentes" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
