---
name: disenar-libro
description: >
    Generar y optimizar ilustraciones de libros para la Biblioteca de Aventuras.
    Usar cuando el usuario pida: "crear lomo", "nuevo libro", "diseñar libro",
    "imagen de lomo", "ilustración de libro", "agregar libro al estante",
    "rediseñar lomo", o mencione generar/modificar las imágenes de los libros
    que aparecen en el estante de la homepage.
---

# Diseñar Libro para Biblioteca

Genera ilustraciones de lomos de libro para el estante de la homepage y las
integra en el código (datos JS, componente, CSS).

## Tipos de imagen

| Tipo | Uso | Aspect ratio | Tamaño final |
|------|-----|-------------|--------------|
| Lomo | Estante homepage | 2:3 | 210×315 px |
| Portada | Modal de libro (futuro) | 3:4 | Por definir |

## Flujo

### Paso 1: Acordar concepto

Definir con el usuario: nombre del libro, paleta de color, emblema/símbolo
central, elementos decorativos. Consultar `references/prompts-imagenes.md`
para las reglas de prompt y ejemplos validados.

### Paso 2: Generar imagen

Usar `mcp__image-gen__generate_image` siguiendo estrictamente el template
de prompt en `references/prompts-imagenes.md`. Mostrar al usuario para
aprobación antes de continuar.

Si la imagen no cumple las reglas (tiene texto, muestra portada en vez de
lomo, incluye superficie/plataforma), regenerar ajustando el prompt.

### Paso 3: Optimizar imagen

Redimensionar con sharp al tamaño final y guardar en `assets/img/biblioteca/`:

```bash
node -e "
const sharp = require('sharp');
sharp('ORIGEN.webp')
  .resize(210, 315)
  .webp({ quality: 82 })
  .toFile('assets/img/biblioteca/lomo-NOMBRE.webp')
  .then(info => console.log('OK', info.size + ' bytes'));
"
```

Eliminar archivos temporales de `assets/img/generadas/`.

### Paso 4: Registrar en datos

Agregar entrada en `LIBROS_ESTANTE` de `js/juego.js`:

```js
{ id: 'ID', titulo: 'Título', color: '#hex', img: 'assets/img/biblioteca/lomo-ID.webp' },
```

### Paso 5: Validar

```bash
npm run lint:fix && npm run lint:css:fix && npm run format
```

Verificar con `npm run dev` que el lomo se ve correctamente en el estante.

## Referencias

- **`references/prompts-imagenes.md`** — Reglas de prompt, template, y ejemplos validados
