export interface ClientInquiry {
  id: number;
  propertyId: number;
  agentId: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  date: Date;
  description?: string;
  property?: Property;
  employee?: Employee;
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
