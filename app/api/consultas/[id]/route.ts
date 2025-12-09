import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("[GET /api/consultas/[id]] Starting...");
    // Verificar autenticación
    const { session, error, status } = await requireAuth(req);
    if (error) {
      console.log("[GET /api/consultas/[id]] Auth error:", error);
      return jsonError(error, status);
    }

    const { id } = params;
    console.log("[GET /api/consultas/[id]] ID:", id);

    // Buscar la consulta con datos relacionados
    const consulta = await prisma.consulta_cliente.findUnique({
      where: { id },
      include: {
        inmueble: {
          include: {
            categoria: true,
            estado: true,
            localidad: true,
            zona: true,
            barrio: true,
          },
        },
        empleado: {
          include: {
            personas_empleado: {
              include: {
                persona: true,
              },
            },
          },
        },
      },
    });

    console.log("[GET /api/consultas/[id]] Consulta found:", !!consulta);

    if (!consulta) {
      console.log("[GET /api/consultas/[id]] Consulta not found");
      return NextResponse.json(
        { error: "Consulta no encontrada" },
        { status: 404 }
      );
    }

    console.log("[GET /api/consultas/[id]] Building response...");
    // Mapear los datos para una respuesta más limpia
    const response = {
      id: consulta.id,
      fecha: consulta.fecha,
      nombre: consulta.nombre,
      apellido: consulta.apellido,
      telefono: consulta.telefono,
      correo: consulta.correo,
      descripcion: consulta.descripcion,
      inmueble: {
        id: consulta.inmueble.id,
        direccion: consulta.inmueble.direccion,
        categoria: consulta.inmueble.categoria?.categoria,
        estado: consulta.inmueble.estado?.estado,
        localidad: consulta.inmueble.localidad?.nombre,
        zona: consulta.inmueble.zona?.nombre,
        barrio: consulta.inmueble.barrio?.nombre,
        dormitorios: consulta.inmueble.dormitorios,
        banos: consulta.inmueble.banos,
        superficie: consulta.inmueble.superficie,
        cochera: consulta.inmueble.cochera,
      },
      agente: consulta.empleado ? {
        id: consulta.empleado.id,
        nombre:
          consulta.empleado.personas_empleado[0]?.persona.nombre || "N/A",
        apellido:
          consulta.empleado.personas_empleado[0]?.persona.apellido || "N/A",
        telefono:
          consulta.empleado.personas_empleado[0]?.persona.telefono || "N/A",
        correo:
          consulta.empleado.personas_empleado[0]?.persona.correo || "N/A",
      } : null,
    };

    console.log("[GET /api/consultas/[id]] Returning success response");
    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/consultas/[id]] ERROR:", error);
    return NextResponse.json(
      { error: "Error al obtener consulta" },
      { status: 500 }
    );
  }
}
