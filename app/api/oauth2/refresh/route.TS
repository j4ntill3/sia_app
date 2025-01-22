import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.code && body.redirect_uri) {
      // Manejo del código de autorización
      const { code, redirect_uri } = body;

      const authorizationCode =
        await prisma.oauth_authorization_codes.findUnique({
          where: { authorization_code: code },
        });

      if (!authorizationCode || authorizationCode.expires_at < new Date()) {
        return new Response(
          JSON.stringify({
            error: "Código de autorización inválido o expirado",
          }),
          { status: 400 }
        );
      }

      if (authorizationCode.redirect_uri !== redirect_uri) {
        return new Response(
          JSON.stringify({ error: "URI de redirección incorrecto" }),
          { status: 400 }
        );
      }

      // Generar tokens
      const accessToken = jwt.sign(
        { user_id: authorizationCode.user_id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { user_id: authorizationCode.user_id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      // Guardar tokens en la base de datos
      await prisma.oauth_access_tokens.create({
        data: {
          access_token: accessToken,
          user_id: authorizationCode.user_id,
          expires_at: new Date(Date.now() + 3600000),
        },
      });

      await prisma.oauth_refresh_tokens.create({
        data: {
          refresh_token: refreshToken,
          user_id: authorizationCode.user_id,
          expires_at: new Date(Date.now() + 604800000),
        },
      });

      await prisma.oauth_authorization_codes.delete({
        where: { authorization_code: code },
      });

      return new Response(
        JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
        }),
        { status: 200 }
      );
    } else if (body.refresh_token) {
      // Manejo del refresh token
      const { refresh_token } = body;

      const refreshToken = await prisma.oauth_refresh_tokens.findUnique({
        where: { refresh_token },
      });

      if (!refreshToken || refreshToken.expires_at < new Date()) {
        return new Response(
          JSON.stringify({ error: "Refresh token inválido o expirado" }),
          { status: 400 }
        );
      }

      const newAccessToken = jwt.sign(
        { user_id: refreshToken.user_id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      const accessToken = await prisma.oauth_access_tokens.findFirst({
        where: { user_id: refreshToken.user_id },
      });

      if (!accessToken) {
        return new Response(
          JSON.stringify({ error: "Access token no encontrado" }),
          { status: 400 }
        );
      }

      await prisma.oauth_access_tokens.update({
        where: { id: accessToken.id },
        data: {
          access_token: newAccessToken,
          expires_at: new Date(Date.now() + 3600000),
        },
      });

      return new Response(JSON.stringify({ access_token: newAccessToken }), {
        status: 200,
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Parámetros inválidos en la solicitud" }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
