# Historias de Usuario - SIA App

## Sistema de Gestión Inmobiliaria Argentino

---

## 1. USUARIO PÚBLICO (No autenticado)

### HU-PUB-001: Visualizar Propiedades Disponibles
**Como** visitante del sitio web
**Quiero** ver un listado de todas las propiedades disponibles
**Para** conocer la oferta inmobiliaria disponible

**Criterios de aceptación:**
- El sistema muestra 5 propiedades por página
- Cada propiedad muestra: dirección, barrio, zona, localidad, categoría, estado, dormitorios, baños, superficie, cochera, descripción e imágenes
- Solo se muestran propiedades no eliminadas y disponibles
- Existe paginación para navegar entre páginas

---

### HU-PUB-002: Ver Detalle de Propiedad
**Como** visitante interesado
**Quiero** ver el detalle completo de una propiedad específica
**Para** obtener toda la información necesaria antes de consultar

**Criterios de aceptación:**
- Se muestra toda la información de la propiedad
- Se visualizan todas las imágenes disponibles
- La primera imagen marcada como principal se destaca

---

### HU-PUB-003: Enviar Consulta sobre Propiedad
**Como** cliente potencial
**Quiero** enviar una consulta sobre una propiedad que me interesa
**Para** obtener más información o coordinar una visita

**Criterios de aceptación:**
- El formulario solicita: nombre, apellido, teléfono, email, descripción/mensaje
- Todos los campos son obligatorios
- La consulta se asigna automáticamente al agente responsable del inmueble
- Si no hay agente asignado, se asigna al primer agente disponible
- El sistema confirma el envío exitoso

---

### HU-PUB-004: Filtrar Propiedades
**Como** visitante
**Quiero** filtrar las propiedades por diferentes criterios
**Para** encontrar rápidamente lo que busco

**Criterios de aceptación:**
- Puedo filtrar por: dirección, barrio, zona, localidad, categoría
- Los filtros se aplican en tiempo real
- El contador de resultados se actualiza

---

## 2. AGENTE INMOBILIARIO

### HU-AGE-001: Iniciar Sesión
**Como** agente inmobiliario
**Quiero** iniciar sesión en el sistema
**Para** acceder a mis funcionalidades exclusivas

**Criterios de aceptación:**
- El sistema solicita email y contraseña
- Si las credenciales son correctas, redirige al dashboard de agente
- Si son incorrectas, muestra mensaje de error
- La sesión se mantiene hasta que el usuario cierre sesión

---

### HU-AGE-002: Ver Mis Propiedades Asignadas
**Como** agente inmobiliario
**Quiero** ver solo las propiedades que me han sido asignadas
**Para** gestionar mi cartera de inmuebles

**Criterios de aceptación:**
- Solo veo propiedades asignadas a mí
- Se muestran 5 propiedades por página con paginación
- Puedo buscar por dirección, barrio, zona, localidad
- Se muestran todas las propiedades (disponibles, vendidas, alquiladas)

---

### HU-AGE-003: Ver Consultas de Clientes Asignadas
**Como** agente inmobiliario
**Quiero** ver todas las consultas de clientes asignadas a mis inmuebles
**Para** dar seguimiento y contactar a los interesados

**Criterios de aceptación:**
- Veo solo consultas de inmuebles asignados a mí
- Se muestra: nombre del cliente, teléfono, email, fecha, descripción, inmueble relacionado
- Las consultas están ordenadas por fecha (más recientes primero)
- Puedo exportar la lista a CSV

---

### HU-AGE-004: Registrar Consulta Manual
**Como** agente inmobiliario
**Quiero** registrar manualmente una consulta recibida por teléfono o en persona
**Para** mantener registro de todos los contactos con clientes

**Criterios de aceptación:**
- Puedo ingresar: ID de inmueble, nombre, apellido, teléfono, email, descripción
- El sistema valida que el inmueble exista y esté asignado a mí
- La consulta se guarda con fecha actual
- Se confirma el registro exitoso

