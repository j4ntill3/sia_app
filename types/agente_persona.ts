import type { Empleado } from "./empleado";
import type { Persona } from "./persona";

export interface AgentePersona {
  agente: Empleado;
  persona: Persona;
}
