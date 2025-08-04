import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { PropertyImage } from "@/types/inmueble_imagen";
import fs from "fs";
import path from "path";

// Normaliza el nombre del archivo: reemplaza espacios y caracteres especiales por guiones bajos y elimina tildes
function normalizeFileName(fileName: string): string {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .replace(/[^a-zA-Z0-9.\-_]/g, "_") // reemplaza todo lo que no sea letra, número, punto, guion o guion bajo
    .replace(/_+/g, "_"); // colapsa múltiples guiones bajos
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const { file, fileName, propertyId } = JSON.parse(body);

    if (!file || !fileName || propertyId === undefined || propertyId === null) {
      return jsonError(
        "Faltan datos requeridos: file, fileName, propertyId",
        400
      );
    }

    // Validar que la propiedad existe
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        deleted: false,
      },
    });

    if (!property) {
      return jsonError("Propiedad no encontrada", 404);
    }

    // Guardar el archivo en public/img/
    const normalizedFileName = normalizeFileName(fileName);
    const imgBuffer = Buffer.from(file.split(",")[1], "base64");
    const imgPath = path.join(
      process.cwd(),
      "public",
      "img",
      normalizedFileName
    );
    fs.writeFileSync(imgPath, imgBuffer);

    // Crear el registro de imagen en la base de datos
    const propertyImageDb = await prisma.propertyImage.create({
      data: {
        propertyId: propertyId,
        imagePath: `/img/${normalizedFileName}`,
      },
    });

    // Mapear a tipo PropertyImage
    const propertyImage: PropertyImage = {
      id: propertyImageDb.id,
      propertyId: propertyImageDb.propertyId,
      imagePath: propertyImageDb.imagePath || undefined,
    };

    return jsonSuccess<{ message: string; image: PropertyImage }>({
      message: "Imagen subida correctamente",
      image: propertyImage,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return jsonError("Error interno del servidor", 500);
  }
}
