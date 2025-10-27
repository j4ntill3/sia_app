import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const localidades = await prisma.localidad.findMany({
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json({ data: localidades });
  } catch (error) {
    console.error("Error al obtener localidades:", error);
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
    const { nombre } = body;

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre de la localidad es obligatorio" },
        { status: 400 }
      );
    }

    const nuevaLocalidad = await prisma.localidad.create({
      data: { nombre: nombre.trim() },
    });

    return NextResponse.json({ data: nuevaLocalidad }, { status: 201 });
  } catch (error) {
    console.error("Error al crear localidad:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
