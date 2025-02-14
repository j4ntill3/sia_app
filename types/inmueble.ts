type Inmueble = {
  id: number;
  titulo: string;
  rubro: string | number; // Ahora es el nombre del rubro
  estado: string | number; // Ahora es el nombre del estado
  localidad: string;
  direccion: string;
  superficie: number;
  barrio: string;
  num_habitaciones: number;
  num_banos: number;
  garaje: boolean;
  fecha_creacion: Date;
  id_usuario_creador: number;
  fecha_modificacion: Date | null;
  id_usuario_modificador: number | null;
  eliminado: boolean;
  fecha_eliminacion: Date | null;
  id_usuario_eliminador: number | null;
  ruta_imagen: string;
};

export default Inmueble;
