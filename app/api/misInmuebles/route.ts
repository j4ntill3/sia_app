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
            agentId: agentId,
            eliminado: false,
          },
        },
      },
    });
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    // Obtener inmuebles paginados
    const inmueblesDb = await prisma.inmueble.findMany({
      where: {
        eliminado: false,
        agentes: {
          some: {
            agentId: agentId,
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
      },
      skip,
      take: pageSize,
      orderBy: { direccion: "asc" },
    });

    // Mapear a tipo Inmueble
    const inmuebles: Inmueble[] = inmueblesDb.map((inmueble) => ({
      id: inmueble.id,
      categoria_id: inmueble.categoryId,
      localidad_id: inmueble.localidadId,
      zona_id: inmueble.zonaId,
      barrio_id: inmueble.barrioId,
      direccion: inmueble.address,
      dormitorios: inmueble.numBedrooms,
      banos: inmueble.numBathrooms,
      superficie: inmueble.surface,
      cochera: inmueble.garage,
      eliminado: inmueble.deleted,
      estado_id: inmueble.statusId,
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
      imagenes: inmueble.imagenes?.map((img) => ({
        id: img.id,
        inmueble_id: img.inmuebleId,
        imagen: img.imagePath || undefined,
        es_principal: img.isPrincipal || undefined,
      })) || [],
    }));

    return jsonSuccess({ data: inmuebles, totalPages });
  } catch (error) {
    console.error("Error al obtener mis propiedades:", error);
    return jsonError("Error interno del servidor", 500);
  }
}
