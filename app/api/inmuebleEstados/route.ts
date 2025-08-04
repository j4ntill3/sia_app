import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { PropertyStatus } from "@/types/inmueble_estado";

export async function GET(request: NextRequest) {
  try {
    const estadosDb = await prisma.propertyStatus.findMany();
    if (!estadosDb || estadosDb.length === 0) {
      return jsonError("No se encontraron estados", 404);
    }
    // Mapear a tipo PropertyStatus
    const estados: PropertyStatus[] = estadosDb.map((e) => ({
      id: e.id,
      status: e.status,
    }));
    return jsonSuccess<PropertyStatus[]>(estados);
  } catch (error: any) {
    console.error("Error al obtener estados:", error);
    return jsonError(error.message || "Error al obtener estados", 500);
  }
}
