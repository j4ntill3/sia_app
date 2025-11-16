import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/api-helpers";
import { agentSchema } from "@/lib/validation";
import { generateRandomPassword } from "@/lib/password";
import type { persona as Person } from "@prisma/client";

// GET: Listar agentes
export async function GET(request: NextRequest) {
  console.log("=".repeat(50));
  console.log("GET /api/agentes - LISTANDO TODOS LOS AGENTES");
  console.log("=".repeat(50));

  try {
    const agentes = await prisma.empleado.findMany({
      where: {
        tipo: {
          tipo: "agente"
        },
        eliminado: false, // Solo mostrar agentes no eliminados (soft delete)
        // NO filtrar por fecha_egreso - mostrar tanto activos como inactivos
      },
      include: {
        personas_empleado: {
          include: {
            persona: {
              include: {
                imagenes: true,
              },
            },
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

    console.log("Total agentes encontrados:", agentesConPersona.length);
    agentesConPersona.forEach(a => {
      console.log(`Agente ${a.empleado.id}: eliminado=${a.empleado.eliminado}, fecha_egreso=${a.empleado.fecha_egreso}`);
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
    // No incluimos tipoId en la validación porque siempre será "agente"
    const parse = agentSchema.safeParse({
      nombre: body.nombre,
      apellido: body.apellido,
      telefono: body.telefono,
      email: body.email,
      DNI: String(body.DNI),
      direccion: body.direccion,
      cuit: body.cuit,
      fechaNacimiento: body.fechaNacimiento,
    });
    if (!parse.success || !parse.data) {
      return NextResponse.json({ error: "Datos inválidos", detalles: parse.error ? parse.error.flatten().fieldErrors : {} }, { status: 400 });
    }
    const data = parse.data;

    // Verificar DNI duplicado
    const existingDNI = await prisma.persona.findFirst({
      where: {
        dni: Number(data.DNI),
        eliminado: false,
      },
    });
    if (existingDNI) {
      return NextResponse.json({ error: "Ya existe una persona con este DNI" }, { status: 409 });
    }

    // Verificar email duplicado
    const existingEmail = await prisma.persona.findFirst({
      where: {
        correo: data.email,
        eliminado: false,
      },
    });
    if (existingEmail) {
      return NextResponse.json({ error: "Ya existe una persona con este email" }, { status: 409 });
    }

    // Verificar CUIT duplicado
    const existingCUIT = await prisma.empleado.findFirst({
      where: {
        cuit: data.cuit,
        eliminado: false,
      },
    });
    if (existingCUIT) {
      return NextResponse.json({ error: "Ya existe un empleado con este CUIT" }, { status: 409 });
    }
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
        dni: Number(data.DNI),
        direccion: data.direccion,
        fecha_nacimiento: new Date(data.fechaNacimiento + "T00:00:00Z"),
        eliminado: false,
      },
    });
    const employee = await prisma.empleado.create({
      data: {
        cuit: data.cuit,
        fecha_ingreso: new Date(), // Fecha actual como fecha de ingreso
        fecha_egreso: null,
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

    // Generar contraseña aleatoria temporal
    const temporaryPassword = generateRandomPassword(12);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(temporaryPassword, salt);

    await prisma.usuario.create({
      data: {
        rol_id,
        contrasena: hashedPassword,
        persona_id: person.id,
        eliminado: false,
      },
    });

    return NextResponse.json({
      data: {
        success: true,
        message: "Agente creado exitosamente",
        personaId: person.id,
        empleadoId: employee.id,
        empleado: employee,
        persona: person,
        // IMPORTANTE: La contraseña temporal debe ser comunicada al agente de forma segura
        temporaryPassword: temporaryPassword,
        warningMessage: "Por favor, comunique esta contraseña al agente de forma segura. El agente deberá cambiarla en su primer inicio de sesión."
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error al crear agente:", error);
    return NextResponse.json({ error: "Error al crear agente" }, { status: 500 });
  }
}
