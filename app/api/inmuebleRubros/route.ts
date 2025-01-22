import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const rubros = await prisma.inmueble_rubro.findMany();

    if (!rubros || rubros.length === 0) {
      return new Response(
        JSON.stringify({ message: "No se encontraron rubros" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(rubros), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error al obtener rubros:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al obtener rubros" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
