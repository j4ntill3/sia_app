type Empleado = {
  id: number;
  CUIT: string;
  fecha_alta: Date;
  fecha_baja?: Date;
  tipo: "agente" | "administrador";
  eliminado: boolean;
};

export default Empleado;
