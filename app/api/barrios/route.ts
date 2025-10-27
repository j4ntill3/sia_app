import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const localidadId = searchParams.get("localidad_id");

    const barrios = await prisma.barrio.findMany({
      where: localidadId ? { localidad_id: localidadId } : undefined,
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json({ data: barrios });
  } catch (error) {
    console.error("Error al obtener barrios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { session, error, status } = await requireAuth(request, "administrador");
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await request.json();
    const { nombre, localidad_id } = body;

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre del barrio es obligatorio" },
        { status: 400 }
      );
    }

    if (!localidad_id) {
      return NextResponse.json(
        { error: "La localidad es obligatoria" },
        { status: 400 }
      );
    }

    const nuevoBarrio = await prisma.barrio.create({
      data: {
        nombre: nombre.trim(),
        localidad_id,
      },
    });

    return NextResponse.json({ data: nuevoBarrio }, { status: 201 });
  } catch (error) {
    console.error("Error al crear barrio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
