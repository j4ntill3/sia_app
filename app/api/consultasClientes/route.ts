import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth, jsonError, jsonSuccess } from "@/lib/api-helpers";
import type { ConsultaCliente } from "@/types/consulta_cliente";

export async function GET(request: NextRequest) {
  const { session, error, status } = await requireAuth(
    request,
    "administrador"
  );
  if (error) return jsonError(error, status);
  try {
    const consultasDb = await prisma.consulta_cliente.findMany({
      include: {
        inmueble: true,
        empleado: {
          include: {
            personas_empleado: {
              include: {
                persona: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });
    // Mapear a tipo ConsultaCliente
    const consultasClientes: ConsultaCliente[] = consultasDb.map((c) => ({
      id: c.id,
      inmueble_id: c.inmueble_id,
      agente_id: c.agente_id,
      nombre: c.nombre,
      apellido: c.apellido,
      telefono: c.telefono,
      correo: c.correo,
      fecha: c.fecha,
      descripcion: c.descripcion || undefined,
    }));
    return jsonSuccess<ConsultaCliente[]>(consultasClientes);
  } catch (error) {
    console.error("Error al obtener consultas de clientes:", error);
    return jsonError("Error al obtener consultas de clientes", 500);
  }
}
