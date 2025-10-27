-- CreateTable
CREATE TABLE "inmuebles" (
    "id" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "localidadId" UUID NOT NULL,
    "zonaId" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "numBedrooms" INTEGER NOT NULL,
    "numBathrooms" INTEGER NOT NULL,
    "surface" DOUBLE PRECISION NOT NULL,
    "garage" BOOLEAN NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "statusId" UUID NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "inmuebles_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "persona" (
    "id" UUID NOT NULL,
    "telefono" TEXT,
    "apellido" TEXT NOT NULL,
    "direccion" TEXT,
    "correo" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "dni" INTEGER,
    "eliminado" BOOLEAN NOT NULL,

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eliminado" BOOLEAN NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL,
    "rol_id" UUID NOT NULL,
    "contrasena" TEXT NOT NULL,
    "persona_id" UUID NOT NULL,
    "eliminado" BOOLEAN NOT NULL,
    "correo_verificado" TIMESTAMP(6),
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empleados" (
    "id" UUID NOT NULL,
    "cuit" TEXT NOT NULL,
    "hireDate" DATE NOT NULL,
    "terminationDate" DATE,
    "typeId" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL,

    CONSTRAINT "empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_empleados" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "tipos_empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personas_empleados" (
    "id" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "personas_empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_usuario" (
    "id" UUID NOT NULL,
    "tipo_rol" TEXT NOT NULL,
    "eliminado" BOOLEAN NOT NULL,

    CONSTRAINT "rol_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_inmuebles" (
    "id" UUID NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "estados_inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_inmuebles" (
    "id" UUID NOT NULL,
    "categoria" TEXT NOT NULL,

    CONSTRAINT "categorias_inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_inmuebles" (
    "id" UUID NOT NULL,
    "inmuebleId" UUID NOT NULL,
    "imagePath" TEXT,

    CONSTRAINT "imagenes_inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_access_tokens" (
    "id" UUID NOT NULL,
    "access_token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_authorization_codes" (
    "authorization_code" TEXT NOT NULL,
    "redirect_uri" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "oauth_authorization_codes_pkey" PRIMARY KEY ("authorization_code")
);

-- CreateTable
CREATE TABLE "oauth_refresh_tokens" (
    "id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

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
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtoken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(6) NOT NULL
);

-- CreateTable
CREATE TABLE "agentes_inmuebles" (
    "id" UUID NOT NULL,
    "inmuebleId" UUID NOT NULL,
    "agentId" UUID NOT NULL,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "agentes_inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas_clientes" (
    "id" UUID NOT NULL,
    "agentId" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "description" TEXT,
    "inmuebleId" UUID NOT NULL,

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
CREATE INDEX "inmuebles_statusId_idx" ON "inmuebles"("statusId");

-- CreateIndex
CREATE INDEX "inmuebles_categoryId_idx" ON "inmuebles"("categoryId");

-- CreateIndex
CREATE INDEX "inmuebles_localidadId_idx" ON "inmuebles"("localidadId");

-- CreateIndex
CREATE INDEX "inmuebles_zonaId_idx" ON "inmuebles"("zonaId");

-- CreateIndex
CREATE UNIQUE INDEX "persona_correo_key" ON "persona"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "persona_dni_key" ON "persona"("dni");

-- CreateIndex
CREATE INDEX "session_usuario_id_idx" ON "session"("usuario_id");

-- CreateIndex
CREATE INDEX "usuario_persona_id_idx" ON "usuario"("persona_id");

-- CreateIndex
CREATE INDEX "usuario_rol_id_idx" ON "usuario"("rol_id");

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
CREATE INDEX "imagenes_inmuebles_inmuebleId_idx" ON "imagenes_inmuebles"("inmuebleId");

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
CREATE INDEX "agentes_inmuebles_agentId_idx" ON "agentes_inmuebles"("agentId");

-- CreateIndex
CREATE INDEX "agentes_inmuebles_inmuebleId_idx" ON "agentes_inmuebles"("inmuebleId");

-- CreateIndex
CREATE INDEX "consultas_clientes_agentId_idx" ON "consultas_clientes"("agentId");

-- CreateIndex
CREATE INDEX "consultas_clientes_inmuebleId_idx" ON "consultas_clientes"("inmuebleId");

-- CreateIndex
CREATE INDEX "imagenes_personas_personId_idx" ON "imagenes_personas"("personId");

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categorias_inmuebles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "localidad"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "estados_inmuebles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "zona"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "rol_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleados" ADD CONSTRAINT "empleados_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "tipos_empleados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personas_empleados" ADD CONSTRAINT "personas_empleados_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "empleados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personas_empleados" ADD CONSTRAINT "personas_empleados_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "imagenes_inmuebles" ADD CONSTRAINT "imagenes_inmuebles_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "inmuebles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agentes_inmuebles" ADD CONSTRAINT "agentes_inmuebles_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "empleados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agentes_inmuebles" ADD CONSTRAINT "agentes_inmuebles_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "inmuebles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultas_clientes" ADD CONSTRAINT "consultas_clientes_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "empleados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultas_clientes" ADD CONSTRAINT "consultas_clientes_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "inmuebles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "imagenes_personas" ADD CONSTRAINT "imagenes_personas_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persona"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
