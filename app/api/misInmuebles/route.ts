import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { Property } from "@/types/inmueble";

export async function GET(request: NextRequest) {
  const { session, error, status } = await requireAuth(request, "agente");
  if (error) return jsonError(error, status);
  try {
    const agentIdNumber = Number(session.user.id);
    // Leer parámetros de paginación
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);
    const skip = (page - 1) * pageSize;

    // Contar total de inmuebles
    const totalCount = await prisma.property.count({
      where: {
        deleted: false,
        propertyAgent: {
          some: {
            agentId: agentIdNumber,
            deleted: false,
          },
        },
      },
    });
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    // Obtener inmuebles paginados
    const propertiesDb = await prisma.property.findMany({
      where: {
        deleted: false,
        propertyAgent: {
          some: {
            agentId: agentIdNumber,
            deleted: false,
          },
        },
      },
      include: {
        propertyImage: true,
      },
      skip,
      take: pageSize,
      orderBy: { id: "desc" },
    });
    // Mapear a tipo Property
    const properties: Property[] = propertiesDb.map((property) => ({
      id: property.id,
      title: property.title,
      categoryId: property.categoryId,
      locality: property.locality,
      address: property.address,
      neighborhood: property.neighborhood,
      numBedrooms: property.numBedrooms,
      numBathrooms: property.numBathrooms,
      surface: property.surface,
      garage: property.garage,
      deleted: property.deleted ?? false,
      statusId: property.statusId,
      propertyImage:
        property.propertyImage?.map((img) => ({
          id: img.id,
          propertyId: img.propertyId,
          imagePath: img.imagePath || undefined,
        })) || [],
    }));
    return jsonSuccess({ data: properties, totalPages });
  } catch (error) {
    console.error("Error al obtener mis propiedades:", error);
    return jsonError("Error interno del servidor", 500);
  }
}
