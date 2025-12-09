import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult; // Error de autenticación
    }

    const { session } = authResult;
    const userRole = session.user.role;
    const empleadoId = session.user.empleadoId;

    if (userRole === "administrador") {
      // Métricas para administradores - vista global
      const [
        totalInmuebles,
        inmueblesActivos,
        totalAgentes,
        totalConsultas,
        consultasRecientes,
      ] = await Promise.all([
        // Total de inmuebles no eliminados
        prisma.inmueble.count({
          where: { eliminado: false },
        }),
        // Inmuebles activos (disponibles)
        prisma.inmueble.count({
          where: {
            eliminado: false,
            estado: {
              estado: "Disponible",
            },
          },
        }),
        // Total de agentes activos
        prisma.empleado.count({
          where: {
            eliminado: false,
            tipo: {
              tipo: "agente",
            },
          },
        }),
        // Total de consultas
        prisma.consulta_cliente.count(),
        // Últimas 5 consultas
        prisma.consulta_cliente.findMany({
          take: 5,
          orderBy: { fecha: "desc" },
          select: {
            id: true,
            nombre: true,
            apellido: true,
            fecha: true,
            inmueble: {
              select: {
                direccion: true,
                descripcion: true,
                categoria: {
                  select: {
                    id: true,
                    categoria: true,
                  },
                },
              },
            },
          },
        }),
      ]);

      // Transformar consultas para usar nombres consistentes con el frontend
      const consultasFormateadas = consultasRecientes.map((c) => ({
        id: c.id,
        nombre_cliente: c.nombre,
        apellido_cliente: c.apellido,
        fecha: c.fecha,
        inmueble: {
          titulo: c.inmueble.direccion,
          categoria: c.inmueble.categoria,
        },
      }));

      return NextResponse.json({
        data: {
          totalInmuebles,
          inmueblesActivos,
          totalAgentes,
          totalConsultas,
          consultasRecientes: consultasFormateadas,
        },
      });
    } else if (userRole === "agente") {
      // Métricas para agentes - vista personal
      if (!empleadoId) {
        return NextResponse.json(
          { error: "No se encontró el ID de empleado" },
          { status: 400 }
        );
      }

      const [
        misInmuebles,
        misInmueblesActivos,
        misConsultas,
        misConsultasRecientes,
      ] = await Promise.all([
        // Mis inmuebles totales
        prisma.agente_inmueble.count({
          where: {
            agente_id: empleadoId,
            eliminado: false,
            inmueble: {
              eliminado: false,
            },
          },
        }),
        // Mis inmuebles activos
        prisma.agente_inmueble.count({
          where: {
            agente_id: empleadoId,
            eliminado: false,
            inmueble: {
              eliminado: false,
              estado: {
                estado: "Disponible",
              },
            },
          },
        }),
        // Mis consultas totales
        prisma.consulta_cliente.count({
          where: {
            inmueble: {
              agentes: {
                some: {
                  agente_id: empleadoId,
                  eliminado: false,
                },
              },
            },
          },
        }),
        // Mis últimas 5 consultas
        prisma.consulta_cliente.findMany({
          where: {
            inmueble: {
              agentes: {
                some: {
                  agente_id: empleadoId,
                  eliminado: false,
                },
              },
            },
          },
          take: 5,
          orderBy: { fecha: "desc" },
          select: {
            id: true,
            nombre: true,
            apellido: true,
            fecha: true,
            inmueble: {
              select: {
                direccion: true,
                descripcion: true,
                categoria: {
                  select: {
                    id: true,
                    categoria: true,
                  },
                },
              },
            },
          },
        }),
      ]);

      // Transformar consultas para usar nombres consistentes con el frontend
      const misConsultasFormateadas = misConsultasRecientes.map((c) => ({
        id: c.id,
        nombre_cliente: c.nombre,
        apellido_cliente: c.apellido,
        fecha: c.fecha,
        inmueble: {
          titulo: c.inmueble.direccion,
          categoria: c.inmueble.categoria,
        },
      }));

      return NextResponse.json({
        data: {
          misInmuebles,
          misInmueblesActivos,
          misConsultas,
          misConsultasRecientes: misConsultasFormateadas,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Rol no autorizado" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error al obtener métricas:", error);
    return NextResponse.json(
      { error: "Error al obtener métricas" },
      { status: 500 }
    );
  }
}
