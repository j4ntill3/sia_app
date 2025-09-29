import type { Empleado } from "./empleado";
import type { Persona } from "./persona";

export interface Agente {
  id: string;
  cuit: string;
  fecha_ingreso: Date;
  fecha_egreso?: Date;
  tipo_id: string;
  eliminado: boolean;
  persona: Persona;
}
