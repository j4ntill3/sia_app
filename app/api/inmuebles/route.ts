import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const inmuebles = await prisma.inmueble.findMany({
      where: { eliminado: false },
    });

    if (!inmuebles || inmuebles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No se encontraron inmuebles" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(inmuebles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error completo al obtener inmuebles:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Error al obtener inmuebles",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
