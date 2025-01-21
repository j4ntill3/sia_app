type Inmueble = {
  id: number;
  title: string;
  idRubro: string | number; // Ahora es el nombre del rubro
  localidad: string;
  direccion: string;
  barrio: string;
  numHabitaciones: number;
  numBaños: number;
  superficie: number;
  garaje: boolean;
  eliminado: boolean;
  estado: string | number; // Ahora es el nombre del estado
  ruta_imagen: string;
};

export default Inmueble;
