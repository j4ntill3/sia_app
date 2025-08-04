export interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  DNI?: number;
  eliminado: boolean;
  fechaCreacion: Date;
  personaEmpleado?: PersonaEmpleado[];
  usuario?: Usuario[];
  firstName?: string;
  lastName?: string;
}

export interface PersonaCreate {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  DNI?: number;
}

export interface PersonaUpdate {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  DNI?: number;
}

export interface PersonaEmpleado {
  id: number;
  idPersona: number;
  idEmpleado: number;
  fechaCreacion: Date;
  eliminado: boolean;
  persona?: Persona;
  empleado?: Empleado;
}

export interface Empleado {
  id: number;
  CUIT: string;
  fechaAlta: Date;
  fechaBaja?: Date;
  tipoId: number;
  eliminado: boolean;
}

export interface Usuario {
  id: number;
  idRol: number;
  clave: string;
  idPersona: number;
  eliminado: boolean;
  emailVerified?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
