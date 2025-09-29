import { Inmueble } from "./inmueble";
export interface RubroInmueble {
  id: string;
  rubro: string;
  inmuebles?: Inmueble[];
}

export interface RubroInmuebleCreate {
  rubro: string;
}

export interface RubroInmuebleUpdate {
  rubro?: string;
}


