type Inmueble = {
  id: number;
  title: string;
  idRubro: number;
  localidad: string;
  direccion: string;
  barrio: string;
  numHabitaciones: number;
  numBaños: number;
  superficie: number;
  garaje: boolean;
  id_estado: number;
  eliminado: boolean;
};

export default Inmueble;
