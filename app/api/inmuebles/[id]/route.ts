import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { inmuebleSchema } from "@/lib/validation";
import type { Inmueble, ImagenInmueble } from "@/types/inmueble";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("[GET /api/inmuebles/[id]] id recibido:", id);
    if (!id) {
      console.log("ID de propiedad inválido");
      return NextResponse.json({ error: "ID de propiedad inválido" }, { status: 400 });
    }
    const inmuebleDb = await prisma.inmueble.findFirst({
      where: {
        id: id,
        eliminado: false,
      },
      include: {
        estado: true,
        categoria: true,
        imagenes: {
          orderBy: { id: "desc" },
        },
      },
    });
    console.log("Resultado inmuebleDb:", inmuebleDb);
    if (!inmuebleDb) {
      console.log("Inmueble no encontrado para id:", id);
      return NextResponse.json({ error: "Inmueble no encontrado" }, { status: 404 });
    }
    // Mapear a tipo Inmueble
    const inmueble: Inmueble = {
      id: inmuebleDb.id,
      titulo: inmuebleDb.titulo,
      categoria_id: inmuebleDb.categoria_id,
      localidad_id: inmuebleDb.localidad_id,
      zona_id: inmuebleDb.zona_id,
      direccion: inmuebleDb.direccion,
      barrio: inmuebleDb.barrio,
      dormitorios: inmuebleDb.dormitorios,
      banos: inmuebleDb.banos,
      superficie: inmuebleDb.superficie,
      cochera: inmuebleDb.cochera,
      eliminado: inmuebleDb.eliminado ?? false,
      estado_id: inmuebleDb.estado_id,
      categoria: inmuebleDb.categoria ? {
        id: inmuebleDb.categoria.id,
        categoria: inmuebleDb.categoria.categoria,
      } : undefined,
      estado: inmuebleDb.estado ? {
        id: inmuebleDb.estado.id,
        estado: inmuebleDb.estado.estado,
      } : undefined,
      imagenes: inmuebleDb.imagenes?.map((img: ImagenInmueble) => ({
        id: img.id,
        inmueble_id: img.inmueble_id,
        imagen: img.imagen || undefined,
      })) || [],
    };
    return NextResponse.json(inmueble);
  } catch (error) {
    console.error("Error al obtener propiedad:", error);
  return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error, status } = await requireAuth(
    request,
    "administrador"
  );
  if (error) return NextResponse.json({ error }, { status });
  try {
    const id = params.id;
    if (!id) {
  return NextResponse.json({ error: "ID de propiedad inválido" }, { status: 400 });
    }
    const body = await request.json();
    // Validar datos con zod (parcial)
  const parse = inmuebleSchema.partial().safeParse({
      ...body,
      titulo: body.titulo,
      categoria_id: body.categoria_id,
      localidad_id: body.localidad_id,
      zona_id: body.zona_id,
      direccion: body.direccion,
      barrio: body.barrio,
      dormitorios: body.dormitorios !== undefined ? Number(body.dormitorios) : undefined,
      banos: body.banos !== undefined ? Number(body.banos) : undefined,
      superficie: body.superficie !== undefined ? Number(body.superficie) : undefined,
      cochera: body.cochera !== undefined ? Boolean(body.cochera) : undefined,
      estado_id: body.estado_id,
      imagen: body.imagen,
    });
    if (!parse.success) {
      return NextResponse.json({ error: "Datos inválidos", detalles: parse.error.issues }, { status: 400 });
    }
    const updateData = parse.data;
    // Validar que la propiedad existe
  const inmuebleExistente = await prisma.inmueble.findFirst({
      where: {
        id: id,
        eliminado: false,
      },
    });
    if (!inmuebleExistente) {
      return NextResponse.json({ error: "Inmueble no encontrado" }, { status: 404 });
    }
    const inmuebleActualizado = await prisma.inmueble.update({
      where: { id: id },
      data: updateData,
      include: {
        estado: true,
        categoria: true,
        imagenes: {
          orderBy: { id: "desc" },
        },
      },
    });
    // Mapear a tipo Inmueble
    const inmueble: Inmueble = {
      id: inmuebleActualizado.id,
      titulo: inmuebleActualizado.titulo,
      categoria_id: inmuebleActualizado.categoria_id,
      localidad_id: inmuebleActualizado.localidad_id,
      zona_id: inmuebleActualizado.zona_id,
      direccion: inmuebleActualizado.direccion,
      barrio: inmuebleActualizado.barrio,
      dormitorios: inmuebleActualizado.dormitorios,
      banos: inmuebleActualizado.banos,
      superficie: inmuebleActualizado.superficie,
      cochera: inmuebleActualizado.cochera,
      eliminado: inmuebleActualizado.eliminado ?? false,
      estado_id: inmuebleActualizado.estado_id,
      categoria: inmuebleActualizado.categoria ? {
        id: inmuebleActualizado.categoria.id,
        categoria: inmuebleActualizado.categoria.categoria,
      } : undefined,
      estado: inmuebleActualizado.estado ? {
        id: inmuebleActualizado.estado.id,
        estado: inmuebleActualizado.estado.estado,
      } : undefined,
      imagenes: inmuebleActualizado.imagenes?.map((img: ImagenInmueble) => ({
        id: img.id,
        inmueble_id: img.inmueble_id,
        imagen: img.imagen || undefined,
      })) || [],
    };
    return NextResponse.json(inmueble);
  } catch (error) {
    console.error("Error al actualizar propiedad:", error);
  return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error, status } = await requireAuth(
    request,
    "administrador"
  );
  if (error) return NextResponse.json({ error }, { status });
  try {
    const id = params.id;
    if (!id) {
  return NextResponse.json({ error: "ID de propiedad inválido" }, { status: 400 });
    }
    await prisma.inmueble.update({
      where: { id: id },
      data: { eliminado: true },
    });
    return NextResponse.json({ message: "Inmueble eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar propiedad:", error);
  return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
