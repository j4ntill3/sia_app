import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id_inmueble = formData.get("id_inmueble")?.toString();
    const imageFile = formData.get("image") as File;

    if (!id_inmueble || !imageFile) {
      return new Response(JSON.stringify({ error: "Faltan parámetros" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
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

    const newImage = await prisma.inmueble_imagen.create({
      data: {
        id_inmueble: parseInt(id_inmueble), // Asegurarse de que sea un número
        ruta_imagen: imagePath,
      },
    });

    return new Response(JSON.stringify({ url: imagePath }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al guardar la imagen:", error);
    return new Response(
      JSON.stringify({
        error: "Error al guardar la imagen en la base de datos",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
