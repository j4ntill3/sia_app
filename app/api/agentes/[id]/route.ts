import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";

// GET: Obtener un agente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const empleado = await prisma.empleado.findUnique({
      where: { id },
      include: {
        personas_empleado: {
          include: {
            persona: {
              include: {
                imagenes: true,
              },
            },
          },
        },
        tipo: true,
      },
    });

    if (!empleado) {
      return NextResponse.json(
        { error: "Agente no encontrado" },
        { status: 404 }
      );
    }

    const persona = empleado.personas_empleado[0]?.persona;

    return NextResponse.json({
      data: {
        empleado,
        persona,
      },
    });
  } catch (error) {
    console.error("Error al obtener agente:", error);
    return NextResponse.json(
      { error: "Error al obtener agente" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar agente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, status } = await requireAuth(request, "administrador");
  if (error) return NextResponse.json({ error }, { status });

  try {
    const { id } = await params;
    const body = await request.json();

    // Obtener el empleado y persona actual
    const empleado = await prisma.empleado.findUnique({
      where: { id },
      include: {
        personas_empleado: {
          include: {
            persona: true,
          },
        },
      },
    });

    if (!empleado) {
      return NextResponse.json(
        { error: "Agente no encontrado" },
        { status: 404 }
      );
    }

    const personaId = empleado.personas_empleado[0]?.persona.id;

    if (!personaId) {
      return NextResponse.json(
        { error: "No se encontró la persona asociada" },
        { status: 404 }
      );
    }

    // Actualizar persona
    if (body.nombre || body.apellido || body.telefono || body.email || body.direccion || body.DNI || body.fechaNacimiento) {
      // Validar DNI si se proporciona
      if (body.DNI) {
        const dniString = String(body.DNI);
        if (!/^\d{7,8}$/.test(dniString)) {
          return NextResponse.json(
            { error: "El DNI debe contener 7 u 8 dígitos" },
            { status: 400 }
          );
        }

        // Verificar si el DNI ya existe en otra persona
        const existingDNI = await prisma.persona.findFirst({
          where: {
            dni: Number(dniString),
            eliminado: false,
            NOT: { id: personaId }
          },
        });
        if (existingDNI) {
          return NextResponse.json({ error: "Ya existe otra persona con este DNI" }, { status: 409 });
        }
      }

      await prisma.persona.update({
        where: { id: personaId },
        data: {
          ...(body.nombre && { nombre: body.nombre }),
          ...(body.apellido && { apellido: body.apellido }),
          ...(body.telefono && { telefono: body.telefono }),
          ...(body.email && { correo: body.email }),
          ...(body.direccion && { direccion: body.direccion }),
          ...(body.DNI && { dni: Number(String(body.DNI)) }),
          ...(body.fechaNacimiento && {
            fecha_nacimiento: new Date(body.fechaNacimiento + "T00:00:00Z"),
          }),
        },
      });
    }

    // Actualizar empleado
    if (body.cuit !== undefined || body.activo !== undefined) {
      console.log("=".repeat(50));
      console.log("PUT /api/agentes/[id] - ACTUALIZANDO EMPLEADO");
      console.log("body.activo:", body.activo);
      console.log("fecha_egreso que se guardará:", body.activo ? null : new Date());
      console.log("body.eliminado:", body.eliminado);
      console.log("=".repeat(50));

      const updateData: any = {};
      if (body.cuit) updateData.cuit = body.cuit;
      if (body.activo !== undefined) {
        updateData.fecha_egreso = body.activo ? null : new Date();
      }

      console.log("Datos que se actualizarán:", JSON.stringify(updateData, null, 2));

      await prisma.empleado.update({
        where: { id },
        data: updateData,
      });

      console.log("Empleado actualizado exitosamente");
    }

    // Obtener datos actualizados
    const updatedEmpleado = await prisma.empleado.findUnique({
      where: { id },
      include: {
        personas_empleado: {
          include: {
            persona: {
              include: {
                imagenes: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      data: {
        empleado: updatedEmpleado,
        persona: updatedEmpleado?.personas_empleado[0]?.persona,
      },
      message: "Agente actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar agente:", error);
    return NextResponse.json(
      { error: "Error al actualizar agente" },
      { status: 500 }
    );
  }
}

// DELETE: Soft delete agente
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, status } = await requireAuth(request, "administrador");
  if (error) return NextResponse.json({ error }, { status });

  try {
    const { id } = await params;

    await prisma.empleado.update({
      where: { id },
      data: { eliminado: true },
    });

    return NextResponse.json({
      message: "Agente eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar agente:", error);
    return NextResponse.json(
      { error: "Error al eliminar agente" },
      { status: 500 }
    );
  }
}
