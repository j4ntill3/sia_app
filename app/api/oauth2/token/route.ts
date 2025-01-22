import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, redirect_uri } = body;

    // Verificar que el código de autorización sea válido
    const authorizationCode = await prisma.oauth_authorization_codes.findUnique(
      {
        where: { authorization_code: code },
      }
    );

    if (!authorizationCode || authorizationCode.expires_at < new Date()) {
      return new Response(
        JSON.stringify({ error: "Código de autorización inválido o expirado" }),
        { status: 400 }
      );
    }

    // Verificar si el redirect_uri es correcto
    if (authorizationCode.redirect_uri !== redirect_uri) {
      return new Response(
        JSON.stringify({ error: "URI de redirección incorrecto" }),
        { status: 400 }
      );
    }

    // Generar el access_token
    const accessToken = jwt.sign(
      { user_id: authorizationCode.user_id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" } // 1 hora de expiración
    );

    // Generar el refresh_token
    const refreshToken = jwt.sign(
      { user_id: authorizationCode.user_id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" } // 7 días de expiración
    );

    // Guardar el access_token y refresh_token en la base de datos
    await prisma.oauth_access_tokens.create({
      data: {
        access_token: accessToken,
        user_id: authorizationCode.user_id,
        expires_at: new Date(Date.now() + 3600000), // 1 hora
      },
    });

    await prisma.oauth_refresh_tokens.create({
      data: {
        refresh_token: refreshToken,
        user_id: authorizationCode.user_id,
        expires_at: new Date(Date.now() + 604800000), // 7 días
      },
    });

    // Eliminar el código de autorización después de su uso
    await prisma.oauth_authorization_codes.delete({
      where: { authorization_code: code },
    });

    // Retornar el access_token y refresh_token
    return new Response(
      JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
