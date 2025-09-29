import { Inmueble } from "./inmueble";
import { Empleado } from "./empleado";
export interface ConsultaCliente {
  id: string;
  inmueble_id: string;
  agente_id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  fecha: Date;
  descripcion?: string;
  inmueble?: Inmueble;
  empleado?: Empleado;
}


export interface ConsultaClienteCreate {
  inmueble_id: string;
  agente_id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  fecha: Date;
  descripcion?: string;
}

export interface ConsultaClienteUpdate {
  inmueble_id?: string;
  agente_id?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  correo?: string;
  fecha?: Date;
  descripcion?: string;
}

export interface Property {
  id: number;
  title: string;
  categoryId: number;
  locality: string;
  address: string;
  neighborhood: string;
  numBedrooms: number;
  numBathrooms: number;
  surface: number;
  garage: boolean;
  deleted?: boolean;
  statusId: number;
}

export interface Employee {
  id: number;
  cuit: string;
  hireDate: Date;
  terminationDate?: Date;
  typeId: number;
  deleted: boolean;
}
