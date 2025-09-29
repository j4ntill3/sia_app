
export interface EstadoInmueble {
  id: string;
  estado: string;
  inmuebles?: Inmueble[];
}

export interface CategoriaInmueble {
  id: string;
  categoria: string;
  inmuebles?: Inmueble[];
}

export interface Inmueble {
  id: string;
  titulo: string;
  categoria_id: string;
  localidad_id: string;
  zona_id: string;
  direccion: string;
  barrio: string;
  dormitorios: number;
  banos: number;
  superficie: number;
  cochera: boolean;
  eliminado?: boolean;
  estado_id: string;
  categoria?: CategoriaInmueble;
  estado?: EstadoInmueble;
  imagenes?: ImagenInmueble[];
}

export interface InmuebleCreate {
  titulo: string;
  categoria_id: string;
  localidad_id: string;
  zona_id: string;
  direccion: string;
  barrio: string;
  dormitorios: number;
  banos: number;
  superficie: number;
  cochera: boolean;
  estado_id: string;
  eliminado?: boolean;
}

export interface InmuebleUpdate {
  titulo?: string;
  categoria_id?: string;
  localidad_id?: string;
  zona_id?: string;
  direccion?: string;
  barrio?: string;
  dormitorios?: number;
  banos?: number;
  superficie?: number;
  cochera?: boolean;
  estado_id?: string;
  eliminado?: boolean;
}

export interface ImagenInmueble {
  id: string;
  inmueble_id: string;
  imagen?: string;
  inmueble?: Inmueble;
}
