import { prisma } from "@/lib/prisma";
import type Inmueble from "@/types/inmueble";

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
      titulo: inmuebleData.titulo,
      rubro: inmuebleData.inmueble_rubro?.rubro ?? "", // Asignamos un valor por defecto
      estado: inmuebleData.inmueble_estado?.estado ?? "", // Asignamos un valor por defecto
      localidad: inmuebleData.localidad,
      direccion: inmuebleData.direccion,
      barrio: inmuebleData.barrio,
      num_habitaciones: inmuebleData.num_habitaciones,
      num_banos: inmuebleData.num_baños,
      superficie: inmuebleData.superficie,
      garaje: inmuebleData.garaje,
      eliminado: inmuebleData.eliminado,
      ruta_imagen:
        inmuebleData.inmueble_imagen?.[0]?.ruta_imagen ||
        "/img/image-icon-600nw-211642900.webp",
      fecha_creacion: inmuebleData.fecha_creacion, // Asignamos el valor de la base de datos
      id_usuario_creador: inmuebleData.id_usuario_creador, // Asignamos el valor de la base de datos
      fecha_modificacion: inmuebleData.fecha_modificacion ?? null, // Permitir null si no está disponible
      id_usuario_modificador: inmuebleData.id_usuario_modificador ?? null, // Permitir null si no está disponible
      fecha_eliminacion: inmuebleData.fecha_eliminacion ?? null, // Permitir null si no está disponible
      id_usuario_eliminador: inmuebleData.id_usuario_eliminador ?? null, // Permitir null si no está disponible
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
    console.log("Parámetros recibidos:", params);

    const { id } = await params;

    // Verificamos si el inmueble existe
    const inmuebleExistente = await prisma.inmueble.findUnique({
      where: { id: Number(id) },
    });

    console.log("Inmueble existente:", inmuebleExistente);

    if (!inmuebleExistente) {
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
      console.log("Error: Faltan datos en la solicitud:", requestData);
      return new Response(
        JSON.stringify({ error: "Falta el campo o el valor para actualizar" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Mapeo entre los nombres mostrados en el frontend y las columnas reales en la base de datos
    const fieldMapping: Record<string, string> = {
      título: "title",
      rubro: "id_rubro",
      localidad: "localidad",
      dirección: "direccion",
      barrio: "barrio",
      habitaciones: "num_habitaciones",
      baños: "num_baños",
      superficie: "superficie",
      garaje: "garaje",
      estado: "id_estado",
    };

    const dbField = fieldMapping[requestData.field];
    console.log("Campo a actualizar:", dbField);
    console.log("Valor recibido (original):", requestData.value);

    if (!dbField) {
      console.log("Error: Campo inválido proporcionado:", requestData.field);
      return new Response(
        JSON.stringify({ error: "Campo inválido para actualizar" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convertimos el valor según el tipo de campo
    let value: number | boolean | string = requestData.value;

    if (
      dbField === "id_rubro" ||
      dbField === "num_habitaciones" ||
      dbField === "num_baños" ||
      dbField === "superficie" ||
      dbField === "id_estado"
    ) {
      value = Number(requestData.value);

      if (isNaN(value)) {
        console.log("Error: El valor proporcionado no es un número válido.");
        return new Response(
          JSON.stringify({
            error: `El valor de '${dbField}' debe ser un número válido`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    } else if (dbField === "garaje") {
      value = requestData.value === "true"; // Convertimos a booleano
    }

    console.log("Valor procesado (convertido):", value);

    // Construimos el objeto de actualización
    const updateData = {
      [dbField]: value,
    };
    console.log("Objeto de actualización:", updateData);

    // Actualizamos el inmueble en la base de datos
    const inmuebleActualizado = await prisma.inmueble.update({
      where: { id: Number(id) },
      data: updateData,
    });

    console.log("Inmueble actualizado exitosamente:", inmuebleActualizado);

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
