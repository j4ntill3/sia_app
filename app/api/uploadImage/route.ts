import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client"; // Prisma Client para interactuar con la base de datos

const prisma = new PrismaClient();

// Esta configuración asegura que Next.js no intente analizar el cuerpo por defecto
export const config = {
  api: {
    bodyParser: false, // Desactivar el body parser por defecto de Next.js
  },
};

// Manejar el método POST
export const POST = async (req: NextRequest) => {
  try {
    // Leer el cuerpo de la solicitud
    const buffer = await req.arrayBuffer();
    const body = Buffer.from(buffer).toString("utf8");

    // Extraer el archivo codificado en base64 y el nombre del archivo desde el cuerpo JSON
    const { file, fileName, id_inmueble } = JSON.parse(body);
    if (!file || !fileName || !id_inmueble) {
      return new NextResponse(
        JSON.stringify({ message: "Faltan parámetros requeridos." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extraer la parte base64 (sin el prefijo 'data:image/png;base64,')
    const base64Data = file.split(",")[1];

    // Definir la ruta donde vamos a guardar el archivo con el nombre original
    const filePath = path.join(
      process.cwd(),
      "public",
      "img",
      fileName // Usamos el nombre original del archivo
    );

    // Decodificar el archivo base64 y guardarlo
    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

    // Guardar en la base de datos el nombre de la imagen con el ID del inmueble correspondiente
    const inmuebleImagen = await prisma.inmueble_imagen.create({
      data: {
        id_inmueble: parseInt(id_inmueble), // Usamos el ID del inmueble del cuerpo
        ruta_imagen: `/img/${fileName}`, // Ruta de la imagen que guardamos
      },
    });

    // Responder con éxito y el nombre del archivo guardado
    return new NextResponse(
      JSON.stringify({
        message: "Imagen subida exitosamente.",
        fileName: path.basename(filePath),
        inmuebleImagen, // Información del registro guardado
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al procesar la carga:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error interno del servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
