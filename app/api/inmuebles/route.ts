import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import type { Inmueble, ImagenInmueble } from "@/types/inmueble";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);
    const skip = (page - 1) * pageSize;

    const [total, inmuebles] = await Promise.all([
      prisma.inmueble.count({ where: { eliminado: false } }),
      prisma.inmueble.findMany({
        where: { eliminado: false },
        include: { imagenes: { orderBy: { id: "desc" } } },
        skip,
        take: pageSize,
        orderBy: { id: "asc" },
      }),
    ]);

    const inmueblesConImagen: Inmueble[] = inmuebles.map((inmueble: Inmueble) => ({
      ...inmueble,
      imagenes: inmueble.imagenes?.map((img: ImagenInmueble) => ({
        ...img,
        imagen: img.imagen || undefined,
      })) || [],
    }));

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      data: inmueblesConImagen,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Error al obtener inmuebles:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Solo administradores pueden crear inmuebles
  const { error, status } = await requireAuth(
    request,
    "administrador"
  );
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await request.json();
    // Usar directamente el body recibido
    const data: Omit<Inmueble, 'id' | 'imagenes'> & { imagen?: string } = {
      titulo: body.titulo,
      categoria_id: body.categoria_id,
      localidad_id: body.localidad_id,
      zona_id: body.zona_id,
      direccion: body.direccion,
      barrio: body.barrio,
      dormitorios: Number(body.dormitorios),
      banos: Number(body.banos),
      superficie: Number(body.superficie),
      cochera: Boolean(body.cochera),
      estado_id: body.estado_id,
      eliminado: false,
      imagen: body.imagen,
    };

    // Crear el inmueble
    const nuevoInmueble = await prisma.inmueble.create({
      data: {
        titulo: data.titulo,
        categoria_id: data.categoria_id,
        localidad_id: data.localidad_id,
        zona_id: data.zona_id,
        direccion: data.direccion,
        barrio: data.barrio,
        dormitorios: data.dormitorios,
        banos: data.banos,
        superficie: data.superficie,
        cochera: data.cochera,
        estado_id: data.estado_id,
        eliminado: false,
      },
    });

    let imagenes: ImagenInmueble[] = [];
    // Si se proporciona una imagen, crear el registro de imagen
    if (data.imagen) {
      const img = await prisma.imagen_inmueble.create({
        data: {
          inmueble_id: nuevoInmueble.id,
          imagen: data.imagen,
        },
      });
      imagenes = [
        {
          id: img.id,
          inmueble_id: img.inmueble_id,
          imagen: img.imagen || undefined,
        },
      ];
    }

    // Mapear a tipo Inmueble
    const inmuebleResult: Inmueble = {
      ...nuevoInmueble,
      imagenes,
    };

    return NextResponse.json(inmuebleResult, { status: 201 });
  } catch (error) {
    console.error("Error al crear inmueble:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
