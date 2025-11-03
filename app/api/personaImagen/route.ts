import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id_persona = formData.get("id_persona")?.toString();
    const imageFile = formData.get("image") as File;

    if (!id_persona || !imageFile) {
      return jsonError("Faltan parámetros", 400);
    }

    // Verificar si ya existen imágenes para esta persona
    const existingImages = await prisma.imagen_persona.findMany({
      where: { persona_id: id_persona },
    });

    // Eliminar archivos físicos anteriores
    if (existingImages.length > 0) {
      for (const img of existingImages) {
        if (img.imagen) {
          const oldFilePath = path.join("./public", img.imagen);
          if (fs.existsSync(oldFilePath)) {
            try {
              fs.unlinkSync(oldFilePath);
            } catch (error) {
              console.error("Error al eliminar archivo antiguo:", error);
            }
          }
        }
      }

      // Eliminar registros antiguos de la base de datos
      await prisma.imagen_persona.deleteMany({
        where: { persona_id: id_persona },
      });
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

    const newImageDb = await prisma.imagen_persona.create({
      data: {
        persona_id: id_persona,
        imagen: imagePath,
      },
    });

    return jsonSuccess({
      url: imagePath,
      image: {
        id: newImageDb.id,
        personId: newImageDb.persona_id,
        imagePath: newImageDb.imagen || undefined,
      },
    });
  } catch (error) {
    console.error("Error al guardar la imagen de persona:", error);
    return jsonError("Error al guardar la imagen en la base de datos", 500);
  }
}
