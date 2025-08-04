import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError, jsonSuccess } from "@/lib/api-helpers";
import { propertySchema } from "@/lib/validation";
import type { Property, PropertyImage } from "@/types/inmueble";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return jsonError("ID de propiedad inválido", 400);
    }
    const property = await prisma.property.findFirst({
      where: {
        id: id,
        deleted: false,
      },
      include: {
        propertyStatus: {
          select: {
            status: true,
          },
        },
        propertyCategory: {
          select: {
            category: true,
          },
        },
        propertyImage: {
          orderBy: { id: "desc" },
        },
      },
    });
    if (!property) {
      return jsonError("Propiedad no encontrada", 404);
    }
    // Mapear a tipo Property
    const propertyData: Property = {
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
      propertyCategory: property.propertyCategory
        ? {
            id: property.categoryId,
            category: property.propertyCategory.category,
          }
        : undefined,
      propertyStatus: property.propertyStatus
        ? { id: property.statusId, status: property.propertyStatus.status }
        : undefined,
    };
    return jsonSuccess<Property>(propertyData);
  } catch (error) {
    console.error("Error al obtener propiedad:", error);
    return jsonError("Error interno del servidor", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error, status } = await requireAuth(
    request,
    "administrador"
  );
  if (error) return jsonError(error, status);
  try {
    const id = params.id;
    if (!id) {
      return jsonError("ID de propiedad inválido", 400);
    }
    const body = await request.json();
    // Validar datos con zod (parcial)
    const parse = propertySchema.partial().safeParse({
      ...body,
      categoryId: body.categoryId,
      numBedrooms:
        body.numBedrooms !== undefined ? Number(body.numBedrooms) : undefined,
      numBathrooms:
        body.numBathrooms !== undefined ? Number(body.numBathrooms) : undefined,
      surface: body.surface !== undefined ? Number(body.surface) : undefined,
      garage: body.garage !== undefined ? Boolean(body.garage) : undefined,
      statusId: body.statusId,
    });
    if (!parse.success) {
      return jsonError(
        "Datos inválidos: " + JSON.stringify(parse.error.flatten().fieldErrors),
        400
      );
    }
    const updateData = parse.data;
    // Validar que la propiedad existe
    const existingProperty = await prisma.property.findFirst({
      where: {
        id: id,
        deleted: false,
      },
    });
    if (!existingProperty) {
      return jsonError("Propiedad no encontrada", 404);
    }
    const updatedProperty = await prisma.property.update({
      where: { id: id },
      data: updateData,
      include: {
        propertyStatus: {
          select: {
            status: true,
          },
        },
        propertyCategory: {
          select: {
            category: true,
          },
        },
        propertyImage: true,
      },
    });
    // Mapear a tipo Property
    const propertyData: Property = {
      id: updatedProperty.id,
      title: updatedProperty.title,
      categoryId: updatedProperty.categoryId,
      locality: updatedProperty.locality,
      address: updatedProperty.address,
      neighborhood: updatedProperty.neighborhood,
      numBedrooms: updatedProperty.numBedrooms,
      numBathrooms: updatedProperty.numBathrooms,
      surface: updatedProperty.surface,
      garage: updatedProperty.garage,
      deleted: updatedProperty.deleted ?? false,
      statusId: updatedProperty.statusId,
      propertyImage:
        updatedProperty.propertyImage?.map((img) => ({
          id: img.id,
          propertyId: img.propertyId,
          imagePath: img.imagePath || undefined,
        })) || [],
      propertyCategory: updatedProperty.propertyCategory
        ? {
            id: updatedProperty.categoryId,
            category: updatedProperty.propertyCategory.category,
          }
        : undefined,
      propertyStatus: updatedProperty.propertyStatus
        ? {
            id: updatedProperty.statusId,
            status: updatedProperty.propertyStatus.status,
          }
        : undefined,
    };
    return jsonSuccess<Property>(propertyData);
  } catch (error) {
    console.error("Error al actualizar propiedad:", error);
    return jsonError("Error interno del servidor", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error, status } = await requireAuth(
    request,
    "administrador"
  );
  if (error) return jsonError(error, status);
  try {
    const id = params.id;
    if (!id) {
      return jsonError("ID de propiedad inválido", 400);
    }
    await prisma.property.update({
      where: { id: id },
      data: { deleted: true },
    });
    return jsonSuccess({ message: "Propiedad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar propiedad:", error);
    return jsonError("Error interno del servidor", 500);
  }
}
