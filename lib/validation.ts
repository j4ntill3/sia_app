import { z } from "zod";

/**
 * Esquema de validación para propiedades (inmuebles)
 */
export const inmuebleSchema = z.object({
  titulo: z.string().min(1),
  categoria_id: z.string().uuid(),
  localidad_id: z.string().uuid(),
  zona_id: z.string().uuid(),
  direccion: z.string().min(1),
  barrio: z.string().min(1),
  dormitorios: z.number().int(),
  banos: z.number().int(),
  superficie: z.number(),
  cochera: z.boolean(),
  estado_id: z.string().uuid(),
  imagen: z.string().optional(),
});
export type InmuebleInput = z.infer<typeof inmuebleSchema>;

/**
 * Esquema de validación para agentes
 */
export const agentSchema = z.object({
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  telefono: z.string().min(1),
  email: z.string().email(),
  DNI: z.number().int(),
  direccion: z.string().min(1),
  tipoId: z.string().uuid(),
  cuit: z.string().min(1),
  fechaAlta: z.string().min(1),
  fechaBaja: z.string().optional(),
});
export type AgentInput = z.infer<typeof agentSchema>;

/**
 * Esquema de validación para consultas de cliente
 */
export const clientInquirySchema = z.object({
  id_inmueble: z.string().uuid(),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  telefono: z.string().min(1),
  email: z.string().email(),
  descripcion: z.string().optional(),
});
export type ClientInquiryInput = z.infer<typeof clientInquirySchema>;
