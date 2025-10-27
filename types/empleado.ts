export interface Empleado {
  id: string;
  cuit: string;
  fecha_ingreso: Date;
  fecha_egreso?: Date;
  tipo_id: string;
  eliminado: boolean;
  tipo?: TipoEmpleado;
  personas_empleado?: PersonaEmpleado[];
}

export type EmpleadoCreate = {
  cuit: string;
  fecha_ingreso: Date;
  fecha_egreso?: Date;
  tipo_id: string;
  eliminado?: boolean;
  persona_id: string;
}

export type EmpleadoUpdate = {
  cuit?: string;
  fecha_ingreso?: Date;
  fecha_egreso?: Date;
  tipo_id?: string;
  eliminado?: boolean;
  persona_id?: string;
}

export interface TipoEmpleado {
  id: string;
  tipo: string;
  empleados?: Empleado[];
}

export interface PersonaEmpleado {
  id: string;
  persona_id: string;
  empleado_id: string;
  creado_en: Date;
  eliminado: boolean;
  persona?: Persona;
  empleado?: Empleado;
}

export interface Persona {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  dni?: number;
  eliminado: boolean;
  creado_en: Date;
}
