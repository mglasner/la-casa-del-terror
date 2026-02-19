# Plan de migración: La Casa del Terror → La Mansión de Aventuras

## Resumen

Migrar toda la identidad del proyecto de "Casa del Terror" (temática Halloween exclusiva) a "Mansión de Aventuras" (temática amplia de aventura/fantasía/misterio que **incluye** terror como una posibilidad más). Los avatares de personajes y villanos se mantienen tal cual.

## Decisiones tomadas

- **Nombre del repo**: `mansion-de-aventuras`
- **Tiers de enemigos**: esbirro → **élite** → pesadilla → leyenda (sin "Oscura")
- **Fuente**: Reemplazar Creepster por una fuente de fantasía/aventura
- **Imágenes**: Regenerar íconos PWA, cuadros del pasillo, telarañas y libro-villanos
- **Repo GitHub**: Incluir pasos de renombrado en el plan

---

## Fase 1: Renombrado de textos visibles al jugador

### 1.1 HTML — Títulos y meta tags

**Archivo**: `index.html`

| Línea | Actual | Nuevo |
|-------|--------|-------|
| 8 | `content="La Casa del Terror - Un juego web de aventura y misterio para toda la familia"` | `content="La Mansión de Aventuras - Un juego web de aventura y misterio para toda la familia"` |
| 13 | `content="La Casa del Terror"` | `content="La Mansión de Aventuras"` |
| 19 | `<title>La Casa del Terror</title>` | `<title>La Mansión de Aventuras</title>` |
| 79 | `alt="Retrato siniestro"` | `alt="Retrato misterioso"` |
| 87 | `alt="Castillo embrujado"` | `alt="Castillo encantado"` |

### 1.2 Manifest PWA

**Archivo**: `manifest.webmanifest`

| Campo | Actual | Nuevo |
|-------|--------|-------|
| `name` | `"La Casa del Terror"` | `"La Mansión de Aventuras"` |
| `short_name` | `"Casa Terror"` | `"Mansión Aventuras"` |
| `start_url` | `"/la-casa-del-terror/"` | `"/mansion-de-aventuras/"` |
| `scope` | `"/la-casa-del-terror/"` | `"/mansion-de-aventuras/"` |

### 1.3 Modal de derrota

**Archivo**: `js/componentes/modalDerrota.js`

| Línea | Actual | Nuevo |
|-------|--------|-------|
| 60 | `nombreJugador + ' no sobrevivió a La Casa del Terror.'` | `nombreJugador + ' no sobrevivió a La Mansión de Aventuras.'` |
| 61 | `'No sobreviviste a La Casa del Terror.'` | `'No sobreviviste a La Mansión de Aventuras.'` |

### 1.4 Tiers de enemigos — Labels visibles

**Archivo**: `js/componentes/stats.js`

| Línea | Actual | Nuevo |
|-------|--------|-------|
| 8 | `terror: { emoji: '💀', label: 'Terror' }` | `elite: { emoji: '⚔️', label: 'Élite' }` |
| 10 | `leyenda: { emoji: '🔥', label: 'Leyenda Oscura' }` | `leyenda: { emoji: '🔥', label: 'Leyenda' }` |

### 1.5 Descripciones del modal de puertas

**Archivo**: `js/componentes/modalPuerta.js`

| Línea | Actual | Nuevo |
|-------|--------|-------|
| 9 | `'Un oscuro laberinto de piedra te espera... encontrarás la salida?'` | `'Un laberinto de piedra te espera... ¿encontrarás la salida?'` |

---

## Fase 2: Datos YAML — Enemigos y narrativa

Los archivos YAML son la fuente de verdad. Los JS generados (`js/enemigos.js`, `js/personajes.js`, configs) se regeneran con `npm run build:datos`.

### 2.1 Renombrar tier "terror" → "elite" en enemigos.yaml

**Archivo**: `datos/enemigos.yaml`

Cambiar `tier: terror` → `tier: elite` en los 3 villanos que lo usan:
- Siniestra (línea ~2)
- El Errante (línea ~38)
- El Profano (línea ~56)

### 2.2 Reemplazar "La Casa del Terror" en descripciones

**Archivo**: `datos/enemigos.yaml`

| Enemigo | Texto actual | Texto nuevo |
|---------|-------------|-------------|
| El Errante | `"...rincones más oscuros de La Casa del Terror..."` | `"...rincones más oscuros de La Mansión de Aventuras..."` |
| Pototo | `"...cada travesura en La Casa del Terror..."` | `"...cada travesura en La Mansión de Aventuras..."` |
| El Disonante | `"...había entrado a La Casa del Terror..."` | `"...había entrado a La Mansión de Aventuras..."` |

