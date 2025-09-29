import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { EstadoPropiedad } from "@/types/inmueble";

export async function GET(request: NextRequest) {
  try {
    const estadosDb = await prisma.estado_propiedad.findMany();
    if (!estadosDb || estadosDb.length === 0) {
      return jsonError("No se encontraron estados de propiedad", 404);
    }
    // Mapear a tipo EstadoPropiedad
    const estados: EstadoPropiedad[] = estadosDb.map((e) => ({
      id: e.id,
      estado: e.estado,
    }));
    return jsonSuccess<EstadoPropiedad[]>(estados);
  } catch (error: any) {
    console.error("Error al obtener estados:", error);
    return jsonError(error.message || "Error al obtener estados", 500);
  }
}
