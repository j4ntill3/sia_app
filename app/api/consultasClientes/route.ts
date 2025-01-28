import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Consultar todos los registros de la tabla consultas_clientes
    const consultasClientes = await prisma.consultas_clientes.findMany({
      select: {
        id: true,
        id_inmueble: true,
        id_agente: true,
        nombre: true,
        apellido: true,
        telefono: true,
        email: true,
        fecha: true,
        descripcion: true,
      },
    });

    console.log("Consultas encontradas:", consultasClientes);

    if (!consultasClientes || consultasClientes.length === 0) {
      console.log("No se encontraron consultas de clientes");
      return new Response(
        JSON.stringify({
          message: "No se encontraron consultas de clientes",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Retornar las consultas en formato JSON
    console.log("Retornando consultas en formato JSON");
    return new Response(JSON.stringify(consultasClientes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error al obtener consultas de clientes:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error al obtener consultas de clientes",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
