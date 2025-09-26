export interface RolUsuario {
  id: string;
  tipo: string;
  eliminado: boolean;
  usuarios?: Usuario[];
}
