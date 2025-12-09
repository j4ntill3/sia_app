import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/api-helpers";
import { agentSchema } from "@/lib/validation";
import { sendSetPasswordEmail } from "@/lib/email";
import crypto from "crypto";
import type { persona as Person } from "@prisma/client";

// GET: Listar administradores
export async function GET(request: NextRequest) {
  console.log("=".repeat(50));
  console.log("GET /api/administradores - LISTANDO TODOS LOS ADMINISTRADORES");
  console.log("=".repeat(50));

  try {
    const administradores = await prisma.empleado.findMany({
      where: {
        tipo: {
          tipo: "administrador"
        },
        eliminado: false, // Solo mostrar administradores no eliminados (soft delete)
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
    const administradoresConPersona = administradores.map((empleado: any) => {
      const personaDb: Person | undefined = empleado.personas_empleado[0]?.persona;
      return {
        empleado,
        persona: personaDb || undefined,
      };
    });

    console.log("Total administradores encontrados:", administradoresConPersona.length);
    administradoresConPersona.forEach(a => {
      console.log(`Administrador ${a.empleado.id}: eliminado=${a.empleado.eliminado}, fecha_egreso=${a.empleado.fecha_egreso}`);
    });

    return NextResponse.json({ data: administradoresConPersona });
  } catch (error) {
    console.error("Error al obtener administradores:", error);
    return NextResponse.json({ error: "Error al obtener administradores" }, { status: 500 });
  }
}

// POST: Crear administrador
export async function POST(request: NextRequest) {
  const { error, status } = await requireAuth(request, "administrador");
  if (error) return NextResponse.json({ error }, { status });
  try {
    const body = await request.json();
    // No incluimos tipoId en la validación porque siempre será "administrador"
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
    const tipoEmpleado = await prisma.tipo_empleado.findFirst({ where: { tipo: "administrador" } });
    const tipo_id = tipoEmpleado?.id ?? "";
    const rolUsuario = await prisma.rol_usuario.findFirst({ where: { tipo_rol: "administrador" } });
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

    // Crear usuario con contraseña temporal vacía (se establecerá mediante email)
    // Usar un hash de placeholder que nunca podrá ser usado para login
    const placeholderHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);

    await prisma.usuario.create({
      data: {
        rol_id,
        contrasena: placeholderHash,
        persona_id: person.id,
        eliminado: false,
      },
    });

    // Generar token único para establecer contraseña
    const token = crypto.randomBytes(32).toString('hex');

    // Calcular fecha de expiración (24 horas desde ahora)
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    // Eliminar tokens anteriores para este email (por si acaso)
    await prisma.verificationtoken.deleteMany({
      where: {
        identifier: person.correo,
      },
    });

    // Crear nuevo token
    await prisma.verificationtoken.create({
      data: {
        identifier: person.correo,
        token,
        expires,
      },
    });

    // Enviar email con link para establecer contraseña
    const emailSent = await sendSetPasswordEmail(
      person.correo,
      person.nombre,
      token
    );

    if (!emailSent) {
      console.error("Error al enviar email al administrador:", person.correo);
      // Aún así devolvemos éxito porque el administrador fue creado
      // El admin podrá reenviar el email más tarde
    }

    return NextResponse.json({
      data: {
        success: true,
        message: "Administrador creado exitosamente",
        personaId: person.id,
        empleadoId: employee.id,
        empleado: employee,
        persona: person,
        emailSent: emailSent,
        email: person.correo,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error al crear administrador:", error);
    return NextResponse.json({ error: "Error al crear administrador" }, { status: 500 });
  }
}
