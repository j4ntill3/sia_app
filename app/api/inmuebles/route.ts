import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Obtener todos los inmuebles que no están eliminados
    const inmuebles = await prisma.inmueble.findMany({
      where: { eliminado: false }, // Filtrar solo inmuebles no eliminados
    });

    // Verificar si la lista de inmuebles está vacía
    if (!inmuebles || inmuebles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No se encontraron inmuebles" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Retornar los inmuebles encontrados
    return new Response(JSON.stringify(inmuebles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // Captura el error completo y loguea más detalles
    console.error("Error completo al obtener inmuebles:", error);

    // Retornar un mensaje de error con el detalle real del error
    return new Response(
      JSON.stringify({
        error: error.message || "Error al obtener inmuebles",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
