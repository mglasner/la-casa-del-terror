# Prompts para Imágenes de Libros

## Reglas obligatorias (aplican a TODOS los tipos)

1. **Sin texto**: Prohibido cualquier texto, palabra, letra o número. Solo símbolos y emblemas. Runas decorativas son aceptables si no forman palabras legibles
2. **Sin superficie**: El libro debe flotar sobre fondo oscuro. Sin estante, mesa, plataforma ni piso
3. **Solo el lomo**: Mostrar únicamente el lomo (spine) del libro visto de frente. No la portada ni el libro en ángulo 3/4
4. **Estilo**: Semi-cartoon fantasía, apto para niños
5. **Fondo**: Negro sólido, nada más en la escena
6. **Decoraciones**: Usar emblemas en relieve (embossed/engraved), filigranas y texturas del material. No elementos flotantes ni sueltos alrededor del libro

## Template de prompt — Lomo de libro

```
The narrow spine edge of an old book, seen from the front as it would appear
sitting on a bookshelf. Tall narrow vertical rectangle. [MATERIAL] spine with
[EMBLEMA CENTRAL] carved in relief at the center. [DECORACIONES] engraved into
the leather. [EFECTO DE LUZ]. [PALETA DE COLORES], semi-cartoon fantasy art
style, solid black background, nothing else in the image. CRITICAL: zero text
anywhere, zero letters, zero words, zero numbers, zero titles. Only carved
symbols.
```

### Variables del template

| Variable | Descripción | Ejemplos |
|----------|-------------|----------|
| MATERIAL | Tipo de encuadernación | `Ornate golden leather`, `Dark ancient leather`, `Emerald green leather` |
| EMBLEMA CENTRAL | Símbolo principal en relieve | `a crossed sword and staff emblem`, `a single glowing purple cat eye symbol`, `a golden compass rose symbol` |
| DECORACIONES | Elementos secundarios grabados | `Decorative corner filigree`, `Ornate swirl patterns and chain details wrapping the spine`, `Small polyhedral dice and crystal shapes` |
| EFECTO DE LUZ | Brillo o aura del libro | `Warm golden glow emanating from within`, `Subtle purple glow`, `Subtle teal glow from the compass` |
| PALETA DE COLORES | 2-3 colores dominantes | `Rich amber and gold tones`, `Mauve and deep purple tones`, `Green and teal tones` |

## Parámetros de generate_image

```
aspectRatio: "2:3"
purpose: "Book spine illustration for a children's fantasy library, displayed at ~105×190 pixels"
```

## Ejemplo validado: Heroario (intento 2)

```
Book spine viewed from the front on a shelf, vertical rectangle, ornate golden
leather binding with embossed sword and staff emblem, warm golden glow emanating
from within, decorative corner filigree, rich amber and gold tones, semi-cartoon
fantasy style, dark background, no text, no letters, high detail on the leather
texture and gilded ornaments
```

**Por qué funcionó:** Emblema simple (espada+bastón), todo en relieve (embossed, filigree), foco en textura del cuero.

## Ejemplo validado: Libro de Juegos (intento 4)

```
The narrow spine edge of an old book, seen from the front as it would appear
sitting on a bookshelf. Tall narrow vertical rectangle. Emerald green leather
spine with a golden compass rose symbol carved in relief at the center. Small
polyhedral dice and crystal shapes engraved into the leather above and below the
compass. Golden filigree corner ornaments. Subtle teal glow from the compass.
Green and teal color palette, semi-cartoon fantasy art style, solid black
background, nothing else in the image. CRITICAL: zero text anywhere, zero
letters, zero words, zero numbers, zero titles. Only carved symbols.
```

**Por qué funcionó:** Usó "narrow spine edge" + "as it would appear on a bookshelf", enfatizó "carved in relief" y "engraved into", cierre con "CRITICAL: zero text".

## Ejemplo validado: Villanario (intento 4)

```
The narrow spine edge of an old book, seen from the front as it would appear
sitting on a bookshelf. Tall narrow vertical rectangle. Dark ancient leather
spine with a single glowing purple cat eye symbol carved in relief at the center.
Ornate swirl patterns engraved into the leather around the eye. Iron chain
details wrapping the spine. Subtle purple glow. Mauve and deep purple color
palette, semi-cartoon fantasy art style, solid black background, nothing else in
the image. CRITICAL: zero text anywhere, zero letters, zero words, zero numbers,
zero titles. Only carved symbols.
```

**Nota:** Genera runas decorativas alrededor del ojo que parecen símbolos no-legibles — aceptable.

## Lecciones aprendidas (iteraciones)

| Intento | Problema | Causa | Solución que funcionó |
|---------|----------|-------|----------------------|
| 1 | Emojis cuadrados sobre gradiente CSS | No se generaron imágenes | Generar ilustraciones AI completas |
| 2 | Villanario muestra portada 3/4 | "book spine" no es suficiente | Usar "narrow spine edge of an old book, seen from the front" |
| 2 | Juegos tiene texto y plataforma | Modelo infiere título y contexto | Agregar "CRITICAL: zero text" + "nothing else in the image" |
| 3 | Villanario tiene texto legible | "no text" no es enfático | Usar "CRITICAL: zero text anywhere, zero letters, zero words..." |
| 3 | Juegos muestra portada frontal | "Book spine" se interpreta como portada | Cambiar a "narrow spine edge" + "as it would appear on a bookshelf" |
| 4 | Todos correctos | — | Template refinado con frases clave validadas |

### Frases clave que funcionan

- `The narrow spine edge of an old book` — fuerza la orientación correcta
- `seen from the front as it would appear sitting on a bookshelf` — contexto visual claro
- `Tall narrow vertical rectangle` — refuerza la proporción
- `carved in relief` / `engraved into the leather` — mantiene decoraciones como parte del libro
- `CRITICAL: zero text anywhere, zero letters, zero words, zero numbers, zero titles. Only carved symbols.` — el enfático final que el modelo respeta
- `solid black background, nothing else in the image` — elimina plataformas y contexto

## Libros actuales del estante

| Libro | Color | Archivo | Emblema |
|-------|-------|---------|---------|
| Heroario | `#c8a050` (dorado) | `lomo-heroario.webp` | Espada y bastón cruzados |
| Villanario | `#8b3a62` (púrpura) | `lomo-villanario.webp` | Ojo púrpura con cadenas |
| Libro de Juegos | `#4a7c59` (verde) | `lomo-juegos.webp` | Rosa de los vientos con dados |
