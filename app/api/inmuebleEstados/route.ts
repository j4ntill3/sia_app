import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const estados = await prisma.inmueble_estado.findMany();

    if (!estados || estados.length === 0) {
      return new Response(
        JSON.stringify({ message: "No se encontraron estados" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(estados), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error al obtener estados:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al obtener estados" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
