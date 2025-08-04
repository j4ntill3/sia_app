import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { PropertyImage } from "@/types/inmueble_imagen";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id_inmueble = formData.get("id_inmueble")?.toString();
    const imageFile = formData.get("image") as File;

    if (!id_inmueble || !imageFile) {
      return jsonError("Faltan parámetros", 400);
    }

    const uploadDir = "./public/img";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExtension = path.extname(imageFile.name);
    const fileName = `${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = await imageFile.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    const imagePath = `/img/${fileName}`;

    const newImageDb = await prisma.propertyImage.create({
      data: {
        propertyId: id_inmueble,
        imagePath: imagePath,
      },
    });

    // Mapear a tipo PropertyImage
    const newImage: PropertyImage = {
      id: newImageDb.id,
      propertyId: newImageDb.propertyId,
      imagePath: newImageDb.imagePath || undefined,
    };

    return jsonSuccess<{ url: string; image: PropertyImage }>({
      url: imagePath,
      image: newImage,
    });
  } catch (error) {
    console.error("Error al guardar la imagen:", error);
    return jsonError("Error al guardar la imagen en la base de datos", 500);
  }
}