---

### HU-AGE-005: Visualizar Todas las Propiedades
**Como** agente inmobiliario
**Quiero** ver todas las propiedades del sistema (no solo las mías)
**Para** tener conocimiento de la oferta completa de la inmobiliaria

**Criterios de aceptación:**
- Puedo ver todas las propiedades disponibles
- Solo tengo permisos de lectura (no puedo crear, editar o eliminar)
- Puedo buscar y filtrar

---

## 3. ADMINISTRADOR

### HU-ADM-001: Iniciar Sesión como Administrador
**Como** administrador del sistema
**Quiero** iniciar sesión con mis credenciales
**Para** acceder a todas las funcionalidades administrativas

**Criterios de aceptación:**
- El sistema solicita email y contraseña
- Si las credenciales son correctas y el rol es "administrador", redirige al dashboard completo
- La sesión mantiene el rol de administrador

---

### HU-ADM-002: Crear Nueva Propiedad
**Como** administrador
**Quiero** crear una nueva propiedad en el sistema
**Para** ampliar el catálogo disponible

**Criterios de aceptación:**
- El formulario solicita: categoría, localidad, zona, barrio, dirección, dormitorios, baños, superficie total, cochera, estado, descripción
- Puedo subir múltiples imágenes
- La primera imagen se marca automáticamente como principal
- Todos los campos obligatorios están validados
- Se confirma la creación exitosa

---

### HU-ADM-003: Editar Propiedad Existente
**Como** administrador
**Quiero** editar los datos de una propiedad
**Para** mantener la información actualizada

**Criterios de aceptación:**
- Puedo modificar cualquier campo de la propiedad
- Los cambios se validan antes de guardarse
- Se confirma la actualización exitosa
- El historial de imágenes se mantiene

---

### HU-ADM-004: Eliminar Propiedad
**Como** administrador
**Quiero** eliminar una propiedad del sistema
**Para** ocultar propiedades que ya no están disponibles

**Criterios de aceptación:**
- La eliminación es lógica (soft delete), no física
- La propiedad deja de aparecer en listados públicos
- Los datos se conservan en la base de datos con campo eliminado=true
- Se confirma la eliminación exitosa

---

### HU-ADM-005: Gestionar Imágenes de Propiedad
**Como** administrador
**Quiero** agregar, eliminar y marcar imágenes como principales
**Para** mantener una galería visual atractiva de cada propiedad

**Criterios de aceptación:**
- Puedo subir nuevas imágenes a una propiedad existente
- Puedo eliminar imágenes existentes
- Si elimino todas las imágenes, se asigna una imagen por defecto
- Puedo marcar una imagen como principal
- Solo puede haber una imagen principal por propiedad
- Al marcar una como principal, las demás se desmarcan automáticamente

---

### HU-ADM-006: Listar Todos los Agentes
**Como** administrador
**Quiero** ver un listado de todos los agentes registrados
**Para** gestionar el equipo de trabajo

**Criterios de aceptación:**
- Se muestran todos los agentes con sus datos personales y laborales
- Se muestra: nombre, apellido, DNI, email, teléfono, CUIT, foto de perfil, estado (activo/eliminado)
- Puedo exportar la lista a CSV
- Puedo buscar agentes

---

### HU-ADM-007: Crear Nuevo Agente
**Como** administrador
**Quiero** registrar un nuevo agente en el sistema
**Para** incorporar nuevos miembros al equipo

**Criterios de aceptación:**
- El formulario solicita: nombre, apellido, DNI, email, teléfono, dirección, fecha de nacimiento, CUIT
- Opcionalmente puedo subir foto de perfil
- El sistema valida que DNI, email y CUIT sean únicos
- Se crea automáticamente:
  - Registro en tabla persona
  - Registro en tabla empleado (tipo agente)
  - Usuario con contraseña temporal aleatoria
  - Rol de agente asignado
- Se muestra la contraseña temporal generada para comunicársela al agente
- Se confirma la creación exitosa

