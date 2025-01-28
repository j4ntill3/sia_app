import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { getSession } from "@/actions/auth-actions"; // Asumiendo que tienes esta función

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Mostrar los datos recibidos en el cuerpo de la solicitud
    const data = await request.json();
    console.log("Datos recibidos en la solicitud:", data);

    // Obtener la sesión utilizando tu función personalizada
    const session = await getSession();
    const agenteId = session?.user.id;
    // Esto depende de cómo almacenes el ID en el token
    console.log("Datos de la sesión:", session);

    if (!agenteId) {
      return new Response(
        JSON.stringify({ error: "No autenticado o no se encontró el agente" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener el id del agente desde la sesión y convertirlo a número
    const idAgente = Number(session.user.id);
    console.log("ID del agente desde la sesión:", idAgente);

    // Verificar que el inmueble pertenece al agente
    const inmuebleAgente = await prisma.inmueble_agente.findFirst({
      where: {
        id_inmueble: data.id_inmueble,
        id_agente: idAgente, // idAgente ya es un número
        eliminado: false,
      },
    });

    console.log("Resultado de la búsqueda en inmueble_agente:", inmuebleAgente);

    if (!inmuebleAgente) {
      console.log("El inmueble no pertenece al agente.");
      return new Response(
        JSON.stringify({ error: "Este inmueble no le pertenece al agente." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear la consulta del cliente
    const nuevaConsulta = await prisma.consultas_clientes.create({
      data: {
        id_inmueble: data.id_inmueble,
        id_agente: idAgente, // idAgente ya es un número
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        email: data.email,
        fecha: new Date(), // Fecha actual
        descripcion: data.descripcion || "", // Usar cadena vacía si no se proporciona descripción
      },
    });

    console.log("Consulta creada con éxito:", nuevaConsulta);

    return new Response(
      JSON.stringify({
        message: "Consulta creada correctamente",
        nuevaConsulta,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error al crear la consulta:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
