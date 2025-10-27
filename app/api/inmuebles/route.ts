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
        include: {
          imagenes: { orderBy: { id: "desc" } },
          categoria: true,
          estado: true,
          localidad: true,
          zona: true,
          barrio: true,
        },
        skip,
        take: pageSize,
        orderBy: { id: "asc" },
      }),
    ]);

    const inmueblesConImagen: Inmueble[] = inmuebles.map((inmueble: any) => ({
      id: inmueble.id,
      categoria_id: inmueble.categoria_id,
      localidad_id: inmueble.localidad_id,
      zona_id: inmueble.zona_id,
      barrio_id: inmueble.barrio_id,
      direccion: inmueble.direccion,
      dormitorios: inmueble.dormitorios,
      banos: inmueble.banos,
      superficie: inmueble.superficie,
      cochera: inmueble.cochera,
      eliminado: inmueble.eliminado,
      estado_id: inmueble.estado_id,
      descripcion: inmueble.descripcion || undefined,
      categoria: inmueble.categoria ? {
        id: inmueble.categoria.id,
        categoria: inmueble.categoria.categoria
      } : undefined,
      estado: inmueble.estado ? {
        id: inmueble.estado.id,
        estado: inmueble.estado.estado
      } : undefined,
      localidad: inmueble.localidad ? {
        id: inmueble.localidad.id,
        nombre: inmueble.localidad.nombre
      } : undefined,
      zona: inmueble.zona ? {
        id: inmueble.zona.id,
        nombre: inmueble.zona.nombre,
        localidad_id: inmueble.zona.localidad_id
      } : undefined,
      barrio: inmueble.barrio ? {
        id: inmueble.barrio.id,
        nombre: inmueble.barrio.nombre,
        localidad_id: inmueble.barrio.localidad_id
      } : undefined,
      imagenes: inmueble.imagenes?.map((img: any) => ({
        id: img.id,
        inmueble_id: img.inmueble_id,
        imagen: img.imagen || undefined,
        es_principal: img.es_principal || false,
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
    const data = {
      categoria_id: body.categoria_id,
      localidad_id: body.localidad_id,
      zona_id: body.zona_id,
      barrio_id: body.barrio_id,
      direccion: body.direccion,
      dormitorios: body.dormitorios,
      banos: body.banos,
      superficie: body.superficie,
      cochera: Boolean(body.cochera),
      estado_id: body.estado_id,
      descripcion: body.descripcion || null,
      eliminado: false,
      imagenes: body.imagenes as string[] | undefined,
    };

    // Crear el inmueble
    const nuevoInmueble = await prisma.inmueble.create({
      data: {
        categoria_id: data.categoria_id,
        localidad_id: data.localidad_id,
        zona_id: data.zona_id,
        barrio_id: data.barrio_id,
        direccion: data.direccion,
        dormitorios: data.dormitorios,
        banos: data.banos,
        superficie: data.superficie,
        cochera: data.cochera,
        estado_id: data.estado_id,
        descripcion: data.descripcion,
        eliminado: false,
      },
    });

    let imagenes: ImagenInmueble[] = [];
    // Si se proporcionan imágenes, crear los registros de imagen
    if (data.imagenes && data.imagenes.length > 0) {
      const fs = await import("fs");
      const path = await import("path");

      const uploadDir = path.join(process.cwd(), "public", "img");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      for (let i = 0; i < data.imagenes.length; i++) {
        const imageBase64 = data.imagenes[i];
        // Extraer extensión y datos de la imagen base64
        const matches = imageBase64.match(/^data:image\/(\w+);base64,(.+)$/);
        if (matches) {
          const extension = matches[1];
          const imageData = matches[2];
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
          const filePath = path.join(uploadDir, fileName);

          // Guardar imagen en el sistema de archivos
          fs.writeFileSync(filePath, Buffer.from(imageData, "base64"));

          // Crear registro en la base de datos - la primera imagen se marca como principal
          const img = await prisma.imagen_inmueble.create({
            data: {
              inmueble_id: nuevoInmueble.id,
              imagen: `/img/${fileName}`,
              es_principal: i === 0, // Primera imagen como principal
            },
          });

          imagenes.push({
            id: img.id,
            inmueble_id: img.inmueble_id,
            imagen: img.imagen || undefined,
            es_principal: img.es_principal,
          });
        }
      }
    }

    // Mapear a tipo Inmueble
    const inmuebleResult: Inmueble = {
      ...nuevoInmueble,
      imagenes,
    };

    return NextResponse.json({ data: inmuebleResult }, { status: 201 });
  } catch (error) {
    console.error("Error al crear inmueble:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
