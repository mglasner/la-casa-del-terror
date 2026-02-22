# Transformación: De "La Mansión de Aventuras" a la Gran Biblioteca

## Resumen ejecutivo

El proyecto "La Mansión de Aventuras" — un videojuego web familiar creado para
aprender HTML, CSS y JavaScript — se transformará en una **plataforma narrativa
interactiva** que combina lectura de cuentos originales con minijuegos. La
metáfora central cambia de una mansión gótica con habitaciones a una
**biblioteca personal de madera** donde cada libro en el estante es una
experiencia: leer una historia, consultar una enciclopedia o jugar un juego.

## Motivación

Los personajes del juego (héroes y villanos) tienen su origen en historias que
el autor ha inventado y contado a sus hijas durante su crecimiento. El juego
actual no tiene espacio para esas historias — solo muestra fichas de stats. La
transformación busca:

1. **Escribir y preservar las historias** como legado familiar y cultural
2. **Crear un universo narrativo cohesivo** donde héroes, villanos e historias
   se conectan entre sí
3. **Mantener los juegos existentes** como una faceta del proyecto, no como su
   totalidad
4. **Abrir la puerta a futuras expansiones**: juegos multiplayer, nuevas
   historias, sistema de logros

## El nombre del proyecto

### Criterios

- Creativo y memorable
- Relativamente corto (ideal < 10 letras)
- Coherente con el sufijo "-ario" del Heroario y Villanario
- Disponibilidad de dominio .com y .cl
- Funcionar como marca/legado a largo plazo

### Inspiración

El libro "El Infinito en un Junco" de Irene Vallejo, que narra el origen de la
escritura y la Biblioteca de Alejandría, es una referencia temática directa.

### Candidatos evaluados

| Nombre | Significado | .com | .cl | Notas |
|---|---|---|---|---|
| **Relatario** | relato + ario | Disponible | Disponible | Favorito actual. 9 letras, suena profesional, ambos dominios libres |
| **Papirario** | papiro + ario | Disponible | Disponible | Conexión directa con Alejandría y el junco/papiro. 10 letras |
| **Plumario** | pluma + ario | Disponible | Disponible | La pluma del escritor. 8 letras, pero "plumario" puede evocar "plumero" |
| **Historiario** | historia + ario | Parked (GoDaddy) | Disponible | Buen nombre pero .com ocupado (página "Launching Soon") |
| **Cuentario** | cuento + ario | Ocupado (sitio activo) | Disponible | Ideal semánticamente pero .com no disponible |
| Tintario | tinta + ario | Ocupado | Disponible | Poético pero .com ocupado |
| Fabulario | fábula + ario | Ocupado | Disponible | Palabra real (RAE), pero "fábula" implica moraleja animal |
| Letrario | letra + ario | Ocupado | Disponible | .com ocupado |
| Librario | libro + ario | Ocupado | Disponible | .com ocupado |

### Decisión

Pendiente. **Relatario** lidera por disponibilidad de ambos dominios y sonoridad.

## Cambio conceptual fundamental

### De jugador-personaje a lector-visitante

En la versión actual, el jugador **es** el personaje desde el inicio: elige a
Lina o Rosé y camina por un pasillo como ese avatar. En la nueva versión:

- El jugador es un **lector** que visita la biblioteca
- No hay avatar ni selección de personaje al inicio
- El lector explora libremente: lee cuentos, consulta enciclopedias, abre
  juegos
- La selección de personaje ocurre **solo dentro del Libro de Juegos**, como
  paso previo a cada partida
- El personaje es un **préstamo temporal** (como elegir ficha en un juego de
  mesa), no una identidad permanente

### Flujo del lector

```text
Entrar a la biblioteca (homepage)
    → Explorar el estante de libros
    → Elegir un libro:
        → Si es un cuento: leer (portada → índice → capítulos)
        → Si es el Heroario: consultar héroes (biografías, stats, links a historias)
        → Si es el Villanario: consultar villanos (orígenes, stats, links a historias)
        → Si es el Libro de Juegos: ver índice de juegos → elegir juego → elegir personaje → jugar
    → Volver al estante
```

