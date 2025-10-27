import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { jsonError, jsonSuccess, requireAuth } from "@/lib/api-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error, status } = await requireAuth(request, "administrador");
  if (error) return NextResponse.json({ error }, { status });

  try {
    const id = params.id;
    const body = await request.json();
    const { estado } = body;

    if (!estado || estado.trim() === "") {
      return jsonError("El nombre del estado es obligatorio", 400);
    }

    const estadoActualizado = await prisma.estado_inmueble.update({
      where: { id },
      data: { estado: estado.trim() },
    });

    return jsonSuccess(estadoActualizado);
  } catch (error: any) {
    console.error("Error al actualizar estado:", error);
    return jsonError(error.message || "Error al actualizar estado", 500);
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

    await prisma.estado_inmueble.delete({
      where: { id },
    });

    return jsonSuccess({ message: "Estado eliminado correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar estado:", error);
    return jsonError(error.message || "Error al eliminar estado", 500);
  }
}
