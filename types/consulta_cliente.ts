export default interface ConsultaCliente {
  id: number; // Identificador único del cliente
  id_inmueble: number; // Id del inmueble relacionado
  id_agente: number; // Id del agente relacionado
  nombre: string; // Nombre del cliente
  apellido: string; // Apellido del cliente
  telefono: string | null; // Teléfono del cliente (puede ser null si no tiene)
  email: string | null; // Email del cliente (puede ser null si no tiene)
  fecha: string; // Fecha relacionada con el cliente (por ejemplo, la fecha de creación o solicitud)
  descripcion: string | null; // Descripción del cliente (puede ser null si no tiene)
}
