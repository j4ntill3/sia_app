import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const setPasswordSchema = z.object({
  token: z.string().min(1, "El token es requerido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número"),
});

/**
 * POST /api/set-password
 * Establece la contraseña del usuario usando un token de verificación
 * Endpoint público (no requiere autenticación)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos
    const parse = setPasswordSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          detalles: parse.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { token, password } = parse.data;

    // Buscar el token de verificación
    const verificationToken = await prisma.verificationtoken.findFirst({
      where: {
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "URL inválido o expirado" },
        { status: 400 }
      );
    }

    // Verificar que no haya expirado
    if (verificationToken.expires < new Date()) {
      // Eliminar token expirado
      await prisma.verificationtoken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token,
          },
        },
      });

      return NextResponse.json(
        { error: "El token ha expirado. Por favor, solicita un nuevo enlace." },
        { status: 400 }
      );
    }

    // Buscar el usuario por email (identifier)
    const persona = await prisma.persona.findFirst({
      where: {
        correo: verificationToken.identifier,
        eliminado: false,
      },
    });

    if (!persona) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const usuario = await prisma.usuario.findFirst({
      where: {
        persona_id: persona.id,
        eliminado: false,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Actualizar la contraseña
    await prisma.usuario.update({
      where: {
        id: usuario.id,
      },
      data: {
        contrasena: hashedPassword,
        correo_verificado: new Date(), // Marcar email como verificado
        actualizado_en: new Date(),
      },
    });

    // Eliminar el token usado
    await prisma.verificationtoken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    });

    return NextResponse.json({
      data: {
        success: true,
        message: "Contraseña establecida exitosamente",
      },
    });
  } catch (error) {
    console.error("Error al establecer contraseña:", error);
    return NextResponse.json(
      { error: "Error al establecer la contraseña" },
      { status: 500 }
    );
  }
}
