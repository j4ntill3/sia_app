# Exportar Diagramas PlantUML a Formatos Editables

## 🎯 MEJORES OPCIONES PARA EDITAR CON OTROS SOFTWARES

---

## ✅ OPCIÓN 1: Exportar a SVG (RECOMENDADO)

### ¿Por qué SVG?
- **Formato vectorial**: mantiene calidad a cualquier tamaño
- **Editable** en múltiples programas
- **Código XML**: puedes editarlo incluso con texto

### Cómo exportar:

#### Desde PlantUML Online:
1. Ve a: http://www.plantuml.com/plantuml/
2. Pega tu diagrama
3. En la URL generada, cambia `/png/` por `/svg/`
   - Ejemplo:
     - PNG: `http://www.plantuml.com/plantuml/png/ABC123...`
     - SVG: `http://www.plantuml.com/plantuml/svg/ABC123...`
4. Guarda el archivo SVG (Ctrl+S)

#### Desde VS Code (con extensión PlantUML):
1. Abre `CASOS_USO.puml`
2. Botón derecho → "Export Current Diagram"
3. Selecciona formato: **SVG**
4. Elige carpeta de destino

### Programas que pueden editar SVG:

#### **Inkscape** (GRATIS - Open Source)
- Descarga: https://inkscape.org/
- **El mejor para editar SVG**
- Permite:
  - Mover elementos
  - Cambiar colores
  - Modificar textos
  - Agregar/eliminar formas
  - Exportar a PDF, PNG, etc.

#### **Adobe Illustrator** (Pago)
- Editor profesional de vectores
- Soporta SVG nativamente

#### **Figma** (Gratis)
- Web/Desktop: https://www.figma.com/
- Importa SVG
- Colaborativo online

#### **Draw.io / diagrams.net** (GRATIS)
- Web: https://app.diagrams.net/
- Importa SVG
- Puede editar elementos básicos

---

## 🔄 OPCIÓN 2: Convertir a Draw.io (diagrams.net)

Draw.io es el software más popular para diagramas y es **100% gratis**.

### Método Manual (MÁS CONFIABLE):

1. **Genera el diagrama en PlantUML** (PNG o SVG)

2. **Abre Draw.io**: https://app.diagrams.net/

3. **Importa como imagen de fondo**:
   - File → Import → Selecciona tu PNG/SVG
   - O arrastra el archivo al canvas

4. **Redibuja el diagrama** sobre la imagen:
   - Usa las formas UML de Draw.io (lateral izquierdo)
   - Sección: "UML" → "Use Case"
   - Arrastra: Actor, Use Case, etc.
   - Copia los textos de la imagen de fondo

5. **Borra la imagen de fondo** cuando termines

6. **Guarda**:
   - Formato `.drawio` (editable)
   - O exporta a: PNG, SVG, PDF, etc.

### Método Semi-Automático (Experimental):

Existen conversores de PlantUML a Draw.io, pero son limitados:

**PlantUML to Draw.io Converter**:
- GitHub: https://github.com/Mogztter/asciidoctor-kroki
- No es perfecto, puede perder formato
- Requiere configuración técnica

**Recomendación**: El método manual es más confiable y te da control total.

---

## 📐 OPCIÓN 3: Exportar a Microsoft Visio

### Usando SVG como intermediario:

1. **Exporta tu diagrama a SVG** (ver Opción 1)

2. **Abre Microsoft Visio**

3. **Importa el SVG**:
   - Insert → Picture → From File
   - Selecciona tu archivo SVG

4. **Convierte a formas editables**:
   - Clic derecho en la imagen → "Ungroup" (repetir varias veces)
   - Las formas se convierten en objetos Visio editables

5. **Edita** como cualquier diagrama de Visio

### Limitaciones:
- Puede perder algo de formato
- Requiere ajustes manuales
- Visio es software de pago

---

## 🎨 OPCIÓN 4: Exportar a Lucidchart

### Pasos:

1. **Exporta a SVG** desde PlantUML

2. **Abre Lucidchart**: https://www.lucidchart.com/

3. **Importa el SVG**:
   - File → Import → Upload
   - Selecciona tu SVG

4. **El diagrama se importa** y puedes editarlo

5. **Guarda en formato Lucidchart** (editable)

### Nota:
- Lucidchart tiene plan gratuito limitado
- Plan de pago para funciones completas

---

## 💎 OPCIÓN 5: Exportar a Miro o FigJam

Para colaboración visual:

### **Miro** (https://miro.com/):
1. Exporta diagrama a PNG/SVG
2. Importa en Miro
3. Usa como imagen de referencia
4. Redibuja con herramientas de Miro (sticky notes, formas, etc.)

### **FigJam** (https://www.figma.com/figjam/):
- Similar a Miro
- Mejor para colaboración en tiempo real

---

## 🔧 OPCIÓN 6: Usar Otro Editor de UML

Si quieres seguir en el mundo UML pero con editor visual:

### **StarUML** (Pago, con trial)
- Descarga: https://staruml.io/
- Editor UML profesional
- Permite importar/exportar XMI

### **Visual Paradigm** (Pago)
- Muy completo
- Soporta múltiples formatos

### **PlantUML en VS Code con preview**
- Extensión PlantUML
- Editas el código .puml
- Vista previa en tiempo real
- **Ventaja**: sigues en formato de texto (versionable con Git)

---

## 🏆 COMPARACIÓN DE OPCIONES

| Método | Dificultad | Calidad | Gratis | Recomendado para |
|--------|-----------|---------|--------|------------------|
| **SVG + Inkscape** | Fácil | ⭐⭐⭐⭐⭐ | ✅ Sí | Edición profesional de vectores |
| **Draw.io (manual)** | Media | ⭐⭐⭐⭐ | ✅ Sí | Recrear diagramas editables |
| **SVG + Visio** | Media | ⭐⭐⭐⭐ | ❌ No | Usuarios de Microsoft Office |
| **Lucidchart** | Fácil | ⭐⭐⭐⭐ | ⚠️ Limitado | Colaboración en equipo |
| **SVG + Figma** | Fácil | ⭐⭐⭐⭐ | ✅ Sí | Diseñadores UI/UX |

---

## 📝 MI RECOMENDACIÓN SEGÚN TU NECESIDAD

### Si quieres editar rápido y gratis:
👉 **SVG + Inkscape**
- Descarga Inkscape (gratis)
- Exporta a SVG desde PlantUML
- Edita libremente

### Si quieres un diagrama completamente editable en herramienta de diagramas:
👉 **Draw.io (método manual)**
- 100% gratis
- Funciona en el navegador
- Resultado profesional
- Formato editable

### Si ya usas Microsoft Office:
👉 **SVG + Visio**
- Se integra con tus herramientas
- Formato empresarial estándar

### Si trabajas en equipo:
👉 **Lucidchart o Miro**
- Colaboración en tiempo real
- Comentarios y feedback

---

## 🎬 TUTORIAL PASO A PASO: SVG + Inkscape

### 1. Exportar a SVG desde PlantUML Online:

```
1. Ve a: http://www.plantuml.com/plantuml/
2. Pega tu código PlantUML
3. En la URL del diagrama, cambia /png/ por /svg/
4. Presiona Enter
5. Ctrl+S para guardar el SVG
```

### 2. Instalar Inkscape:

```
1. Ve a: https://inkscape.org/release/
2. Descarga para Windows
3. Instala (siguiente, siguiente, instalar)
4. Abre Inkscape
```

### 3. Editar el diagrama:

```
1. En Inkscape: File → Open → Selecciona tu SVG
2. Verás el diagrama
3. Herramientas principales:
   - F1: Seleccionar objetos (mover, redimensionar)
   - F8: Agregar texto (doble clic para editar)
   - F4: Agregar rectángulos
   - F5: Agregar elipses
   - F6: Dibujar líneas

4. Para editar texto existente:
   - F1 (seleccionar)
   - Clic en el texto
   - F8 (herramienta texto)
   - Edita el contenido

5. Para cambiar colores:
   - Selecciona el objeto
   - Clic en un color en la paleta inferior

6. Para mover elementos:
   - F1 (seleccionar)
   - Arrastra los objetos

7. Guardar:
   - File → Save As → SVG (editable)
   - File → Export PNG Image (para compartir)
```

---

## 🔗 ENLACES DE DESCARGA

### Software Gratuito Recomendado:

- **Inkscape**: https://inkscape.org/release/
- **Draw.io Desktop**: https://github.com/jgraph/drawio-desktop/releases
- **Figma**: https://www.figma.com/downloads/

### Herramientas Online (sin instalación):

- **Draw.io**: https://app.diagrams.net/
- **PlantUML Online**: http://www.plantuml.com/plantuml/
- **Figma**: https://www.figma.com/

---

## ⚠️ IMPORTANTE

**PlantUML usa código de texto**, lo cual tiene ventajas:
- ✅ Versionable con Git
- ✅ Fácil de mantener
- ✅ Se puede generar automáticamente
- ✅ Cambios masivos rápidos (buscar y reemplazar)

**Editores visuales**:
- ✅ Más intuitivos
- ✅ Mayor control visual
- ❌ Difíciles de versionar
- ❌ Cambios manuales uno por uno

**Considera** si realmente necesitas cambiar de herramienta, o si puedes editar el código `.puml` directamente.

---

## 💡 CONSEJOS FINALES

1. **Para presentaciones**: Exporta a PDF o PNG de alta resolución
2. **Para documentación**: Mantén el .puml y genera imágenes según necesites
3. **Para colaboración**: Usa Draw.io o Lucidchart
4. **Para impresión**: Exporta a SVG o PDF (vectorial, mejor calidad)
5. **Para web**: PNG optimizado o SVG

---

¿Necesitas ayuda con algún método específico? ¡Pregúntame!
