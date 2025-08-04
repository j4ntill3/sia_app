import { z } from "zod";

/**
 * Esquema de validación para propiedades (inmuebles)
 */
export const propertySchema = z.object({
  title: z.string().min(1),
  categoryId: z.string().uuid(),
  locality: z.string().min(1),
  address: z.string().min(1),
  neighborhood: z.string().min(1),
  numBedrooms: z.number().int(),
  numBathrooms: z.number().int(),
  surface: z.number(),
  garage: z.boolean(),
  statusId: z.string().uuid(),
  imagePath: z.string().optional(),
});
export type PropertyInput = z.infer<typeof propertySchema>;

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
