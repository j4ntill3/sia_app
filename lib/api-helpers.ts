import { getSession } from "@/actions/auth-actions";
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, ApiError } from "@/lib/response-types";

/**
 * Middleware para requerir autenticación y rol opcional.
 * @param request NextRequest
 * @param requiredRole Rol requerido (opcional)
 * @returns { session } o { error, status }
 */
export async function requireAuth(
  request: NextRequest,
  requiredRole?: string
): Promise<{ session?: any; error?: string; status?: number }> {
  const session = await getSession();
  if (!session) {
    return { error: "No autenticado", status: 401 };
  }
  if (requiredRole && session.user.role !== requiredRole) {
    return { error: "No autorizado", status: 403 };
  }
  return { session };
}

/**
 * Respuesta de error unificada para API
 */
export function jsonError(
  message: string,
  status: number = 400
): NextResponse<ApiError> {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Respuesta de éxito unificada para API
 */
export function jsonSuccess<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data }, { status });
}
