import { PrismaClient } from "@prisma/client";
import { getSession } from "@/actions/auth-actions"; // Importa la función getSession para autenticar
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Obtener la sesión del usuario
    const session = await getSession();
    console.log("Sesión obtenida:", session);

    const agenteId = session?.user.id; // ID del agente, asegúrate de que esté correctamente configurado en la sesión
    console.log("ID del agente:", agenteId);

    if (!agenteId) {
      console.log("No autenticado o no se encontró el agente");
      return new Response(
        JSON.stringify({ error: "No autenticado o no se encontró el agente" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convertir el id del agente a número
    const agenteIdNumber = parseInt(agenteId as string, 10);
    console.log("ID del agente convertido a número:", agenteIdNumber);

    if (isNaN(agenteIdNumber)) {
      console.log("ID del agente es inválido");
      return new Response(JSON.stringify({ error: "ID del agente inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Consultar las consultas de clientes asociadas al agente
    const consultasClientes = await prisma.consultas_clientes.findMany({
      where: {
        id_agente: agenteIdNumber,
      },
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
      console.log("No se encontraron consultas de clientes para este agente");
      return new Response(
        JSON.stringify({
          message: "No se encontraron consultas de clientes para este agente",
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
