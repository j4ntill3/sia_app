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
    const { nombre } = body;

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre de la localidad es obligatorio" },
        { status: 400 }
      );
    }

    const localidadActualizada = await prisma.localidad.update({
      where: { id },
      data: { nombre: nombre.trim() },
    });

    return NextResponse.json({ data: localidadActualizada });
  } catch (error) {
    console.error("Error al actualizar localidad:", error);
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

    await prisma.localidad.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Localidad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar localidad:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