### Flujo anterior (referencia)

```text
Elegir personaje → Pasillo (caminar como avatar) → Puerta → Jugar habitación → Volver al pasillo
```

## Diseño visual y tono

### Antes (Mansión gótica)

- Paleta oscura: `#1a1a2e`, `#16213e`, `#0d0d1a`
- Acento rojo: `#e94560`
- Tipografía: MedievalSharp (display) + Quicksand (body)
- Elementos: antorchas, niebla, enredaderas, polvo flotante, puertas ornamentadas
- Tono: misterio, oscuridad, aventura

### Después (Biblioteca de living)

- Paleta cálida: maderas (nogal, roble), ámbar, crema, dorado suave
- Tipografía: serif cálida (ej: Lora, Merriweather) + sans humanista para cuerpo
- Elementos: estante de madera fina, luz de lámpara/vela, alfombra, libros con
  lomos de colores
- Tono: **acogedor, íntimo, hogareño** — como una biblioteca que podría estar
  en el living de cualquier casa
- No es una biblioteca enorme/majestuosa tipo Alejandría, sino personal y
  cercana

### Orientación de pantalla

La orientación cambia según el contexto:

| Contexto | Orientación | Razón |
|---|---|---|
| **Biblioteca (homepage)** | **Landscape** | El mueble/estante se ve natural en horizontal, como un mueble real |
| **Libro abierto (lectura)** | **Portrait** | Se lee en vertical como un libro real |
| **Juegos** | **Depende del juego** | Cada juego usa la orientación que mejor se adapte a su mecánica |

Esta rotación contextual es natural: el lector "gira el dispositivo" al sacar
un libro del estante, como lo haría con un libro físico.

## Estructura de la biblioteca (los libros)

### Libros existentes (transformados)

| Libro | Hoy | Mañana |
|---|---|---|
| **Heroario** | Enciclopedia de stats de héroes | Enciclopedia expandida con links a las historias donde aparece cada héroe |
| **Villanario** | Enciclopedia de stats de villanos | Idem, con orígenes trágicos expandidos y links cruzados |
| **Libro de Juegos** | 4 habitaciones con llaves secuenciales | Colección de minijuegos independientes (sin progresión lineal entre ellos) |

### Libros nuevos (por crear)

Historias originales escritas por el autor, basadas en los personajes del
universo. Cada una es un libro independiente en el estante.

#### Historias identificadas en los personajes actuales

1. **La Saga de la Familia Burro** — DonBu (padre terco), Pamelota (madre
   dominante), Topete (5 años, "terremoto con coletas") y Pototo (10 años,
   mente maestra del caos). Historia familiar completa con dinámica
   padre-hijas.
2. **El Circo de las Sombras** — Rosé, la niña de 10 años que venció a "Bella
   Estrella" en la Gran Final. La caída, la transformación en La Grotesca, la
   envidia convertida en monstruo. Historia sobre talento vs. obsesión.
3. **El Violín Roto** — Luminox robó las melodías del violinista más talentoso.
   Nació El Disonante. Ahora Lina, idol de K-pop, entra en escena. Historia
   sobre traición creativa y venganza.
4. **El Conejo Más Feo del Valle** — PomPom, la coneja más hermosa, eligió a
   Orejas, "el que parece que lo armaron con piezas sobrantes". 15 hijos, una
   madriguera caótica, Don Topo el amigo ciego. Historia de amor sobre ver
   belleza donde nadie más la ve.
5. *Semillas por desarrollar*: Siniestra y su trato roto con las sombras, El
   Errante que busca algo perdido hace mil años, El Profano y el templo
   corrupto, Kira la investigadora paranormal, PandaJuro y los cien ninjas.

#### Formato de escritura

Los cuentos se escriben en **markdown** dentro del repositorio, con metadata en
YAML. Estructura propuesta:

```text
cuentos/
├── el-circo-de-las-sombras/
│   ├── libro.yaml              # Metadata del libro
│   ├── prologo.md
│   ├── cap-01-bella-estrella.md
│   ├── cap-02-la-caida.md
│   └── assets/
│       ├── portada.webp
│       └── ilustracion-gran-final.webp
├── el-violin-roto/
│   ├── libro.yaml
│   └── ...
```

