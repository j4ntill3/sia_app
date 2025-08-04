export interface User {
  id: number;
  roleId: number;
  password: string;
  personId: number;
  deleted: boolean;
  emailVerified?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  person?: Person;
  userRole?: UserRole;
}

export interface UserCreate {
  roleId: number;
  password: string;
  personId: number;
  deleted?: boolean;
}

export interface UserUpdate {
  roleId?: number;
  password?: string;
  personId?: number;
  deleted?: boolean;
}

export interface UserRole {
  id: number;
  roleType: string;
  deleted: boolean;
  user?: User[];
}

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dni?: number;
  deleted: boolean;
  createdAt: Date;
  user?: User[];
}
