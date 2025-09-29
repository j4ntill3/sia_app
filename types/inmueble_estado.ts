import { Inmueble } from "./inmueble";

export interface EstadoInmueble {
  id: string;
  estado: string;
  inmuebles?: Inmueble[];
}

export interface EstadoInmuebleCreate {
  estado: string;
}

export interface EstadoInmuebleUpdate {
  estado?: string;
}
