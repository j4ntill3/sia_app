import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/actions/auth-actions"; // Importa la función getSession desde actions/auth-actions

export async function GET(request: NextRequest) {
  try {
    // Obtener la sesión utilizando tu función personalizada
    const session = await getSession();
    const agenteId = session?.user.id; // Esto depende de cómo almacenes el ID en el token
    console.log("Datos de la sesión:", session);

    if (!agenteId) {
      return new Response(
        JSON.stringify({ error: "No autenticado o no se encontró el agente" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Asegúrate de que agenteId sea un número
    const agenteIdNumber = parseInt(agenteId as string, 10);

    if (isNaN(agenteIdNumber)) {
      return new Response(JSON.stringify({ error: "ID del agente inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Obtener los inmuebles asignados al agente
    const inmuebles = await prisma.inmueble.findMany({
      where: {
        eliminado: false,
        inmueble_agente: {
          some: {
            id_agente: agenteIdNumber,
            eliminado: false,
          },
        },
      },
      include: {
        inmueble_imagen: {
          take: 1, // Obtén solo un registro
          orderBy: {
            id: "desc", // Ordena por id en orden descendente para obtener el último registro
          },
        },
      },
    });

    if (!inmuebles || inmuebles.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No se encontraron inmuebles asignados al agente",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Transformar los datos para incluir una imagen genérica si no hay imágenes asociadas
    const inmueblesConImagen = inmuebles.map((inmueble) => {
      const ruta_imagen =
        inmueble.inmueble_imagen && inmueble.inmueble_imagen.length > 0
          ? inmueble.inmueble_imagen[0].ruta_imagen
          : "img/image-icon-600nw-211642900.webp"; // Ruta de la imagen genérica

      return {
        ...inmueble,
        ruta_imagen,
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
