export interface Usuario {
  id: string;
  rol_id: string;
  contrasena: string;
  persona_id: string;
  eliminado: boolean;
  verificado_en?: Date;
  creado_en?: Date;
  actualizado_en?: Date;
  persona?: Persona;
  rol?: RolUsuario;
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
