import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError, jsonSuccess } from "@/lib/api-helpers";
import { propertySchema } from "@/lib/validation";
import type { Property, PropertyImage } from "@/types/inmueble";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);
    const skip = (page - 1) * pageSize;

    const [total, properties] = await Promise.all([
      prisma.property.count({ where: { deleted: false } }),
      prisma.property.findMany({
        where: { deleted: false },
        include: { propertyImage: { orderBy: { id: "desc" } } },
        skip,
        take: pageSize,
        orderBy: { id: "asc" },
      }),
    ]);

    const propertiesWithImage: Property[] = properties.map((property) => ({
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

    const totalPages = Math.ceil(total / pageSize);

    return jsonSuccess({
      data: propertiesWithImage,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    return jsonError("Error interno del servidor", 500);
  }
}

export async function POST(request: NextRequest) {
  // Solo administradores pueden crear propiedades
  const { session, error, status } = await requireAuth(
    request,
    "administrador"
  );
  if (error) return jsonError(error, status);

  try {
    const body = await request.json();
    // Validar datos con zod
    const parse = propertySchema.safeParse({
      ...body,
      categoryId: Number(body.categoryId),
      numBedrooms: Number(body.numBedrooms),
      numBathrooms: Number(body.numBathrooms),
      surface: Number(body.surface),
      garage: Boolean(body.garage),
      statusId: Number(body.statusId),
    });
    if (!parse.success) {
      return jsonError(
        "Datos inválidos: " + JSON.stringify(parse.error.flatten().fieldErrors),
        400
      );
    }
    const data = parse.data;

    // Crear la propiedad
    const newProperty = await prisma.property.create({
      data: {
        title: data.title,
        categoryId: data.categoryId,
        locality: data.locality,
        address: data.address,
        neighborhood: data.neighborhood,
        numBedrooms: data.numBedrooms,
        numBathrooms: data.numBathrooms,
        surface: data.surface,
        garage: data.garage,
        statusId: data.statusId,
        deleted: false,
      },
    });

    let propertyImages: PropertyImage[] = [];
    // Si se proporciona una imagen, crear el registro de imagen
    if (data.imagePath) {
      const img = await prisma.propertyImage.create({
        data: {
          propertyId: newProperty.id,
          imagePath: data.imagePath,
        },
      });
      propertyImages = [
        {
          id: img.id,
          propertyId: img.propertyId,
          imagePath: img.imagePath || undefined,
        },
      ];
    }

    // Mapear a tipo Property
    const propertyResult: Property = {
      id: newProperty.id,
      title: newProperty.title,
      categoryId: newProperty.categoryId,
      locality: newProperty.locality,
      address: newProperty.address,
      neighborhood: newProperty.neighborhood,
      numBedrooms: newProperty.numBedrooms,
      numBathrooms: newProperty.numBathrooms,
      surface: newProperty.surface,
      garage: newProperty.garage,
      deleted: newProperty.deleted ?? false,
      statusId: newProperty.statusId,
      propertyImage: propertyImages,
    };

    return jsonSuccess<Property>(propertyResult, 201);
  } catch (error) {
    console.error("Error al crear propiedad:", error);
    return jsonError("Error interno del servidor", 500);
  }
}
