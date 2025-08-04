This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# SIA App - Backend API

## Estructura de Respuestas

Todas las respuestas de la API siguen el formato:

```json
{
  "data": {
    /* datos de éxito */
  },
  "error": "Mensaje de error opcional",
  "message": "Mensaje opcional"
}
```

## Autenticación y Roles

- La autenticación se realiza mediante sesión (NextAuth).
- Los endpoints protegidos requieren un rol específico:
  - `administrador`: acceso total (gestión de inmuebles, agentes, consultas)
  - `agente`: acceso a sus propios inmuebles y consultas

## Ejemplo de Endpoints

### Obtener inmuebles (público)

`GET /api/inmuebles`

### Crear inmueble (solo administrador)

`POST /api/inmuebles`

### Obtener mis inmuebles (solo agente)

`GET /api/misInmuebles`

### Registrar consulta de cliente (solo agente)

`POST /api/registrarConsultaCliente`

### Obtener todas las consultas de clientes (solo administrador)

`GET /api/consultasClientes`

## Validación de Datos

- Todos los datos de entrada se validan con Zod.
- Los esquemas están en `lib/validation.ts`.

## Helpers y Utilidades

- `lib/api-helpers.ts`: helpers para autenticación y respuestas.
- `lib/db.ts`: helpers para queries comunes de Prisma.
- `lib/type-utils.ts`: helpers para parseo seguro de tipos.
- `lib/validation.ts`: esquemas de validación y tipos.
- `lib/response-types.ts`: tipos TypeScript para respuestas de API.

## Soft Delete

- Los recursos eliminados no se borran físicamente, sino que se marcan con un flag (`deleted` o `eliminado`).
- Los helpers de queries filtran automáticamente los eliminados.

## Tipado y Documentación

- Todos los handlers y helpers están tipados con TypeScript.
- Los esquemas de validación y tipos de respuesta están documentados en los archivos correspondientes.