### 2.3 Suavizar nombres de ataques con temática terror puro

**Archivo**: `datos/enemigos.yaml`

| Enemigo | Ataque actual | Ataque nuevo | Descripción actual | Descripción nueva |
|---------|--------------|-------------|-------------------|------------------|
| Siniestra | Grito infernal | Grito arcano | Onda de terror puro | Onda de energía pura |
| El Errante | Grito de ultratumba | Eco fantasmal | Aullido paralizante del más allá | Aullido paralizante de otro mundo |
| El Profano | Cuchillada sombría | Zarpazo sombrío | Un tajo rápido desde las sombras | Un zarpazo rápido desde las sombras |
| La Grotesca | Tela sombría | Tela encantada | Envuelve al rival con telas malditas | Envuelve al rival con telas encantadas |
| La Grotesca | Caída fatal | Caída vertiginosa | (sin cambio) | (sin cambio) |
| El Disonante | Réquiem sombrío | Réquiem arcano | Melodía oscura que drena la energía vital | Melodía arcana que drena la energía vital |

**Nota**: Palabras como "sombrío", "oscuro", "sombras" se mantienen cuando encajan con el personaje individual (un villano puede ser sombrío). Lo que se elimina es "terror puro", "infernal", "ultratumba", "malditas", "fatal" — vocabulario exclusivamente de horror.

### 2.4 Personajes — Ajuste mínimo en Kira

**Archivo**: `datos/personajes.yaml`

Kira menciona "investigación paranormal" y "fantasma" — esto **se mantiene** ya que en la Mansión de Aventuras seguimos aceptando temática de terror como una posibilidad. Kira es una investigadora paranormal, eso es parte de su identidad.

Lina menciona "monstruo" — también **se mantiene**, es vocabulario genérico de aventura.

### 2.5 Toast y config de habitación 1

**Archivo**: `datos/habitacion1.yaml`

| Campo | Actual | Nuevo |
|-------|--------|-------|
| `toastTerror` | `"¡{nombre} ha aparecido!"` | Renombrar clave a `toastElite` |
| Sección `villanoTerror:` | Todo el bloque | Renombrar a `villanoElite:` |
| Comentario `# Villano Terror` | | `# Villano Élite` |

---

## Fase 3: Código JS — Renombrado técnico del sistema "villanoTerror"

### 3.1 Renombrar archivo

`js/habitaciones/habitacion1/villanoTerror.js` → `js/habitaciones/habitacion1/villanoElite.js`

### 3.2 Renombrado masivo de identificadores

Aplicar find-and-replace en los siguientes archivos:

**`js/habitaciones/habitacion1/villanoElite.js`** (ex villanoTerror.js):

| Buscar | Reemplazar |
|--------|-----------|
| `obtenerEnemigosTerror` | `obtenerEnemigosElite` |
| `posicionInicialTerror` | `posicionInicialElite` |
| `iniciarVillanoTerror` | `iniciarVillanoElite` |
| `renderizarVillanoTerror` | `renderizarVillanoElite` |
| `actualizarVillanoTerror` | `actualizarVillanoElite` |
| `detectarColisionTerror` | `detectarColisionElite` |
| `limpiarVillanoTerror` | `limpiarVillanoElite` |
| `est.villanoTerror` | `est.villanoElite` |
| `est.countdownTerror` | `est.countdownElite` |
| `CFG.villanoTerror` | `CFG.villanoElite` (ahora `CFG.villanoElite`) |
| `CFG.textos.toastTerror` | `CFG.textos.toastElite` |
| `CONFIG.COUNTDOWN_TERROR` | `CONFIG.COUNTDOWN_ELITE` |
| `CONFIG.INTERVALO_PATHFINDING_TERROR` | `CONFIG.INTERVALO_PATHFINDING_ELITE` |
| `CONFIG.TAM_TERROR` | `CONFIG.TAM_ELITE` |
| `CONFIG.VELOCIDAD_TERROR` | `CONFIG.VELOCIDAD_ELITE` |
| `'terror-laberinto'` | `'elite-laberinto'` |
| `'terror-aparicion'` | `'elite-aparicion'` |
| `'countdown-terror'` | `'countdown-elite'` |
| `tier === 'terror'` | `tier === 'elite'` |
| Comentarios con "Villano Terror" | "Villano Élite" |

