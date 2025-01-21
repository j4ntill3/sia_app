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
        inmueble_estado: true,
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
      idRubro: inmuebleData.id_rubro,
      localidad: inmuebleData.localidad,
      direccion: inmuebleData.direccion,
      barrio: inmuebleData.barrio,
      numHabitaciones: inmuebleData.num_habitaciones,
      numBaños: inmuebleData.num_baños,
      superficie: inmuebleData.superficie,
      garaje: inmuebleData.garaje,
      id_estado: inmuebleData.id_estado,
      eliminado: inmuebleData.eliminado,
      ruta_imagen: rutaImagen,
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
