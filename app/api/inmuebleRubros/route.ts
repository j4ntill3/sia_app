import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { CategoriaPropiedad } from "@/types/inmueble";


export async function GET(request: NextRequest) {
  try {
    const categoriasDb = await prisma.categoria_propiedad.findMany();
    if (!categoriasDb || categoriasDb.length === 0) {
      return jsonError("No se encontraron categorías de propiedad", 404);
    }
    // Mapear a tipo CategoriaPropiedad
    const categorias: CategoriaPropiedad[] = categoriasDb.map((c) => ({
      id: c.id,
      categoria: c.categoria,
    }));
    return jsonSuccess<CategoriaPropiedad[]>(categorias);
  } catch (error: any) {
    console.error("Error al obtener categorías de propiedad:", error);
    return jsonError(error.message || "Error al obtener categorías de propiedad", 500);
  }
}
