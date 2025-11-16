import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { Inmueble } from "@/types/inmueble";

export async function GET(request: NextRequest) {
  const { session, error, status } = await requireAuth(request, "agente");
  if (error) return jsonError(error, status);
  try {
    const agentId = session.user.empleadoId;
    if (!agentId) {
      return jsonError("No se encontró el ID del agente", 400);
    }

    // Leer parámetros de paginación
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);
    const skip = (page - 1) * pageSize;

    // Contar total de inmuebles
    const totalCount = await prisma.inmueble.count({
      where: {
        eliminado: false,
        agentes: {
          some: {
            agente_id: agentId,
            eliminado: false,
          },
        },
      },
    });
    const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize);

    // Obtener inmuebles paginados
    const inmueblesDb = await prisma.inmueble.findMany({
      where: {
        eliminado: false,
        agentes: {
          some: {
            agente_id: agentId,
            eliminado: false,
          },
        },
      },
      include: {
        imagenes: true,
        categoria: true,
        estado: true,
        localidad: true,
        zona: true,
        barrio: true,
        agentes: {
          where: { eliminado: false },
          include: {
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
        },
      },
      skip,
      take: pageSize,
      orderBy: { direccion: "asc" },
    });

    // Mapear a tipo Inmueble
    const inmuebles = inmueblesDb.map((inmueble: any) => {
      const agenteAsignado = inmueble.agentes?.[0];
      const persona = agenteAsignado?.empleado?.personas_empleado?.[0]?.persona;

      return {
        id: inmueble.id,
        categoria_id: inmueble.categoria_id,
        localidad_id: inmueble.localidad_id,
        zona_id: inmueble.zona_id,
        barrio_id: inmueble.barrio_id,
        direccion: inmueble.direccion,
        dormitorios: inmueble.dormitorios,
        banos: inmueble.banos,
        superficie: inmueble.superficie,
        cochera: inmueble.cochera,
        eliminado: inmueble.eliminado,
        estado_id: inmueble.estado_id,
        descripcion: inmueble.descripcion || undefined,
        categoria: inmueble.categoria ? {
          id: inmueble.categoria.id,
          categoria: inmueble.categoria.categoria
        } : undefined,
        estado: inmueble.estado ? {
          id: inmueble.estado.id,
          estado: inmueble.estado.estado
        } : undefined,
        localidad: inmueble.localidad ? {
          id: inmueble.localidad.id,
          nombre: inmueble.localidad.nombre
        } : undefined,
        zona: inmueble.zona ? {
          id: inmueble.zona.id,
          nombre: inmueble.zona.nombre,
          localidad_id: inmueble.zona.localidad_id
        } : undefined,
        barrio: inmueble.barrio ? {
          id: inmueble.barrio.id,
          nombre: inmueble.barrio.nombre,
          localidad_id: inmueble.barrio.localidad_id
        } : undefined,
        imagenes: inmueble.imagenes?.map((img: any) => ({
          id: img.id,
          inmueble_id: img.inmueble_id,
          imagen: img.imagen || undefined,
          es_principal: img.es_principal || undefined,
        })) || [],
        agenteAsignado: persona ? {
          id: agenteAsignado.agente_id,
          nombre: persona.nombre,
          apellido: persona.apellido,
        } : undefined,
      };
    });

    return jsonSuccess({ data: inmuebles, totalPages, totalCount });
  } catch (error) {
    console.error("Error al obtener mis propiedades:", error);
    return jsonError("Error interno del servidor", 500);
  }
}
