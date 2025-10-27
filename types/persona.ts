export interface PersonaImage {
  id: string;
  persona_id: string;
  imagen: string | null;
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
  empleados?: PersonaEmpleado[];
  usuarios?: Usuario[];
  imagenes?: PersonaImage[];
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
