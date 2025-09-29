import { Inmueble } from "./inmueble";

export interface ImagenInmueble {
  id: string;
  inmueble_id: string;
  imagen?: string;
  inmueble?: Inmueble;
}

export interface ImagenInmuebleCreate {
  inmueble_id: string;
  imagen?: string;
}

export interface ImagenInmuebleUpdate {
  inmueble_id?: string;
  imagen?: string;
}
