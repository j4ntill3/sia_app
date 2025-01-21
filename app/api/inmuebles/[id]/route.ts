import { PrismaClient } from "@prisma/client";
import type Inmueble from "@/types/inmueble";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params; // Asegurándonos de esperar a los parámetros

  try {
    const inmuebleData = await prisma.inmueble.findUnique({
      where: { id: Number(id) },
      include: {
        inmueble_estado: {
          select: { estado: true }, // Incluye solo el nombre del estado
        },
        inmueble_rubro: {
          select: { rubro: true }, // Incluye solo el nombre del rubro
        },
        inmueble_imagen: true,
      },
    });

    if (!inmuebleData) {
      return new Response(JSON.stringify({ error: "Inmueble no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rutaImagen =
      inmuebleData.inmueble_imagen?.[0]?.ruta_imagen ||
      "/img/image-icon-600nw-211642900.webp";

    // Estructurando el objeto conforme al tipo 'Inmueble'
    const inmueble: Inmueble = {
      id: inmuebleData.id,
      title: inmuebleData.title,
      idRubro: inmuebleData.inmueble_rubro?.rubro,
      localidad: inmuebleData.localidad,
      direccion: inmuebleData.direccion,
      barrio: inmuebleData.barrio,
      numHabitaciones: inmuebleData.num_habitaciones,
      numBaños: inmuebleData.num_baños,
      superficie: inmuebleData.superficie,
      garaje: inmuebleData.garaje,
      eliminado: inmuebleData.eliminado,
      estado: inmuebleData.inmueble_estado?.estado,
      ruta_imagen:
        inmuebleData.inmueble_imagen?.[0]?.ruta_imagen ||
        "/img/image-icon-600nw-211642900.webp",
    };

    return new Response(JSON.stringify(inmueble), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener el inmueble:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener el inmueble" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Asegúrate de esperar los parámetros antes de acceder a sus propiedades
  const { id } = await params; // Ahora esperamos a que los params sean resueltos

  try {
    // Verificar si el inmueble existe
    const inmuebleExistente = await prisma.inmueble.findUnique({
      where: { id: Number(id) },
    });

    if (!inmuebleExistente) {
      return new Response(JSON.stringify({ error: "Inmueble no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Marcar el inmueble como eliminado
    const inmuebleEliminado = await prisma.inmueble.update({
      where: { id: Number(id) },
      data: { eliminado: true },
    });

    return new Response(JSON.stringify(inmuebleEliminado), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al eliminar el inmueble:", error);
    return new Response(
      JSON.stringify({ error: "Error al eliminar el inmueble" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