Ejemplo de `libro.yaml`:

```yaml
titulo: El Circo de las Sombras
subtitulo: La historia de Rosé y La Grotesca
portada: assets/portada.webp
personajes: [Rosé, La Grotesca]
capitulos:
  - archivo: prologo.md
    titulo: Prólogo
  - archivo: cap-01-bella-estrella.md
    titulo: Bella Estrella
    ilustracion: assets/ilustracion-gran-final.webp
```

Un script `build-cuentos.js` (análogo al existente `build-datos.js`)
transformará el markdown en datos que el componente de libro renderiza en la
app. Se usa **markdown estándar** (sin extensiones tipo MDX); toda la
presentación visual (tipografía, layout de ilustraciones, formato de diálogos,
paginación) la resuelve el renderizador en el navegador.

#### Nota sobre MDX (descartado)

MDX es una extensión de markdown que permite incrustar componentes React
directamente en el texto (ej: `<Dialogo personaje="Rosé">Yo puedo hacer
eso</Dialogo>`). Es potente pero introduce una dependencia en React y
complejidad innecesaria. Para este proyecto, markdown estándar con imágenes
basta: el renderizador se encarga de la magia visual.

### Links cruzados entre libros

Los libros se enlazan entre sí:

- Un cuento menciona a Rosé → link clickeable al Heroario, ficha de Rosé
- El Heroario en la ficha de Rosé dice "Aparece en: El Circo de las Sombras" →
  link al cuento
- El Villanario en la ficha de La Grotesca dice "Su historia: El Circo de las
  Sombras" → link al cuento
- Dentro de un cuento, un nombre de villano → link al Villanario

## Sistema de juegos

### Juegos actuales (se mantienen)

Los 4 minijuegos existentes se preservan intactos en su lógica. Cambia el
contexto:

| # | Nombre actual | Mecánica | Cambios |
|---|---|---|---|
| 1 | El Laberinto | Laberinto 2D procedural 17x17 | Renombrar como capítulo del libro, tesoro como recompensa |
| 2 | El Laberinto 3D | Raycasting estilo Doom 13x13 | Renombrar como capítulo del libro, tesoro como recompensa |
| 3 | El Memorice | Juego de memoria 4x5 | Renombrar como capítulo del libro, tesoro como recompensa |
| 4 | El Abismo | Platformer 2D side-scrolling | Renombrar como capítulo del libro, tesoro como recompensa |

Los juegos se renombrarán para que funcionen como **capítulos del Libro de
Juegos** en vez de "habitaciones" sueltas. Los nombres finales se definirán
durante la implementación.

### Cambios en los juegos

- **Sin progresión lineal**: los 4 juegos son independientes, se puede jugar
  cualquiera en cualquier orden
- **Recompensas = tesoros** para el inventario del lector (no llaves que abren
  puertas)
- **Selección de personaje por juego**: al abrir un juego dentro del Libro de
  Juegos, el lector elige con qué héroe jugar esa partida

### Expansiones futuras de juegos

- **Libro de Juegos Multiplayer (1v1)**: juegos web con dos jugadores desde su
  propio dispositivo
- **Libro de Juegos de Etapas**: juegos con progresión secuencial
- Cada categoría sería un libro separado en el estante

## Sistema de tesoros, medallas y logros

### Concepto

Un sistema de **badges/medallas/tesoros** que se desbloquean a medida que el
lector interactúa con la biblioteca. Los tesoros se exhiben en una sección
dedicada del mueble/biblioteca (vitrina de trofeos).

### Ejemplos de logros

#### Por juegos

- Superar cada juego individual
- Superar un juego sin recibir daño
- Jugar 10 veces con un mismo héroe

#### Por lectura

- Leer un cuento completo
- Leer todos los cuentos disponibles

#### Por exploración

- Consultar todos los héroes en el Heroario
- Consultar todos los villanos en el Villanario
- Derrotar a un villano 3 veces

