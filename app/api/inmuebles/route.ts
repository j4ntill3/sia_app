import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const inmuebles = await prisma.inmueble.findMany({
      where: { eliminado: false },
      include: {
        inmueble_imagen: {
          take: 1,
          orderBy: {
            id: "desc",
          },
        },
      },
    });

    // Transformar los datos para incluir una imagen genérica si no hay imágenes asociadas
    const inmueblesConImagen = inmuebles.map((inmueble) => {
      // Si no hay imágenes asociadas, asignar la imagen genérica
      const ruta_imagen =
        inmueble.inmueble_imagen && inmueble.inmueble_imagen.length > 0
          ? inmueble.inmueble_imagen[0].ruta_imagen // Tomar la primera imagen
          : "img/image-icon-600nw-211642900.webp"; // Ruta de la imagen genérica

      return {
        ...inmueble,
        ruta_imagen, // Asignamos la ruta de la imagen (o la genérica)
      };
    });

    if (!inmuebles || inmuebles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No se encontraron inmuebles" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Asegúrate de que los valores sean del tipo correcto antes de insertarlos en la base de datos
    const nuevoInmueble = await prisma.inmueble.create({
      data: {
        title: data.title,
        id_rubro: Number(data.id_rubro), // Asegurarse de que id_rubro sea un número
        localidad: data.localidad,
        direccion: data.direccion,
        barrio: data.barrio || "", // Usar una cadena vacía si no se proporciona barrio
        num_habitaciones: Number(data.num_habitaciones), // Asegurarse de que sea un número
        num_baños: Number(data.num_baños), // Asegurarse de que sea un número
        superficie: Number(data.superficie), // Asegurarse de que superficie sea un número
        garaje: Boolean(data.garaje), // Convertir a booleano (true/false)
        eliminado: Boolean(data.eliminado || false), // Asegurarse de que eliminado sea un booleano
        id_estado: Number(data.id_estado), // Asegurarse de que id_estado sea un número
      },
    });

    // Crear la imagen asociada al inmueble con la ruta proporcionada
    const nuevaImagen = await prisma.inmueble_imagen.create({
      data: {
        id_inmueble: nuevoInmueble.id,
        ruta_imagen: data.ruta_imagen || "/img/imagen_generica.webp", // Ruta de imagen genérica si no se proporciona
      },
    });

    return new Response(
      JSON.stringify({
        message: "Inmueble creado correctamente",
        nuevoInmueble,
        nuevaImagen,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error al crear el inmueble:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