---

### HU-ADM-008: Editar Datos de Agente
**Como** administrador
**Quiero** editar los datos de un agente existente
**Para** mantener la información actualizada

**Criterios de aceptación:**
- Puedo modificar todos los campos excepto el usuario
- Se valida que el DNI no esté duplicado
- Se actualiza la foto de perfil si se proporciona una nueva
- Se confirma la actualización exitosa

---

### HU-ADM-009: Eliminar Agente
**Como** administrador
**Quiero** dar de baja un agente del sistema
**Para** gestionar el equipo activo

**Criterios de aceptación:**
- La eliminación es lógica (soft delete)
- El agente no puede iniciar sesión después de ser eliminado
- Los datos históricos se mantienen
- Se confirma la eliminación exitosa

---

### HU-ADM-010: Asignar Agente a Propiedad
**Como** administrador
**Quiero** asignar o reasignar un agente responsable a una propiedad
**Para** distribuir la cartera de inmuebles

**Criterios de aceptación:**
- Puedo seleccionar cualquier agente activo del sistema
- Si ya existe una asignación previa, se elimina lógicamente
- Se crea la nueva relación agente-inmueble
- Una propiedad solo puede tener un agente asignado a la vez
- Se confirma la asignación exitosa

---

### HU-ADM-011: Ver Todas las Consultas del Sistema
**Como** administrador
**Quiero** ver todas las consultas de clientes recibidas
**Para** supervisar el flujo de leads y la gestión del equipo

**Criterios de aceptación:**
- Veo consultas de todos los agentes
- Se muestra: cliente, agente asignado, inmueble, fecha, descripción
- Puedo exportar a CSV
- Las consultas están ordenadas por fecha

---

### HU-ADM-012: Gestionar Categorías de Inmuebles
**Como** administrador
**Quiero** crear, editar y eliminar categorías de inmuebles (Casa, Departamento, Terreno, etc.)
**Para** mantener actualizado el catálogo de tipos de propiedades

**Criterios de aceptación:**
- Puedo ver todas las categorías existentes
- Puedo crear nuevas categorías con un nombre único
- Puedo editar el nombre de categorías existentes
- Puedo eliminar categorías que no estén en uso
- Los cambios se reflejan inmediatamente en los formularios

---

### HU-ADM-013: Gestionar Estados de Inmuebles
**Como** administrador
**Quiero** crear, editar y eliminar estados de inmuebles (Disponible, Vendido, Alquilado, etc.)
**Para** mantener actualizado el catálogo de estados posibles

**Criterios de aceptación:**
- Puedo ver todos los estados existentes
- Puedo crear nuevos estados con un nombre único
- Puedo editar el nombre de estados existentes
- Puedo eliminar estados que no estén en uso
- Los cambios se reflejan inmediatamente en los formularios

---

### HU-ADM-014: Gestionar Localidades
**Como** administrador
**Quiero** crear, editar y eliminar localidades
**Para** mantener actualizada la geografía del sistema

**Criterios de aceptación:**
- Puedo ver todas las localidades existentes
- Puedo crear nuevas localidades
- Puedo editar localidades existentes
- Puedo eliminar localidades que no estén en uso
- Al eliminar una localidad, se valida que no tenga zonas o barrios asociados

---

### HU-ADM-015: Gestionar Zonas
**Como** administrador
**Quiero** crear, editar y eliminar zonas dentro de localidades
**Para** organizar geográficamente las propiedades

**Criterios de aceptación:**
- Puedo ver todas las zonas, opcionalmente filtradas por localidad
- Al crear una zona, debo asociarla a una localidad existente
- Puedo editar el nombre de zonas existentes
- Puedo eliminar zonas que no estén en uso
- Los formularios de inmuebles se actualizan según la localidad seleccionada

---

### HU-ADM-016: Gestionar Barrios
**Como** administrador
**Quiero** crear, editar y eliminar barrios dentro de localidades
**Para** tener una clasificación detallada de ubicaciones

