import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error, status } = await requireAuth(request, "administrador");
  if (error) return NextResponse.json({ error }, { status });

  try {
    const id = params.id;
    const body = await request.json();
    const { nombre, localidad_id } = body;

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre del barrio es obligatorio" },
        { status: 400 }
      );
    }

    if (!localidad_id) {
      return NextResponse.json(
        { error: "La localidad es obligatoria" },
        { status: 400 }
      );
    }

    const barrioActualizado = await prisma.barrio.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        localidad_id,
      },
    });

    return NextResponse.json({ data: barrioActualizado });
  } catch (error) {
    console.error("Error al actualizar barrio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error, status } = await requireAuth(request, "administrador");
  if (error) return NextResponse.json({ error }, { status });

  try {
    const id = params.id;

    await prisma.barrio.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Barrio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar barrio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
