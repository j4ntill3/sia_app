import { PrismaClient } from "@prisma/client";
import type Inmueble from "@/types/inmueble";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params; // Asegurándonos de esperar a los parámetros

  try {
    const inmuebleData = await prisma.inmueble.findFirst({
      where: {
        id: Number(id),
        eliminado: false, // Solo devolver inmuebles que no estén eliminados
      },
      include: {
        inmueble_estado: {
          select: { estado: true },
        },
        inmueble_rubro: {
          select: { rubro: true },
        },
        inmueble_imagen: {
          take: 1, // Obtén solo un registro
          orderBy: {
            id: "desc", // Ordena por id en orden descendente para obtener el último registro
          },
        },
      },
    });

    if (!inmuebleData) {
      return new Response(JSON.stringify({ error: "Inmueble no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Estructurando el objeto conforme al tipo 'Inmueble'
    const inmueble: Inmueble = {
      id: inmuebleData.id,
      title: inmuebleData.title,
      id_rubro: inmuebleData.inmueble_rubro.rubro,
      localidad: inmuebleData.localidad,
      direccion: inmuebleData.direccion,
      barrio: inmuebleData.barrio,
      num_habitaciones: inmuebleData.num_habitaciones,
      num_baños: inmuebleData.num_baños,
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificamos si estamos recibiendo correctamente el ID
    const { id } = await params;
    console.log("ID del inmueble a actualizar:", id);

    // Verificamos si el inmueble existe
    const inmuebleExistente = await prisma.inmueble.findUnique({
      where: { id: Number(id) },
    });

    if (!inmuebleExistente) {
      console.log("Inmueble no encontrado");
      return new Response(JSON.stringify({ error: "Inmueble no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Obtenemos los datos del cuerpo de la solicitud
    const requestData = await request.json();
    console.log("Datos recibidos en el cuerpo de la solicitud:", requestData);

    // Verificamos que la solicitud contenga 'field' y 'value'
    if (!requestData.field || !requestData.value) {
      console.log("Faltan datos en la solicitud (field o value)");
      return new Response(
        JSON.stringify({ error: "Falta el campo o el valor para actualizar" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificamos el contenido de 'field' y 'value'
    console.log(
      `Campo a actualizar: ${requestData.field}, Nuevo valor: ${requestData.value}`
    );

    // Construimos el objeto de actualización
    const updateData = {
      [requestData.field]: requestData.value,
    };
    console.log("Objeto de actualización:", updateData);

    // Intentamos actualizar el inmueble en la base de datos
    const inmuebleActualizado = await prisma.inmueble.update({
      where: { id: Number(id) },
      data: updateData,
    });

    console.log("Inmueble actualizado:", inmuebleActualizado);

    return new Response(JSON.stringify(inmuebleActualizado), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al actualizar el inmueble:", error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar el inmueble" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
