import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { jsonError, jsonSuccess, requireAuth } from "@/lib/api-helpers";
import type { CategoriaInmueble } from "@/types/inmueble";

export async function GET(request: NextRequest) {
  try {
    const categoriasDb = await prisma.categoria_inmueble.findMany({
      orderBy: { categoria: "asc" },
    });
    const categorias: CategoriaInmueble[] = categoriasDb.map((c) => ({
      id: c.id,
      categoria: c.categoria,
    }));
    return jsonSuccess<CategoriaInmueble[]>(categorias);
  } catch (error: any) {
    console.error("Error al obtener categorías:", error);
    return jsonError(error.message || "Error al obtener categorías", 500);
  }
}

export async function POST(request: NextRequest) {
  const { session, error, status } = await requireAuth(request, "administrador");
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await request.json();
    const { categoria } = body;

    if (!categoria || categoria.trim() === "") {
      return jsonError("El nombre de la categoría es obligatorio", 400);
    }

    const nuevaCategoria = await prisma.categoria_inmueble.create({
      data: { categoria: categoria.trim() },
    });

    return jsonSuccess(nuevaCategoria, 201);
  } catch (error: any) {
    console.error("Error al crear categoría:", error);
    return jsonError(error.message || "Error al crear categoría", 500);
  }
}
