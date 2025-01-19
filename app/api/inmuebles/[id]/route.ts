import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import type Inmueble from "@/types/inmueble"; // Asegúrate de que la ruta sea correcta

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Buscar el inmueble por ID e incluir el estado relacionado
    const inmuebleData = await prisma.inmueble.findUnique({
      where: { id: Number(id) },
      include: {
        inmueble_estado: true, // Incluyendo la relación con el estado
      },
    });

    if (!inmuebleData) {
      return NextResponse.json(
        { error: "Inmueble no encontrado" },
        { status: 404 }
      );
    }

    // Mapear los datos obtenidos al tipo Inmueble
    const inmueble: Inmueble = {
      id: inmuebleData.id,
      title: inmuebleData.title,
      idRubro: inmuebleData.id_rubro,
      localidad: inmuebleData.localidad,
      direccion: inmuebleData.direccion,
      barrio: inmuebleData.barrio,
      numHabitaciones: inmuebleData.num_habitaciones,
      numBaños: inmuebleData.num_ba_os,
      superficie: inmuebleData.superficie,
      garaje: inmuebleData.garaje,
      id_estado: inmuebleData.id_estado!, // Como siempre existe, el operador ! es seguro
      eliminado: inmuebleData.eliminado,
    };

    return NextResponse.json(inmueble);
  } catch (error) {
    console.error("Error al obtener el inmueble:", error);
    return NextResponse.json(
      { error: "Error al obtener el inmueble" },
      { status: 500 }
    );
  }
}