**Criterios de aceptación:**
- Puedo ver todos los barrios, opcionalmente filtrados por localidad
- Al crear un barrio, debo asociarlo a una localidad existente
- Puedo editar el nombre de barrios existentes
- Puedo eliminar barrios que no estén en uso
- Los formularios de inmuebles se actualizan según la localidad seleccionada

---

### HU-ADM-017: Exportar Datos a CSV
**Como** administrador
**Quiero** exportar listados a formato CSV
**Para** analizar datos en hojas de cálculo o generar reportes

**Criterios de aceptación:**
- Puedo exportar: inmuebles, agentes, consultas de clientes
- El archivo CSV incluye todas las columnas relevantes
- El nombre del archivo indica el tipo de datos y la fecha de exportación
- La descarga inicia automáticamente

---

## 4. HISTORIAS TÉCNICAS

### HT-001: Autenticación y Autorización
**Como** desarrollador
**Quiero** implementar un sistema robusto de autenticación
**Para** garantizar seguridad en el acceso al sistema

**Criterios de aceptación:**
- NextAuth v5 configurado con credentials provider
- Roles: "administrador" y "agente"
- Middleware que protege rutas según rol
- Sesión incluye: userId, role, employeeId

---

### HT-002: Soft Delete para Auditoría
**Como** desarrollador
**Quiero** implementar eliminación lógica en todas las entidades principales
**Para** mantener trazabilidad y permitir recuperación de datos

**Criterios de aceptación:**
- Todas las entidades tienen campo eliminado (boolean)
- Las consultas filtran automáticamente eliminado=false
- Los registros nunca se borran físicamente de la base de datos

---

### HT-003: Validación de Datos
**Como** desarrollador
**Quiero** validar todos los datos de entrada con Zod
**Para** garantizar integridad y consistencia de datos

**Criterios de aceptación:**
- Todos los endpoints validan datos antes de procesarlos
- Se retornan mensajes de error claros y específicos
- Validaciones tanto en cliente como en servidor

---

### HT-004: Gestión de Imágenes
**Como** desarrollador
**Quiero** implementar un sistema eficiente de carga y gestión de imágenes
**Para** optimizar el rendimiento y la experiencia de usuario

**Criterios de aceptación:**
- Imágenes se almacenan en /public/img/
- Soporte para múltiples formatos (jpg, png, webp)
- Validación de tamaño máximo
- Eliminación de archivos huérfanos

---

### HT-005: Paginación y Búsqueda
**Como** desarrollador
**Quiero** implementar paginación y búsqueda en listados largos
**Para** mejorar el rendimiento y la usabilidad

**Criterios de aceptación:**
- Listados de inmuebles paginados (5 por página)
- Búsqueda funciona sobre campos relevantes
- Los resultados se actualizan sin recargar la página

---

## 5. PRIORIZACIÓN

### Prioridad Alta (MVP)
- HU-PUB-001, HU-PUB-002, HU-PUB-003 (Funcionalidad pública básica)
- HU-AGE-001, HU-AGE-002, HU-AGE-003 (Funcionalidad básica de agente)
- HU-ADM-001, HU-ADM-002, HU-ADM-003, HU-ADM-004 (Gestión básica de propiedades)
- HU-ADM-007, HU-ADM-010 (Gestión básica de agentes)
- HT-001, HT-002, HT-003 (Seguridad y validación)

### Prioridad Media
- HU-PUB-004 (Filtros)
- HU-AGE-004, HU-AGE-005 (Funcionalidad extendida de agente)
- HU-ADM-005, HU-ADM-008, HU-ADM-009 (Gestión avanzada)
- HU-ADM-011, HU-ADM-017 (Supervisión)
- HT-004, HT-005 (Optimizaciones)

### Prioridad Baja
- HU-ADM-012, HU-ADM-013, HU-ADM-014, HU-ADM-015, HU-ADM-016 (Datos maestros)
