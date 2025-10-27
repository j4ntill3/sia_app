export type EstadoInmueble = {
  id: string;
  estado: string;
  inmuebles?: Inmueble[];
};

export type CategoriaInmueble = {
  id: string;
  categoria: string;
  inmuebles?: Inmueble[];
};

export type Localidad = {
  id: string;
  nombre: string;
};

export type Zona = {
  id: string;
  nombre: string;
  localidad_id: string;
};

export type Barrio = {
  id: string;
  nombre: string;
  localidad_id: string;
};

export type Inmueble = {
  id: string;
  categoria_id: string;
  localidad_id: string;
  zona_id: string;
  barrio_id: string;
  direccion: string;
  dormitorios: string;
  banos: string;
  superficie: string;
  cochera: boolean;
  eliminado: boolean;
  estado_id: string;
  categoria?: CategoriaInmueble;
  estado?: EstadoInmueble;
  localidad?: Localidad;
  zona?: Zona;
  barrio?: Barrio;
  descripcion?: string | null;
  imagenes?: ImagenInmueble[];
};

export type InmuebleCreate = {
  categoria_id: string;
  localidad_id: string;
  zona_id: string;
  barrio_id: string;
  direccion: string;
  dormitorios: string;
  banos: string;
  superficie: string;
  cochera: boolean;
  estado_id: string;
  descripcion?: string | null;
  imagenes?: string[]; // Array de imágenes en base64 o URLs
};

export type InmuebleUpdate = {
  categoria_id?: string;
  localidad_id?: string;
  zona_id?: string;
  barrio_id?: string;
  direccion?: string;
  dormitorios?: string;
  banos?: string;
  superficie?: string;
  cochera?: boolean;
  estado_id?: string;
  descripcion?: string | null;
  eliminado?: boolean;
};

export type ImagenInmueble = {
  id: string;
  inmueble_id: string;
  imagen?: string;
  es_principal?: boolean;
  inmueble?: Inmueble;
};
