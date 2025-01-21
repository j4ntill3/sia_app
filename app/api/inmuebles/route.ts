import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const inmuebles = await prisma.inmueble.findMany({
      where: { eliminado: false },
      include: {
        inmueble_imagen: {
          select: { ruta_imagen: true }, // Solo obtener la ruta de las imágenes.
        },
      },
    });

    if (!inmuebles || inmuebles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No se encontraron inmuebles" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Transformar los datos para incluir una imagen genérica si no hay imágenes asociadas
    const inmueblesConImagen = inmuebles.map((inmueble) => {
      // Si no hay imágenes asociadas, asignar la imagen genérica
      const ruta_imagen =
        inmueble.inmueble_imagen && inmueble.inmueble_imagen.length > 0
          ? inmueble.inmueble_imagen[0].ruta_imagen // Tomar la primera imagen
          : "img/image-icon-600nw-211642900.webp"; // Ruta de la imagen genérica

      return {
        ...inmueble,
        ruta_imagen, // Asignamos la ruta de la imagen (o la genérica)
      };
    });

    return new Response(JSON.stringify(inmueblesConImagen), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error al obtener inmuebles:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al obtener inmuebles" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
