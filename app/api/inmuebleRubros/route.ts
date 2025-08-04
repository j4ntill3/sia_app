import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { PropertyCategory } from "@/types/inmueble_rubro";

export async function GET(request: NextRequest) {
  try {
    const rubrosDb = await prisma.propertyCategory.findMany();
    if (!rubrosDb || rubrosDb.length === 0) {
      return jsonError("No se encontraron rubros", 404);
    }
    // Mapear a tipo PropertyCategory
    const rubros: PropertyCategory[] = rubrosDb.map((r) => ({
      id: r.id,
      category: r.category,
    }));
    return jsonSuccess<PropertyCategory[]>(rubros);
  } catch (error: any) {
    console.error("Error al obtener rubros:", error);
    return jsonError(error.message || "Error al obtener rubros", 500);
  }
}