#### Persistencia

- **V1 (inicial)**: logros en `localStorage` del navegador (se pierden al
  cambiar dispositivo)
- **V2 (futuro)**: sistema de cuentas de usuario con persistencia en servidor

### Exhibición

Los tesoros/medallas obtenidos se muestran en una zona visible del mueble de la
biblioteca (ej: una vitrina, un estante especial, una repisa con trofeos). Esto
incentiva la exploración y la relectura.

## Homepage: el estante de la biblioteca

### Diseño conceptual (2D, landscape)

El mueble está inspirado en la biblioteca real del living del autor —
un mueble de madera que sus hijas reconocen. Es un único mueble que ocupa toda
la pantalla, no una escena de living con múltiples elementos.

```text
┌──────────────────────────────────────────────────────────────┐
│                    R E L A T A R I O                         │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐         ┌────┐ ┌────┐  │    │
│  │ │ He │ │ Vi │ │ Ju │ │    │         │    │ │    │  │    │
│  │ │ ro │ │ ll │ │ eg │ │ ?? │         │ 🏆 │ │ 🏆 │  │    │
│  │ │ ar │ │ an │ │ os │ │    │         │    │ │    │  │    │
│  │ │ io │ │ ar │ │    │ │    │         │    │ │    │  │    │
│  │ │    │ │ io │ │    │ │    │         │    │ │    │  │    │
│  │ └────┘ └────┘ └────┘ └────┘         └────┘ └────┘  │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                  │    │
│  │ │ Ci │ │ Vi │ │ Co │ │ .. │ │ .. │    vitrina de    │    │
│  │ │ rc │ │ ol │ │ ne │ │    │ │    │     tesoros      │    │
│  │ │ o  │ │ ín │ │ jo │ │    │ │    │   (medallas y    │    │
│  │ │    │ │    │ │    │ │    │ │    │    badges)       │    │
│  │ └────┘ └────┘ └────┘ └────┘ └────┘                  │    │
│  └──────────────────────────────────────────────────────┘    │
│              🕯️                           🕯️                  │
└──────────────────────────────────────────────────────────────┘
```

> Nota: el diseño final del mueble será definido por el autor a partir de su
> biblioteca real. El diagrama es solo una referencia conceptual.

### Interacción con los libros

- Los libros se muestran como **lomos verticales** en el estante, mostrando
  solo el título rotado (como una biblioteca real)
- Los lomos tienen el color temático del libro (Heroario = dorado,
  Villanario = oscuro/púrpura, Juegos = rojo, cuentos = colores de sus
  protagonistas)
- Al hacer **tap/clic en un lomo**, se muestra un **modal con mini-preview**:
  la portada del libro con su título y una breve descripción, más un botón
  para abrirlo. Esto evita aperturas accidentales y da contexto visual antes
  de entrar. En versiones futuras se podrá evolucionar a un popover junto al
  libro si el espacio lo permite
- Los lomos pueden tener **animaciones sutiles** (ej: brillo suave, ligero
  movimiento al hover/focus) sin perder el realismo del mueble
- Los libros "por venir" (slots vacíos o con "?") sugieren que hay más
  contenido en camino

### Vitrina de tesoros

La vitrina es una **zona integrada en el mueble** (no una pantalla separada),
visible de un vistazo al entrar a la biblioteca. Muestra las medallas y
tesoros obtenidos por el lector. La ubicación exacta dentro del mueble se
definirá con el diseño final.

## Qué cambia en el código (análisis de impacto)

### Se mantiene intacto

- Toda la lógica de los 4 juegos (habitaciones 1-4)
- El motor 3D de raycasting
- El sistema de componentes (patrón `crear*()`)
- El pipeline YAML → JS (`build-datos.js`)
- Las clases base (`Entidad`, `Personaje`, `Enemigo`)
- Los sprites del platformer
- El Service Worker y estrategias de cache
- El build de producción (esbuild)
- GitHub Actions para deploy

### Cambio cosmético (textos, estilos, branding)

