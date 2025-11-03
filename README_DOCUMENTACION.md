# Documentación de Casos de Uso e Historias de Usuario - SIA App

## Archivos Generados

Este proyecto incluye documentación completa de requisitos y casos de uso:

### 1. **HISTORIAS_USUARIO.md**
Contiene 47 historias de usuario detalladas organizadas por roles:
- **Usuario Público** (4 historias)
- **Agente Inmobiliario** (5 historias)
- **Administrador** (17 historias)
- **Historias Técnicas** (5 historias)

Cada historia incluye:
- Descripción en formato "Como... Quiero... Para..."
- Criterios de aceptación específicos
- Priorización (Alta, Media, Baja)

### 2. **CASOS_USO.puml**
Contiene 7 diagramas de casos de uso en formato PlantUML:
1. Vista general del sistema completo
2. Casos de uso para Usuario Público
3. Casos de uso para Agente Inmobiliario
4. Casos de uso para Administrador (Gestión de Inmuebles)
5. Casos de uso para Administrador (Gestión de Agentes)
6. Casos de uso para Administrador (Datos Maestros)
7. Relaciones y dependencias entre casos de uso

---

## Cómo Visualizar los Diagramas de Casos de Uso (PlantUML)

### Opción 1: PlantUML Online Server (Más Simple)

1. Visita: **http://www.plantuml.com/plantuml/**
2. Copia el contenido completo del archivo `CASOS_USO.puml`
3. Pégalo en el editor
4. El diagrama se genera automáticamente
5. Puedes descargar como PNG, SVG o PDF

**Ventajas:**
- No requiere instalación
- Funciona directamente en el navegador
- Permite exportar en múltiples formatos

---

### Opción 2: PlantUML Editor (Interfaz Amigable)

1. Visita: **https://plantuml-editor.kkeisuke.com/**
2. Pega el contenido del archivo
3. Vista previa en tiempo real
4. Opción de descargar

**Ventajas:**
- Interfaz más moderna y limpia
- Vista previa instantánea
- Fácil de usar

---

### Opción 3: PlantText (Alternativa Online)

1. Visita: **https://www.planttext.com/**
2. Pega el código PlantUML
3. Click en "Refresh"
4. Descarga el diagrama

---

### Opción 4: VS Code Extension (Para Desarrolladores)

Si usas Visual Studio Code:

1. **Instalar la extensión:**
   - Abre VS Code
   - Ve a Extensions (Ctrl+Shift+X)
   - Busca "PlantUML" by jebbs
   - Click en Install

2. **Visualizar diagramas:**
   - Abre el archivo `CASOS_USO.puml`
   - Presiona `Alt+D` para vista previa
   - O botón derecho > "Preview Current Diagram"

3. **Exportar:**
   - Botón derecho > "Export Current Diagram"
   - Elige formato: PNG, SVG, PDF, etc.

**Ventajas:**
- Integrado en tu editor
- Vista previa mientras editas
- Exportación directa

---

### Opción 5: PlantUML CLI (Línea de Comandos)

Para usuarios avanzados:

```bash
# Instalar PlantUML (requiere Java)
npm install -g node-plantuml

# O usando Java directamente
# Descargar plantuml.jar de https://plantuml.com/download

# Generar todos los diagramas
java -jar plantuml.jar CASOS_USO.puml

# O con node-plantuml
puml generate CASOS_USO.puml -o ./diagramas/
```

---

## Herramientas de Traducción Online Open Source

Si deseas traducir los diagramas a otros formatos UML o a otros idiomas:

### 1. **LibreTranslate** (Traducción de Texto)
- URL: https://libretranslate.com/
- Open source y gratuito
- Para traducir el texto de las historias de usuario

### 2. **draw.io / diagrams.net** (Conversión de Diagramas)
- URL: https://app.diagrams.net/
- Puedes recrear los diagramas manualmente
- Soporta exportación a múltiples formatos
- Open source

### 3. **Mermaid Live Editor** (Alternativa a PlantUML)
- URL: https://mermaid.live/
- Si prefieres sintaxis Mermaid en lugar de PlantUML
- Puede ser más fácil de integrar en documentación Markdown

---

## Convertir PlantUML a Otros Formatos

### Usando Herramientas Online:

1. **PlantUML a PNG/SVG/PDF:**
   - Usa cualquiera de las herramientas online mencionadas
   - Exporta en el formato deseado

2. **PlantUML a Draw.io:**
   - No hay conversión directa automática
   - Opción: recrear manualmente en draw.io usando los diagramas generados como referencia

3. **PlantUML a Mermaid:**
   - No hay conversión automática perfecta
   - Herramienta experimental: https://github.com/somethingnew2-0/PlantUMLToMermaid

---

## Estructura de los Archivos

```
sia_app/
├── HISTORIAS_USUARIO.md          # Historias de usuario en formato texto
├── CASOS_USO.puml                 # Diagramas de casos de uso (PlantUML)
├── README_DOCUMENTACION.md        # Este archivo (instrucciones)
└── (archivos del proyecto...)
```

---

## Cómo Usar Esta Documentación

### Para Product Owners / Project Managers:
1. Lee `HISTORIAS_USUARIO.md` para entender los requisitos funcionales
2. Usa la priorización incluida para planificar sprints
3. Visualiza los diagramas para presentaciones a stakeholders

### Para Desarrolladores:
1. Consulta las historias de usuario para implementar funcionalidades
2. Revisa los criterios de aceptación como base para tests
3. Usa los diagramas para entender el flujo del sistema

### Para QA / Testers:
1. Los criterios de aceptación son la base para crear test cases
2. Los diagramas muestran todos los caminos posibles del usuario
3. Verifica que cada caso de uso tenga cobertura de testing

### Para Stakeholders:
1. Los diagramas visuales facilitan la comprensión del sistema
2. Las historias de usuario explican el valor de cada funcionalidad
3. Exporta los diagramas a PDF para presentaciones

---

## Recomendaciones

### Para Visualización Rápida:
Usa **PlantUML Online Server** - no requiere instalación y funciona inmediatamente.

### Para Trabajo Continuo:
Instala la extensión de VS Code si trabajas frecuentemente con estos diagramas.

### Para Presentaciones:
Exporta los diagramas como SVG (vectorial) para máxima calidad en cualquier tamaño.

### Para Documentación:
Convierte a PNG y embébelos en documentos Word/PDF o wikis.

---

## Soporte y Recursos

### Documentación PlantUML:
- Guía oficial: https://plantuml.com/guide
- Casos de uso: https://plantuml.com/use-case-diagram
- Ejemplos: https://real-world-plantuml.com/

### Tutoriales:
- PlantUML en 5 minutos: https://plantuml.com/starting
- Casos de uso UML: https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-use-case-diagram/

---

## Mantenimiento de la Documentación

Cuando agregues nuevas funcionalidades al sistema:

1. **Actualiza HISTORIAS_USUARIO.md:**
   - Agrega nuevas historias siguiendo el formato existente
   - Actualiza la numeración correlativa
   - Revisa la priorización

2. **Actualiza CASOS_USO.puml:**
   - Agrega el nuevo caso de uso al diagrama correspondiente
   - Actualiza las relaciones (include, extend, depends)
   - Agrega notas explicativas si es necesario

3. **Regenera los diagramas:**
   - Usa cualquiera de las herramientas mencionadas
   - Exporta y guarda las nuevas versiones

---

## Contacto

Para preguntas sobre esta documentación o el sistema SIA App, contacta al equipo de desarrollo.

**Última actualización:** Noviembre 2025
