import { verifyAuth } from "@/actions/auth-actions";

export default async function PruebaAuth() {
  const { status, session } = await verifyAuth("administrador");

  if (status === "not_authenticated") {
    return <div>No autenticado</div>;
  }

  if (status === "not_authorized") {
    return <div>No autorizado</div>;
  }

  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
