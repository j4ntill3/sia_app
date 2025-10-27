import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { jsonError, jsonSuccess, requireAuth } from "@/lib/api-helpers";
import type { EstadoInmueble } from "@/types/inmueble";

export async function GET(request: NextRequest) {
  try {
    const estadosDb = await prisma.estado_inmueble.findMany({
      orderBy: { estado: "asc" },
    });
    const estados: EstadoInmueble[] = estadosDb.map((e) => ({
      id: e.id,
      estado: e.estado,
    }));
    return jsonSuccess<EstadoInmueble[]>(estados);
  } catch (error: any) {
    console.error("Error al obtener estados:", error);
    return jsonError(error.message || "Error al obtener estados", 500);
  }
}

export async function POST(request: NextRequest) {
  const { session, error, status } = await requireAuth(request, "administrador");
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await request.json();
    const { estado } = body;

    if (!estado || estado.trim() === "") {
      return jsonError("El nombre del estado es obligatorio", 400);
    }

    const nuevoEstado = await prisma.estado_inmueble.create({
      data: { estado: estado.trim() },
    });

    return jsonSuccess(nuevoEstado, 201);
  } catch (error: any) {
    console.error("Error al crear estado:", error);
    return jsonError(error.message || "Error al crear estado", 500);
  }
}