**`js/habitaciones/habitacion1/estado.js`**:

| Buscar | Reemplazar |
|--------|-----------|
| `COUNTDOWN_TERROR` | `COUNTDOWN_ELITE` |
| `INTERVALO_PATHFINDING_TERROR` | `INTERVALO_PATHFINDING_ELITE` |
| `TAM_TERROR` | `TAM_ELITE` |
| `VELOCIDAD_TERROR` | `VELOCIDAD_ELITE` |
| `villanoTerror` | `villanoElite` |
| `countdownTerror` | `countdownElite` |
| `CFG.villanoTerror` | `CFG.villanoElite` |

**`js/habitaciones/habitacion1/index.js`**:

| Buscar | Reemplazar |
|--------|-----------|
| `actualizarVillanoTerror` | `actualizarVillanoElite` |
| `limpiarVillanoTerror` | `limpiarVillanoElite` |
| `'./villanoTerror.js'` | `'./villanoElite.js'` |
| Comentarios con "villano terror" | "villano élite" |

### 3.3 Otros archivos JS

**`js/componentes/libroVillanos.js`**:

| Línea | Actual | Nuevo |
|-------|--------|-------|
| 9 | `['esbirro', 'terror', 'pesadilla', 'leyenda']` | `['esbirro', 'elite', 'pesadilla', 'leyenda']` |

**`js/habitaciones/habitacion3/carta.js`**:

| Línea | Actual | Nuevo |
|-------|--------|-------|
| 40 | `// Back (boca abajo): ícono de la casa del terror` | `// Back (boca abajo): ícono de la mansión` |

**`js/juego.js`**:

| Línea | Actual | Nuevo |
|-------|--------|-------|
| 1 | `// Código de La Casa del Terror` | `// Código de La Mansión de Aventuras` |

---

## Fase 4: CSS — Renombrado de clases y animaciones

**Archivo**: `estilos.css`

### 4.1 Clases del sistema villano

| Buscar | Reemplazar |
|--------|-----------|
| `.terror-laberinto` | `.elite-laberinto` |
| `.terror-aparicion` | `.elite-aparicion` |
| `terror-spawn` | `elite-spawn` |
| `.countdown-terror` | `.countdown-elite` |
| `.tier-terror` | `.tier-elite` |
| `/* Villano terror en el laberinto */` | `/* Villano élite en el laberinto */` |
| `/* Estilos de La Casa del Terror */` | `/* Estilos de La Mansión de Aventuras */` |
| `/* Back: ícono de la casa del terror */` | `/* Back: ícono de la mansión */` |

### 4.2 Animación "cuadro-inquietante"

Renombrar `cuadro-inquietante` → `cuadro-misterioso` y el comentario asociado `Brillo inquietante` → `Brillo misterioso`.

---

## Fase 5: Build scripts y Service Worker

### 5.1 Service Worker

**Archivo**: `sw.js`

| Línea | Actual | Nuevo |
|-------|--------|-------|
| 1 | `// Service Worker — La Casa del Terror` | `// Service Worker — La Mansión de Aventuras` |
| 4 | `const CACHE_NAME = 'casa-terror-v1';` | `const CACHE_NAME = 'mansion-aventuras-v1';` |
| 5 | `const BASE_PATH = '/la-casa-del-terror/';` | `const BASE_PATH = '/mansion-de-aventuras/';` |

### 5.2 Build HTML

**Archivo**: `scripts/build-html.js`

| Línea | Actual | Nuevo |
|-------|--------|-------|
| 28 | `sw.replace(/casa-terror-v\w+/, 'casa-terror-' + buildId)` | `sw.replace(/mansion-aventuras-v\w+/, 'mansion-aventuras-' + buildId)` |
| 33 | `console.log('SW cache version: casa-terror-' + buildId)` | `console.log('SW cache version: mansion-aventuras-' + buildId)` |

### 5.3 Build datos — Schema de validación

**Archivo**: `scripts/build-datos.js`

| Línea | Actual | Nuevo |
|-------|--------|-------|
| 136 | `'toastTerror'` | `'toastElite'` |
| 180 | `villanoTerror: [...]` | `villanoElite: [...]` |

### 5.4 Package.json

**Archivo**: `package.json`

