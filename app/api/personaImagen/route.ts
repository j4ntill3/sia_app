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
