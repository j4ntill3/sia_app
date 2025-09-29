import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/api-helpers";
import { agentSchema } from "@/lib/validation";
import type { persona as Person } from "@prisma/client";

// GET: Listar agentes
export async function GET(request: NextRequest) {
  try {
    const agentes = await prisma.empleado.findMany({
      where: {
        tipo: {
          tipo: "agente"
        },
        eliminado: false,
      },
      include: {
        personas_empleado: {
          include: {
            persona: true,
          },
        },
      },
    });
    const agentesConPersona = agentes.map((empleado: any) => {
      const personaDb: Person | undefined = empleado.personas_empleado[0]?.persona;
      return {
        empleado,
        persona: personaDb || undefined,
      };
    });
    return NextResponse.json({ data: agentesConPersona });
  } catch (error) {
    console.error("Error al obtener agentes:", error);
    return NextResponse.json({ error: "Error al obtener agentes" }, { status: 500 });
  }
}

// POST: Crear agente
export async function POST(request: NextRequest) {
  const { error, status } = await requireAuth(request, "administrador");
  if (error) return NextResponse.json({ error }, { status });
  try {
    const body = await request.json();
    const parse = agentSchema.safeParse({
      ...body,
      tipoId: body.tipoId,
      DNI: Number(body.DNI),
    });
    if (!parse.success || !parse.data) {
      return NextResponse.json({ error: "Datos inválidos", detalles: parse.error ? parse.error.flatten().fieldErrors : {} }, { status: 400 });
    }
    const data = parse.data;
    const tipoEmpleado = await prisma.tipo_empleado.findFirst({ where: { tipo: "agente" } });
    const tipo_id = tipoEmpleado?.id ?? "";
    const rolUsuario = await prisma.rol_usuario.findFirst({ where: { tipo_rol: "agente" } });
    const rol_id = rolUsuario?.id ?? "";
    const person = await prisma.persona.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        correo: data.email,
        dni: data.DNI,
        direccion: data.direccion,
        eliminado: false,
      },
    });
    const employee = await prisma.empleado.create({
      data: {
        cuit: data.cuit,
        fecha_ingreso: new Date(data.fechaAlta + "T00:00:00Z"),
        fecha_egreso: data.fechaBaja ? new Date(data.fechaBaja + "T00:00:00Z") : null,
        tipo_id,
        eliminado: false,
      },
    });
    await prisma.persona_empleado.create({
      data: {
        persona_id: person.id,
        empleado_id: employee.id,
        eliminado: false,
      },
    });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);
    await prisma.usuario.create({
      data: {
        rol_id,
        contrasena: hashedPassword,
        persona_id: person.id,
        eliminado: false,
      },
    });
    return NextResponse.json({
      success: true,
      message: "Agente creado exitosamente",
      empleado: employee,
      persona: person,
    }, { status: 201 });
  } catch (error) {
    console.error("Error al crear agente:", error);
    return NextResponse.json({ error: "Error al crear agente" }, { status: 500 });
  }
}
