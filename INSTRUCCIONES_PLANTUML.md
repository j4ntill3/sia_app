# Cómo Visualizar los Diagramas PlantUML - Guía Paso a Paso

## 🚀 MÉTODO 1: PlantUML Online (MÁS RÁPIDO Y FÁCIL)

### Pasos:

1. **Abre el archivo `CASOS_USO.puml`** con Notepad, VS Code o cualquier editor de texto

2. **El archivo contiene 7 diagramas**, cada uno está entre las etiquetas:
   ```
   @startuml NOMBRE_DIAGRAMA
   ... contenido del diagrama ...
   @enduml
   ```

3. **Copia UN diagrama completo** (desde `@startuml` hasta `@enduml` inclusive)

4. **Ve a la web**: http://www.plantuml.com/plantuml/uml/

5. **En el cuadro de texto**, pega el código que copiaste

6. **Presiona "Submit"** (o automáticamente se renderiza)

7. **¡Listo!** Verás el diagrama generado

8. **Para descargar**:
   - Clic derecho sobre el diagrama → "Guardar imagen como..."
   - O usa los enlaces: PNG, SVG, PDF, etc.

9. **Repite el proceso** para cada uno de los 7 diagramas

---

## 📋 Lista de Diagramas Incluidos:

En el archivo `CASOS_USO.puml` encontrarás estos 7 diagramas:

1. **@startuml CASOS_USO_SIA_COMPLETO** - Vista general del sistema
2. **@startuml CASOS_USO_USUARIO_PUBLICO** - Usuario público
3. **@startuml CASOS_USO_AGENTE** - Agente inmobiliario
4. **@startuml CASOS_USO_ADMIN_INMUEBLES** - Admin gestión inmuebles
5. **@startuml CASOS_USO_ADMIN_AGENTES** - Admin gestión agentes
6. **@startuml CASOS_USO_ADMIN_DATOS_MAESTROS** - Admin datos maestros
7. **@startuml CASOS_USO_DEPENDENCIAS** - Relaciones entre casos de uso

---

## 🎨 MÉTODO 2: PlantUML Editor (Interfaz Amigable)

### Pasos:

1. **Ve a**: https://plantuml-editor.kkeisuke.com/

2. **Verás dos paneles**:
   - Izquierda: editor de código
   - Derecha: vista previa del diagrama

3. **Borra el código de ejemplo** del panel izquierdo

4. **Abre `CASOS_USO.puml`** y copia un diagrama completo

5. **Pégalo en el panel izquierdo**

6. **El diagrama aparece automáticamente** en el panel derecho

7. **Para descargar**: botones "PNG" o "SVG" en la parte superior

8. **Para ver otro diagrama**: borra el código y pega otro

---

## 💡 MÉTODO 3: Copiar TODO el archivo de una vez

Algunos editores online permiten múltiples diagramas:

1. **Ve a**: https://www.planttext.com/

2. **Copia TODO el contenido** del archivo `CASOS_USO.puml`

3. **Pégalo** en el editor

4. **Presiona "Refresh"**

5. Verás que genera **múltiples imágenes** (una por cada diagrama)

6. **Desplázate hacia abajo** para ver todos los diagramas

7. **Descarga** cada uno individualmente

---

## 🖥️ MÉTODO 4: VS Code (Para Desarrolladores)

### Instalación:

1. **Abre VS Code**

2. **Ve a Extensions** (Ctrl+Shift+X)

3. **Busca**: "PlantUML" (autor: jebbs)

4. **Instala** la extensión

5. **Reinicia VS Code** si es necesario

### Uso:

1. **Abre el archivo** `CASOS_USO.puml` en VS Code

2. **Presiona Alt+D** para ver la vista previa

   O **Botón derecho** → "Preview Current Diagram"

3. **El diagrama aparece** en un panel lateral

4. **Para exportar**:
   - Botón derecho → "Export Current Diagram"
   - Elige formato: PNG, SVG, PDF, etc.
   - Selecciona carpeta de destino

### Nota:
- Si tienes el cursor en un diagrama específico, solo se previsualiza ese
- Para ver todos, genera cada uno individualmente

---

## 📥 MÉTODO 5: Generar Todos los Diagramas Automáticamente

### Usando la línea de comandos:

#### Opción A: Con Java (PlantUML JAR)

1. **Descarga PlantUML**:
   - Ve a: https://plantuml.com/download
   - Descarga `plantuml.jar`
   - Guárdalo en tu carpeta del proyecto

2. **Abre terminal/cmd** en la carpeta del proyecto

3. **Ejecuta**:
   ```bash
   java -jar plantuml.jar CASOS_USO.puml
   ```

4. **Se generarán** automáticamente archivos PNG para cada diagrama:
   - `CASOS_USO_SIA_COMPLETO.png`
   - `CASOS_USO_USUARIO_PUBLICO.png`
   - etc.

#### Opción B: Con Node.js

1. **Instala node-plantuml**:
   ```bash
   npm install -g node-plantuml
   ```

2. **Genera diagramas**:
   ```bash
   puml generate CASOS_USO.puml -o ./diagramas/
   ```

3. **Los diagramas se guardan** en la carpeta `diagramas/`

---

## ❓ Preguntas Frecuentes

### ¿Por qué no veo el diagrama completo?
- Algunos diagramas son grandes. Usa zoom out o descarga como SVG para mejor calidad

### ¿Puedo editar los diagramas?
- Sí, edita el archivo `.puml` con cualquier editor de texto
- Modifica el código y vuelve a generar el diagrama

### ¿Qué formato es mejor para presentaciones?
- **SVG**: calidad vectorial, perfecto para documentos
- **PNG**: compatible con todo, bueno para emails/web
- **PDF**: ideal para imprimir o presentaciones formales

### ¿Puedo cambiar colores o estilos?
- Sí, PlantUML soporta personalización. Ejemplos:
  ```plantuml
  skinparam actorBackgroundColor lightblue
  skinparam usecaseBackgroundColor lightgreen
  ```

---

## 🎯 Recomendación Final

**Para empezar rápido**: Usa el **Método 1** (PlantUML Online)
- No requiere instalación
- Funciona en cualquier computadora
- Resultados inmediatos

**Para trabajo continuo**: Usa el **Método 4** (VS Code)
- Integrado en tu editor
- Vista previa mientras editas
- Exportación fácil

---

## 🔗 Enlaces Útiles

- **PlantUML Online**: http://www.plantuml.com/plantuml/
- **PlantUML Editor**: https://plantuml-editor.kkeisuke.com/
- **PlantText**: https://www.planttext.com/
- **Documentación PlantUML**: https://plantuml.com/
- **Guía Casos de Uso**: https://plantuml.com/use-case-diagram

---

¿Necesitas ayuda? Revisa el archivo `README_DOCUMENTACION.md` para más información.
