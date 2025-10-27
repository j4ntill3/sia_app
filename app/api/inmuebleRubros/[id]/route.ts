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
    const { categoria } = body;

    if (!categoria || categoria.trim() === "") {
      return jsonError("El nombre de la categoría es obligatorio", 400);
    }

    const categoriaActualizada = await prisma.categoria_inmueble.update({
      where: { id },
      data: { categoria: categoria.trim() },
    });

    return jsonSuccess(categoriaActualizada);
  } catch (error: any) {
    console.error("Error al actualizar categoría:", error);
    return jsonError(error.message || "Error al actualizar categoría", 500);
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

    await prisma.categoria_inmueble.delete({
      where: { id },
    });

    return jsonSuccess({ message: "Categoría eliminada correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar categoría:", error);
    return jsonError(error.message || "Error al eliminar categoría", 500);
  }
}
