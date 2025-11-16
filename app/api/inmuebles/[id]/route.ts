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
        localidad: true,
        zona: true,
        barrio: true,
        imagenes: {
          orderBy: { id: "desc" },
        },
        agentes: {
          where: {
            eliminado: false,
          },
          include: {
            empleado: {
              include: {
                personas_empleado: {
                  include: {
                    persona: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log("Resultado inmuebleDb:", inmuebleDb);
    if (!inmuebleDb) {
      console.log("Inmueble no encontrado para id:", id);
      return NextResponse.json({ error: "Inmueble no encontrado" }, { status: 404 });
    }
    // Obtener agente asignado
    const agenteAsignado = inmuebleDb.agentes?.[0];
    const persona = agenteAsignado?.empleado?.personas_empleado?.[0]?.persona;

    // Mapear a tipo Inmueble
    const inmueble: Inmueble = {
      id: inmuebleDb.id,
      categoria_id: inmuebleDb.categoria_id,
      localidad_id: inmuebleDb.localidad_id,
      zona_id: inmuebleDb.zona_id,
      barrio_id: inmuebleDb.barrio_id,
      direccion: inmuebleDb.direccion,
      dormitorios: inmuebleDb.dormitorios,
      banos: inmuebleDb.banos,
      superficie: inmuebleDb.superficie,
      cochera: inmuebleDb.cochera,
      eliminado: inmuebleDb.eliminado ?? false,
      estado_id: inmuebleDb.estado_id,
      descripcion: inmuebleDb.descripcion,
      categoria: inmuebleDb.categoria ? {
        id: inmuebleDb.categoria.id,
        categoria: inmuebleDb.categoria.categoria,
      } : undefined,
      estado: inmuebleDb.estado ? {
        id: inmuebleDb.estado.id,
        estado: inmuebleDb.estado.estado,
      } : undefined,
      localidad: inmuebleDb.localidad ? {
        id: inmuebleDb.localidad.id,
        nombre: inmuebleDb.localidad.nombre,
      } : undefined,
      zona: inmuebleDb.zona ? {
        id: inmuebleDb.zona.id,
        nombre: inmuebleDb.zona.nombre,
        localidad_id: inmuebleDb.zona.localidad_id,
      } : undefined,
      barrio: inmuebleDb.barrio ? {
        id: inmuebleDb.barrio.id,
        nombre: inmuebleDb.barrio.nombre,
        localidad_id: inmuebleDb.barrio.localidad_id,
      } : undefined,
      imagenes: inmuebleDb.imagenes?.map((img: any) => ({
        id: img.id,
        inmueble_id: img.inmueble_id,
        imagen: img.imagen || undefined,
        es_principal: img.es_principal || false,
      })) || [],
    };

    // Incluir agente asignado en la respuesta
    const response = {
      ...inmueble,
      agenteAsignado: persona ? {
        id: agenteAsignado.agente_id,
        nombre: persona.nombre,
        apellido: persona.apellido,
      } : undefined,
    };

    return NextResponse.json(response);
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
    // Validar datos con zod (parcial) - titulo es opcional
  const parse = inmuebleSchema.partial().safeParse({
      categoria_id: body.categoria_id,
      localidad_id: body.localidad_id,
      zona_id: body.zona_id,
      barrio_id: body.barrio_id,
      direccion: body.direccion,
      dormitorios: body.dormitorios,
      banos: body.banos,
      superficie: body.superficie,
      cochera: body.cochera !== undefined ? Boolean(body.cochera) : undefined,
      estado_id: body.estado_id,
      descripcion: body.descripcion,
      imagen: body.imagen,
    });
    if (!parse.success) {
      console.error("Error de validación:", parse.error.issues);
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

    // Guardar nuevas imágenes si existen
    if (body.imagenes && Array.isArray(body.imagenes) && body.imagenes.length > 0) {
      // Verificar si existe imagen por defecto y eliminarla antes de agregar imágenes reales
      const imagenPorDefecto = await prisma.imagen_inmueble.findFirst({
        where: {
          inmueble_id: id,
          imagen: '/img/no-image.webp',
        },
      });

      if (imagenPorDefecto) {
        await prisma.imagen_inmueble.delete({
          where: { id: imagenPorDefecto.id },
        });
      }

      // Crear las nuevas imágenes
      await Promise.all(
        body.imagenes.map((imagenBase64: string, index: number) =>
          prisma.imagen_inmueble.create({
            data: {
              inmueble_id: id,
              imagen: imagenBase64,
              es_principal: index === 0, // Primera imagen como principal
            },
          })
        )
      );
    }

    // Volver a cargar el inmueble con las imágenes actualizadas
    const inmuebleConImagenes = await prisma.inmueble.findFirst({
      where: { id: id },
      include: {
        estado: true,
        categoria: true,
        imagenes: {
          orderBy: { id: "desc" },
        },
      },
    });

    if (!inmuebleConImagenes) {
      return NextResponse.json({ error: "Error al cargar inmueble actualizado" }, { status: 500 });
    }

    // Mapear a tipo Inmueble
    const inmueble: Inmueble = {
      id: inmuebleConImagenes.id,
      categoria_id: inmuebleConImagenes.categoria_id,
      localidad_id: inmuebleConImagenes.localidad_id,
      zona_id: inmuebleConImagenes.zona_id,
      barrio_id: inmuebleConImagenes.barrio_id,
      direccion: inmuebleConImagenes.direccion,
      dormitorios: inmuebleConImagenes.dormitorios,
      banos: inmuebleConImagenes.banos,
      superficie: inmuebleConImagenes.superficie,
      cochera: inmuebleConImagenes.cochera,
      eliminado: inmuebleConImagenes.eliminado ?? false,
      estado_id: inmuebleConImagenes.estado_id,
      descripcion: inmuebleConImagenes.descripcion,
      categoria: inmuebleConImagenes.categoria ? {
        id: inmuebleConImagenes.categoria.id,
        categoria: inmuebleConImagenes.categoria.categoria,
      } : undefined,
      estado: inmuebleConImagenes.estado ? {
        id: inmuebleConImagenes.estado.id,
        estado: inmuebleConImagenes.estado.estado,
      } : undefined,
      imagenes: inmuebleConImagenes.imagenes?.map((img: any) => ({
        id: img.id,
        inmueble_id: img.inmueble_id,
        imagen: img.imagen || undefined,
        es_principal: img.es_principal || false,
      })) || [],
    };
    return NextResponse.json({ data: inmueble });
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
