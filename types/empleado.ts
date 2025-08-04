export interface Employee {
  id: string;
  cuit: string;
  hireDate: Date;
  terminationDate?: Date;
  typeId: string;
  deleted: boolean;
  employeeType?: EmployeeType;
  personEmployee?: PersonEmployee[];
}

export interface EmployeeCreate {
  cuit: string;
  hireDate: Date;
  terminationDate?: Date;
  typeId: string;
  deleted?: boolean;
  personId: string;
}

export interface EmployeeUpdate {
  cuit?: string;
  hireDate?: Date;
  terminationDate?: Date;
  typeId?: string;
  deleted?: boolean;
  personId?: string;
}

export interface EmployeeType {
  id: string;
  type: string;
  employee?: Employee[];
}

export interface PersonEmployee {
  id: string;
  personId: string;
  employeeId: string;
  createdAt: Date;
  deleted: boolean;
  person?: Person;
  employee?: Employee;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dni?: number;
  deleted: boolean;
  createdAt: Date;
}
