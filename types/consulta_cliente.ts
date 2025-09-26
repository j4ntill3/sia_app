export interface ConsultaCliente {
  id: string;
  propiedad_id: string;
  agente_id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  fecha: Date;
  descripcion?: string;
  propiedad?: Propiedad;
  empleado?: Empleado;
}

export interface ClientInquiryCreate {
  propertyId: number;
  agentId: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  date: Date;
  description?: string;
}

export interface ClientInquiryUpdate {
  propertyId?: number;
  agentId?: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  date?: Date;
  description?: string;
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
