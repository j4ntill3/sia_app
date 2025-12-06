import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSetPasswordEmail } from "@/lib/email";
import { requireAuth } from "@/lib/api-helpers";
import crypto from "crypto";

/**
 * POST /api/send-set-password-email
 * Genera un token y envía un email para que el agente establezca su contraseña
 * Solo accesible por administradores
 */
export async function POST(request: NextRequest) {
  // Verificar que el usuario sea administrador
  const { error, status } = await requireAuth(request, "administrador");
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await request.json();
    const { personaId } = body;

    if (!personaId) {
      return NextResponse.json(
        { error: "El ID de persona es requerido" },
        { status: 400 }
      );
    }

    // Buscar la persona
    const persona = await prisma.persona.findUnique({
      where: { id: personaId },
    });

    if (!persona) {
      return NextResponse.json(
        { error: "Persona no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que la persona tenga un usuario asociado
    const usuario = await prisma.usuario.findFirst({
      where: {
        persona_id: personaId,
        eliminado: false,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "No existe un usuario para esta persona" },
        { status: 404 }
      );
    }

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');

    // Calcular fecha de expiración (24 horas desde ahora)
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    // Eliminar tokens anteriores para este email
    await prisma.verificationtoken.deleteMany({
      where: {
        identifier: persona.correo,
      },
    });

    // Crear nuevo token
    await prisma.verificationtoken.create({
      data: {
        identifier: persona.correo,
        token,
        expires,
      },
    });

    // Enviar email
    const emailSent = await sendSetPasswordEmail(
      persona.correo,
      persona.nombre,
      token
    );

    if (!emailSent) {
      return NextResponse.json(
        { error: "Error al enviar el email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        success: true,
        message: "Email enviado exitosamente",
        email: persona.correo,
      },
    });
  } catch (error) {
    console.error("Error al enviar email de establecer contraseña:", error);
    return NextResponse.json(
      { error: "Error al enviar el email" },
      { status: 500 }
    );
  }
}
