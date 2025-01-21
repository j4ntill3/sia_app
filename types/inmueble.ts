type Inmueble = {
  id: number;
  title: string;
  idRubro: number;
  localidad: string;
  direccion: string;
  barrio?: string; // Se mantiene opcional si puede ser nulo
  numHabitaciones?: number; // Se mantiene opcional si puede ser nulo
  numBaños?: number; // Se mantiene opcional si puede ser nulo
  superficie?: number; // Se mantiene opcional si puede ser nulo
  garaje?: boolean; // Se mantiene opcional si puede ser nulo
  eliminado: boolean;
  id_estado: number; // Sigue siendo obligatorio
  ruta_imagen: string;
};

export default Inmueble;
