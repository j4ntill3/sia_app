-- CreateTable
CREATE TABLE "propiedades" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" UUID NOT NULL,
    "localidadId" UUID NOT NULL,
    "zonaId" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "numBedrooms" INTEGER NOT NULL,
    "numBathrooms" INTEGER NOT NULL,
    "surface" DOUBLE PRECISION NOT NULL,
    "garage" BOOLEAN NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "statusId" UUID NOT NULL,

    CONSTRAINT "propiedades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localidad" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "localidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zona" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "zona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" UUID NOT NULL,
    "telefono" TEXT,
    "apellido" TEXT NOT NULL,
    "direccion" TEXT,
    "correo" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "dni" INTEGER,
    "eliminado" BOOLEAN NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eliminado" BOOLEAN NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" UUID NOT NULL,
    "rol_id" UUID NOT NULL,
    "contrasena" TEXT NOT NULL,
    "persona_id" UUID NOT NULL,
    "eliminado" BOOLEAN NOT NULL,
    "correo_verificado" TIMESTAMP,
    "creado_en" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empleados" (
    "id" UUID NOT NULL,
    "cuit" TEXT NOT NULL,
    "hireDate" DATE NOT NULL,
    "terminationDate" DATE,
    "typeId" UUID NOT NULL,
    "deleted" BOOLEAN NOT NULL,

    CONSTRAINT "empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_empleados" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "tipos_empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personas_empleados" (
    "id" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "personas_empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolUsuario" (
    "id" UUID NOT NULL,
    "tipo_rol" TEXT NOT NULL,
    "eliminado" BOOLEAN NOT NULL,

    CONSTRAINT "RolUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_propiedades" (
    "id" UUID NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "estados_propiedades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_propiedades" (
    "id" UUID NOT NULL,
    "categoria" TEXT NOT NULL,

    CONSTRAINT "categorias_propiedades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_propiedades" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "imagePath" TEXT,

    CONSTRAINT "imagenes_propiedades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_access_tokens" (
    "id" UUID NOT NULL,
    "access_token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_authorization_codes" (
    "authorization_code" TEXT NOT NULL,
    "redirect_uri" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,

    CONSTRAINT "oauth_authorization_codes_pkey" PRIMARY KEY ("authorization_code")
);

-- CreateTable
CREATE TABLE "oauth_refresh_tokens" (
    "id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "usuario_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtoken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP NOT NULL
);

-- CreateTable
CREATE TABLE "agentes_propiedades" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "agentId" UUID NOT NULL,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "agentes_propiedades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas_clientes" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "agentId" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TIMESTAMP NOT NULL,
    "description" TEXT,

    CONSTRAINT "consultas_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_personas" (
    "id" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "imagePath" TEXT,

    CONSTRAINT "imagenes_personas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "propiedades_statusId_idx" ON "propiedades"("statusId");

-- CreateIndex
CREATE INDEX "propiedades_categoryId_idx" ON "propiedades"("categoryId");

-- CreateIndex
CREATE INDEX "propiedades_localidadId_idx" ON "propiedades"("localidadId");

-- CreateIndex
CREATE INDEX "propiedades_zonaId_idx" ON "propiedades"("zonaId");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_correo_key" ON "Persona"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_dni_key" ON "Persona"("dni");

-- CreateIndex
CREATE INDEX "Session_usuario_id_idx" ON "Session"("usuario_id");

-- CreateIndex
CREATE INDEX "Usuario_persona_id_idx" ON "Usuario"("persona_id");

-- CreateIndex
CREATE INDEX "Usuario_rol_id_idx" ON "Usuario"("rol_id");

-- CreateIndex
CREATE UNIQUE INDEX "empleados_cuit_key" ON "empleados"("cuit");

-- CreateIndex
CREATE INDEX "empleados_typeId_idx" ON "empleados"("typeId");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_empleados_type_key" ON "tipos_empleados"("type");

-- CreateIndex
CREATE INDEX "personas_empleados_employeeId_idx" ON "personas_empleados"("employeeId");

-- CreateIndex
CREATE INDEX "personas_empleados_personId_idx" ON "personas_empleados"("personId");

-- CreateIndex
CREATE INDEX "imagenes_propiedades_propertyId_idx" ON "imagenes_propiedades"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_refresh_tokens_refresh_token_key" ON "oauth_refresh_tokens"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "account_usuario_id_key" ON "account"("usuario_id");

-- CreateIndex
CREATE INDEX "account_usuario_id_idx" ON "account"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtoken_identifier_token_key" ON "verificationtoken"("identifier", "token");

-- CreateIndex
CREATE INDEX "agentes_propiedades_agentId_idx" ON "agentes_propiedades"("agentId");

-- CreateIndex
CREATE INDEX "agentes_propiedades_propertyId_idx" ON "agentes_propiedades"("propertyId");

-- CreateIndex
CREATE INDEX "consultas_clientes_agentId_idx" ON "consultas_clientes"("agentId");

-- CreateIndex
CREATE INDEX "consultas_clientes_propertyId_idx" ON "consultas_clientes"("propertyId");

-- CreateIndex
CREATE INDEX "imagenes_personas_personId_idx" ON "imagenes_personas"("personId");

-- AddForeignKey
ALTER TABLE "propiedades" ADD CONSTRAINT "propiedades_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categorias_propiedades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propiedades" ADD CONSTRAINT "propiedades_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "estados_propiedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "propiedades" ADD CONSTRAINT "propiedades_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "localidad"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propiedades" ADD CONSTRAINT "propiedades_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "zona"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "RolUsuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleados" ADD CONSTRAINT "empleados_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "tipos_empleados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personas_empleados" ADD CONSTRAINT "personas_empleados_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "empleados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personas_empleados" ADD CONSTRAINT "personas_empleados_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "imagenes_propiedades" ADD CONSTRAINT "imagenes_propiedades_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "propiedades"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agentes_propiedades" ADD CONSTRAINT "agentes_propiedades_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "propiedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agentes_propiedades" ADD CONSTRAINT "agentes_propiedades_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "empleados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultas_clientes" ADD CONSTRAINT "consultas_clientes_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "propiedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultas_clientes" ADD CONSTRAINT "consultas_clientes_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "empleados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "imagenes_personas" ADD CONSTRAINT "imagenes_personas_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
