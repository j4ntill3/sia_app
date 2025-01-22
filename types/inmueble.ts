type Inmueble = {
  id: number;
  title: string;
  id_rubro: string | number; // Ahora es el nombre del rubro
  localidad: string;
  direccion: string;
  barrio: string;
  num_habitaciones: number;
  num_baños: number;
  superficie: number;
  garaje: boolean;
  eliminado: boolean | null;
  estado: string | number; // Ahora es el nombre del estado
  ruta_imagen: string;
};

export default Inmueble;
