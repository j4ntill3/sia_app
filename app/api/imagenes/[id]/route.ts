import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function PATCH(
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
      return NextResponse.json(
        { error: "ID de imagen inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { es_principal } = body;

    if (typeof es_principal !== "boolean") {
      return NextResponse.json(
        { error: "El campo es_principal debe ser booleano" },
        { status: 400 }
      );
    }

    // Verificar que la imagen existe
    const imagen = await prisma.imagen_inmueble.findUnique({
      where: { id: id },
    });

    if (!imagen) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 }
      );
    }

    // Si se está marcando como principal, desmarcar todas las demás del mismo inmueble
    if (es_principal) {
      await prisma.imagen_inmueble.updateMany({
        where: {
          inmueble_id: imagen.inmueble_id,
          id: { not: id },
        },
        data: {
          es_principal: false,
        },
      });
    }

    // Actualizar la imagen
    const imagenActualizada = await prisma.imagen_inmueble.update({
      where: { id: id },
      data: { es_principal },
    });

    return NextResponse.json({
      message: "Imagen actualizada correctamente",
      data: imagenActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: "ID de imagen inválido" },
        { status: 400 }
      );
    }

    // Verificar que la imagen existe
    const imagen = await prisma.imagen_inmueble.findUnique({
      where: { id: id },
    });

    if (!imagen) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 }
      );
    }

    const esPrincipal = imagen.es_principal;
    const inmuebleId = imagen.inmueble_id;

    // Eliminar la imagen
    await prisma.imagen_inmueble.delete({
      where: { id: id },
    });

    // Verificar si quedan imágenes para este inmueble
    const imagenesRestantes = await prisma.imagen_inmueble.findMany({
      where: { inmueble_id: inmuebleId },
      orderBy: { id: "asc" },
    });

    let imagenPorDefectoCreada = null;

    if (imagenesRestantes.length === 0) {
      // Si no quedan imágenes, crear la imagen por defecto
      imagenPorDefectoCreada = await prisma.imagen_inmueble.create({
        data: {
          inmueble_id: inmuebleId,
          imagen: '/img/no-image.webp',
          es_principal: true,
        },
      });
    } else if (esPrincipal) {
      // Si era la imagen principal y quedan imágenes, marcar la primera como principal
      await prisma.imagen_inmueble.update({
        where: { id: imagenesRestantes[0].id },
        data: { es_principal: true },
      });
    }

    return NextResponse.json({
      message: "Imagen eliminada correctamente",
      data: {
        id: id,
        imagenPorDefecto: imagenPorDefectoCreada ? {
          id: imagenPorDefectoCreada.id,
          inmueble_id: imagenPorDefectoCreada.inmueble_id,
          imagen: imagenPorDefectoCreada.imagen,
          es_principal: imagenPorDefectoCreada.es_principal,
        } : null
      }
    });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
