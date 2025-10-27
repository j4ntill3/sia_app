import AdminEntityManager from "@/components/AdminEntityManager";

export default function RubrosPage() {
  return (
    <AdminEntityManager
      title="Administración de Rubros"
      entityName="Rubro"
      apiEndpoint="/api/inmuebleRubros"
      displayField="categoria"
      inputLabel="Nombre del Rubro"
      inputPlaceholder="Ej: Casa, Departamento, Terreno"
    />
  );
}
