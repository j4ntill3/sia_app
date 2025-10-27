import AdminEntityManager from "@/components/AdminEntityManager";

export default function EstadosPage() {
  return (
    <AdminEntityManager
      title="Administración de Estados"
      entityName="Estado"
      apiEndpoint="/api/inmuebleEstados"
      displayField="estado"
      inputLabel="Nombre del Estado"
      inputPlaceholder="Ej: Disponible, Alquilado, Vendido"
    />
  );
}
