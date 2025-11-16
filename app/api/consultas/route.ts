import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consultaClienteSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const validationResult = consultaClienteSchema.safeParse({
      id_inmueble: body.inmueble_id,
      nombre: body.nombre,
      apellido: body.apellido,
      telefono: body.telefono,
      correo: body.correo,
      descripcion: body.descripcion,
    });

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map((err) => err.message).join(", ");
      return NextResponse.json(
        { error: errorMessages },
        { status: 400 }
      );
    }

    const { id_inmueble: inmueble_id, nombre, apellido, telefono, correo, descripcion } = validationResult.data;

    // Verificar que el inmueble existe y no está eliminado
    const inmueble = await prisma.inmueble.findFirst({
      where: {
        id: inmueble_id,
        eliminado: false,
      },
    });

    if (!inmueble) {
      return NextResponse.json(
        { error: "Inmueble no encontrado" },
        { status: 404 }
      );
    }

    // Buscar un agente disponible asignado a este inmueble
    const agenteInmueble = await prisma.agente_inmueble.findFirst({
      where: {
        inmueble_id: inmueble_id,
        eliminado: false,
      },
    });

    // Si no hay agente asignado, buscar cualquier agente disponible
    let agente_id = agenteInmueble?.agente_id;

    if (!agente_id) {
      const primerAgente = await prisma.empleado.findFirst({
        where: {
          tipo_id: "agente",
          eliminado: false,
        },
      });
      agente_id = primerAgente?.id;
    }

    if (!agente_id) {
      return NextResponse.json(
        { error: "No hay agentes disponibles para procesar la consulta" },
        { status: 500 }
      );
    }

    // Crear la consulta
    const nuevaConsulta = await prisma.consulta_cliente.create({
      data: {
        inmueble_id,
        agente_id,
        nombre,
        apellido,
        telefono,
        correo,
        fecha: new Date(),
        descripcion: descripcion || "",
      },
    });

    return NextResponse.json(
      {
        message: "Consulta enviada exitosamente. Un agente se pondrá en contacto pronto.",
        data: {
          id: nuevaConsulta.id,
          inmueble_id: nuevaConsulta.inmueble_id,
          agente_id: nuevaConsulta.agente_id,
          nombre: nuevaConsulta.nombre,
          apellido: nuevaConsulta.apellido,
          telefono: nuevaConsulta.telefono,
          correo: nuevaConsulta.correo,
          fecha: nuevaConsulta.fecha,
          descripcion: nuevaConsulta.descripcion,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear consulta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
