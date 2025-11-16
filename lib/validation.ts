import { z } from "zod";

/**
 * Esquema de validación para propiedades (inmuebles)
 */
export const inmuebleSchema = z.object({
  categoria_id: z.string().uuid(),
  localidad_id: z.string().uuid(),
  zona_id: z.string().uuid(),
  barrio_id: z.string().uuid(),
  direccion: z.string().min(1),
  dormitorios: z.string()
    .min(1, "El número de dormitorios es requerido")
    .regex(/^\d+$/, "El número de dormitorios debe ser un número entero"),
  banos: z.string()
    .min(1, "El número de baños es requerido")
    .regex(/^\d+$/, "El número de baños debe ser un número entero"),
  superficie: z.string()
    .min(1, "La superficie es requerida")
    .regex(/^\d+(\.\d+)?$/, "La superficie debe ser un número válido (puede incluir decimales)"),
  cochera: z.boolean(),
  estado_id: z.string().uuid(),
  descripcion: z.string().optional(),
  imagen: z.string().optional(),
});
export type InmuebleInput = z.infer<typeof inmuebleSchema>;

/**
 * Esquema de validación para agentes
 * Nota: tipoId no se valida aquí porque siempre se establece como "agente" en el backend
 */
export const agentSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre no puede exceder 100 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres").max(100, "El apellido no puede exceder 100 caracteres"),
  telefono: z.string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .regex(/^[0-9+\-\s()]+$/, "El teléfono solo puede contener números, +, -, espacios y paréntesis"),
  email: z.string().email("Debe ser un email válido").max(100, "El email no puede exceder 100 caracteres"),
  DNI: z.string()
    .regex(/^\d{7,8}$/, "El DNI debe contener 7 u 8 dígitos")
    .min(7, "El DNI debe tener al menos 7 dígitos")
    .max(8, "El DNI no puede exceder 8 dígitos"),
  direccion: z.string().min(5, "La dirección debe tener al menos 5 caracteres").max(200, "La dirección no puede exceder 200 caracteres"),
  cuit: z.string()
    .regex(/^\d{2}-\d{8}-\d{1}$/, "El CUIT debe tener el formato XX-XXXXXXXX-X")
    .length(13, "El CUIT debe tener exactamente 13 caracteres"),
  fechaNacimiento: z.string()
    .min(1, "La fecha de nacimiento es requerida")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 100;
    }, "El agente debe tener entre 18 y 100 años"),
});
export type AgentInput = z.infer<typeof agentSchema>;

/**
 * Esquema de validación para consultas de cliente
 */
export const consultaClienteSchema = z.object({
  id_inmueble: z.string().uuid(),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  telefono: z.string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(20, "El teléfono no puede exceder 20 dígitos")
    .regex(/^\d+$/, "El teléfono solo puede contener números"),
  correo: z.string().email(),
  descripcion: z.string().optional(),
});
export type ConsultaClienteInput = z.infer<typeof consultaClienteSchema>;
