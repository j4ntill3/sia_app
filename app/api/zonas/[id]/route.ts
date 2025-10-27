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
        { error: "El nombre de la zona es obligatorio" },
        { status: 400 }
      );
    }

    if (!localidad_id) {
      return NextResponse.json(
        { error: "La localidad es obligatoria" },
        { status: 400 }
      );
    }

    const zonaActualizada = await prisma.zona.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        localidad_id,
      },
    });

    return NextResponse.json({ data: zonaActualizada });
  } catch (error) {
    console.error("Error al actualizar zona:", error);
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

    await prisma.zona.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Zona eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar zona:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