- Nombre del proyecto en HTML, manifest, meta tags
- Paleta de colores CSS (de gótico oscuro a madera cálida)
- Tipografías (de MedievalSharp a serif cálida)
- Decoración del pasillo → decoración de biblioteca
- Textos descriptivos en YAML (menciones a "la mansión")
- Favicon e iconos PWA

### Rediseño de navegación

- **Eliminar**: pasillo con avatar caminante, puertas numeradas, D-pad de
  movimiento en homepage
- **Crear**: estante de libros como homepage (nuevo componente)
- **Mover**: selección de personaje de pantalla inicial a dentro del Libro de
  Juegos
- **Adaptar**: los libros existentes (Heroario/Villanario) funcionan casi
  igual, solo cambia cómo se accede a ellos

### Código nuevo

- `build-cuentos.js` — pipeline de markdown → datos de libro
- Componente de estante (homepage)
- Componente de libro en modo lectura narrativa (extensión del libro existente)
- Sistema de logros/tesoros (modelo de datos + componente de vitrina)
- Directorio `cuentos/` con la estructura de archivos markdown

### Renombramientos estructurales

- Repositorio: `mansion-de-aventuras` → nombre nuevo (ej: `relatario`)
- URL de GitHub Pages: cambiar a dominio custom
- Referencias internas a "mansión" y "habitación" en código y comentarios

## Audio y sonido

Se contempla agregar audio ambiental y efectos de sonido en el futuro:
crujido de madera al sacar un libro, paso de páginas, melodía suave de fondo.
**Fuera del scope inicial** para no agregar complejidad prematura. Se
implementará en fases posteriores una vez que la estructura visual esté
consolidada.

## Juego 5: Ajedrez (en diseño)

Existe un plan de diseño para un quinto juego basado en ajedrez
(`plans/habitacion5-ajedrez.md`), actualmente siendo diseñado por otro agente.
Se implementará **después de la transformación a biblioteca**, como un nuevo
capítulo del Libro de Juegos. No forma parte de la Fase 1.

## Personaje del bibliotecario

Se contempla la existencia de un **personaje bibliotecario** que actúe como
guía o narrador dentro de la biblioteca. Detalles por definir en fases
posteriores de desarrollo. Podría:

- Dar la bienvenida al lector
- Sugerir lecturas o juegos
- Narrar transiciones entre secciones
- Tener su propia ficha en el Heroario

## Fases sugeridas de implementación

> Nota: esto es una propuesta inicial, no un plan definitivo.

### Fase 1 — Fundación (lanzamiento con 3 libros)

El lanzamiento inicial incluye los 3 libros que ya existen transformados
(Heroario, Villanario, Libro de Juegos), sin cuentos aún. Los cuentos se
agregan progresivamente.

- Definir nombre definitivo y registrar dominios
- Crear el reporte de diseño (este documento)
- Rediseñar la homepage (mueble/estante de libros en landscape)
- Cambiar paleta visual y tipografías (de gótico a madera cálida)
- Reorganizar el flujo de navegación (lector → estante → libro)
- Mover selección de personaje al interior del Libro de Juegos
- Hacer los 4 juegos independientes (sin progresión por llaves)
- Actualizar branding: nombre, manifest, favicon, meta tags

### Fase 2 — Libros de historias

- Crear estructura `cuentos/` y pipeline `build-cuentos.js`
- Implementar componente de libro en modo lectura narrativa
- Escribir el primer cuento completo
- Implementar links cruzados entre libros

### Fase 3 — Sistema de logros

- Diseñar modelo de datos de tesoros/medallas
- Implementar vitrina integrada en el mueble de la homepage
- Crear logros para juegos y lectura
- Persistencia en `localStorage`

### Fase 4 — Expansiones

- Libro de Juegos Multiplayer (1v1, dos jugadores en sus dispositivos)
- Libro de Juegos de Etapas (progresión secuencial)
- Cuentas de usuario con persistencia en servidor
- Más cuentos y personajes
- Personaje del bibliotecario

---

*Documento vivo. Se actualiza con cada iteración de diseño.*

*Última actualización: 22 de febrero de 2026*