| Campo | Actual | Nuevo |
|-------|--------|-------|
| `name` | `"la-casa-del-terror"` | `"mansion-de-aventuras"` |
| `repository.url` | `"...la-casa-del-terror.git"` | `"...mansion-de-aventuras.git"` |
| `bugs.url` | `"...la-casa-del-terror/issues"` | `"...mansion-de-aventuras/issues"` |
| `homepage` | `"...la-casa-del-terror#readme"` | `"...mansion-de-aventuras#readme"` |

---

## Fase 6: Fuente tipográfica

### 6.1 Reemplazar Creepster

Reemplazar la fuente Creepster (horror/Halloween) por una fuente de fantasía/aventura. Candidatas:

- **MedievalSharp** — Estilo medieval aventurero
- **Pirata One** — Estilo piratas/aventura
- **Cinzel Decorative** — Estilo elegante/épico
- **Uncial Antiqua** — Estilo manuscrito antiguo/mágico

Pasos:
1. Descargar la fuente elegida en formato woff2
2. Reemplazar `assets/fonts/creepster-400-latin.woff2` con el nuevo archivo
3. Actualizar `estilos.css`:
   - `@font-face` (línea ~6): nombre de familia y `src`
   - Variable `--font-display` (línea ~23): nuevo nombre
4. Verificar que todos los títulos se ven bien con la nueva fuente

---

## Fase 7: Imágenes — Regenerar assets visuales

### 7.1 Íconos PWA (REEMPLAZAR)

- `assets/img/icons/icon-192.png` — Actualmente: casa embrujada con fantasma y murciélagos
- `assets/img/icons/icon-512.png` — Mismo diseño en mayor resolución

**Nuevo diseño**: Mansión fantástica/mágica con destellos, sin fantasma ni murciélagos. Estilo cartoon colorido, apto para niños.

### 7.2 Cuadros del pasillo (REEMPLAZAR)

- `assets/img/pasillo/cuadro-retrato.webp` — Actualmente: retrato oscuro/siniestro
- `assets/img/pasillo/cuadro-castillo.webp` — Actualmente: castillo gótico con luna

**Nuevo diseño**: Cuadros con estilo de mansión de aventuras (retrato misterioso pero amigable, paisaje fantástico con castillo encantado).

### 7.3 Telarañas del pasillo (REEMPLAZAR)

- `assets/img/pasillo/telarana-izq.svg` — Telaraña esquina izquierda
- `assets/img/pasillo/telarana-der.svg` — Telaraña esquina derecha

**Nuevo diseño**: Reemplazar por enredaderas mágicas, runas luminosas, o hiedra encantada en las esquinas. Mantener formato SVG.

Actualizar también las clases CSS y referencias en `index.html`:
- Clase `.telarana` → `.enredadera` (o el nombre que corresponda)
- `telarana-izq` / `telarana-der` → nombres nuevos

### 7.4 Libro de villanos (REEMPLAZAR)

- `assets/img/libro-villanos.webp` — Actualmente: libro con calavera y telarañas

**Nuevo diseño**: Libro antiguo mágico con runas y destellos, sin calavera. Estilo aventura/fantasía.

---

## Fase 8: Documentación

### 8.1 CLAUDE.md

Actualizar completamente:
- Título: "La Mansión de Aventuras"
- Árbol de directorios: nuevo nombre de carpeta
- Sección "Diseño de villanos": cambiar "cartoon/Halloween" por "cartoon/fantasía", actualizar restricciones de estilo
- URLs de GitHub Pages
- Toda mención a "La Casa del Terror"

### 8.2 Skill crear-personaje

**Archivos**:
- `.claude/skills/crear-personaje/SKILL.md`: Reemplazar nombre del juego, actualizar estilo visual de "Halloween" a "fantasía/aventura"
- `.claude/skills/crear-personaje/references/campos-yaml.md`: Renombrar tier "terror" → "elite" en tablas y schemas
- `.claude/skills/crear-personaje/references/paleta-css.md`: Sin cambios (no tiene referencias a terror)

### 8.3 Planes existentes

**Archivos en `plans/`**: Actualizar menciones en archivos de plan existentes. Son documentos históricos, cambio menor.

### 8.4 Reporte UX

**Archivo**: `reporte-mejoras-ux.html` — Actualizar las ~6 menciones a "La Casa del Terror".

---

## Fase 9: Repositorio GitHub

### 9.1 Renombrar repositorio

En GitHub → Settings → General → Repository name: cambiar `la-casa-del-terror` → `mansion-de-aventuras`.

