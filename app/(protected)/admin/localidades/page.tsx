import AdminEntityManager from "@/components/AdminEntityManager";

export default function LocalidadesPage() {
  return (
    <AdminEntityManager
      title="Administración de Localidades"
      entityName="Localidad"
      apiEndpoint="/api/localidades"
      displayField="nombre"
      inputLabel="Nombre de la Localidad"
      inputPlaceholder="Ej: Buenos Aires, Rosario, Córdoba"
    />
  );
}
