
export interface Propiedad {
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
  categoria?: CategoriaPropiedad;
  estado?: EstadoPropiedad;
  imagenes?: ImagenPropiedad[];
}

export interface PropiedadCreate {
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

export interface PropiedadUpdate {
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

export interface ImagenPropiedad {
  id: string;
  propiedad_id: string;
  imagen?: string;
  propiedad?: Propiedad;
}