GitHub crea automáticamente un redirect desde la URL antigua, pero es mejor actualizar todas las referencias.

### 9.2 Actualizar redirect

El repo `mglasner.github.io` tiene un meta refresh apuntando a `https://mglasner.github.io/la-casa-del-terror/`. Actualizar a `https://mglasner.github.io/mansion-de-aventuras/`.

### 9.3 Clonar/actualizar remote local

```bash
git remote set-url origin https://github.com/mglasner/mansion-de-aventuras.git
```

---

## Fase 10: Verificación y regeneración

### 10.1 Regenerar archivos desde YAML

```bash
npm run build:datos
```

Verificar que `js/enemigos.js`, `js/personajes.js` y las configs de habitación reflejan los cambios.

### 10.2 Linting y formato

```bash
npm run lint:fix && npm run lint:css:fix && npm run format
```

### 10.3 Build de producción

```bash
npm run build
```

### 10.4 Verificación manual

- Abrir con `npm run dev`
- Verificar título en pestaña del navegador
- Verificar textos en modal de derrota
- Verificar tiers en el Villanario
- Verificar nombres de ataques en combate
- Verificar nueva fuente en títulos
- Verificar nuevas imágenes en pasillo e íconos

---

## Resumen de archivos a modificar

### Código fuente (17 archivos)

1. `index.html` — títulos, metas, alt texts, clases de telaraña
2. `manifest.webmanifest` — nombre PWA, URLs
3. `estilos.css` — clases .terror-*, animaciones, comentarios, fuente
4. `sw.js` — comentario, cache name, base path
5. `js/juego.js` — comentario
6. `js/componentes/modalDerrota.js` — textos de game over
7. `js/componentes/modalPuerta.js` — descripción habitación 1
8. `js/componentes/stats.js` — labels de tiers
9. `js/componentes/libroVillanos.js` — array de tiers
10. `js/habitaciones/habitacion1/villanoTerror.js` → renombrar a `villanoElite.js` + renombrado masivo
11. `js/habitaciones/habitacion1/estado.js` — constantes y variables
12. `js/habitaciones/habitacion1/index.js` — imports y llamadas
13. `js/habitaciones/habitacion3/carta.js` — comentario

### Datos YAML (2 archivos)

14. `datos/enemigos.yaml` — tiers, descripciones, ataques
15. `datos/habitacion1.yaml` — campos toastTerror, villanoTerror

### Build scripts (3 archivos)

16. `scripts/build-html.js` — regex y log del cache
17. `scripts/build-datos.js` — schema de validación
18. `package.json` — nombre, URLs

### Fuente (2 archivos)

19. Nuevo archivo de fuente en `assets/fonts/`
20. `estilos.css` — @font-face y variable

### Imágenes a regenerar (6 archivos)

21. `assets/img/icons/icon-192.png`
22. `assets/img/icons/icon-512.png`
23. `assets/img/pasillo/cuadro-retrato.webp`
24. `assets/img/pasillo/cuadro-castillo.webp`
25. `assets/img/pasillo/telarana-izq.svg` → reemplazar por enredaderas/runas
26. `assets/img/pasillo/telarana-der.svg` → reemplazar por enredaderas/runas
27. `assets/img/libro-villanos.webp`

### Documentación (5+ archivos)

28. `CLAUDE.md`
29. `.claude/skills/crear-personaje/SKILL.md`
30. `.claude/skills/crear-personaje/references/campos-yaml.md`
31. `plans/*.md` (ajustes menores)
32. `reporte-mejoras-ux.html`

### Repositorio (externo)

33. Renombrar repo en GitHub
34. Actualizar redirect en `mglasner.github.io`
35. Actualizar remote local

---

## Qué NO se cambia

- **Avatares** de personajes y villanos (se mantienen tal cual)
- **Nombres propios** de villanos (Siniestra, El Errante, El Profano, etc.)
- **Términos técnicos de renderizado 3D** (`oscurecerColor()`, `jugadorSombra`, LUTs de sombra, etc.)
- **Palabras como "sombrío/oscuro"** cuando son parte de la personalidad individual de un villano (no de la temática general del juego)
- **Tier "pesadilla"** y tier "leyenda"** — se mantienen (solo se quita "Oscura" del label de leyenda)
- **libroHeroes.js** — ya migrado a "La Mansión de Aventuras"
- **Descripciones de Kira** (investigadora paranormal) y Lina ("monstruo") — vocabulario genérico compatible con aventura
