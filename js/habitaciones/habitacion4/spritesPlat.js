// Habitacion 4 — El Abismo: Sprites pixel art procedurales
// Generados pixel a pixel en offscreen canvases
// Jugador: 12x14 con 5 estados de animacion
// Esbirros: 12x12, Boss: 18x18

// --- Utilidad: pintar pixel ---

function px(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

// Aclarar/oscurecer color hex
function mezclarColor(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const nr = Math.min(255, Math.max(0, Math.round(r * factor)));
    const ng = Math.min(255, Math.max(0, Math.round(g * factor)));
    const nb = Math.min(255, Math.max(0, Math.round(b * factor)));
    return '#' + ((1 << 24) | (nr << 16) | (ng << 8) | nb).toString(16).slice(1);
}

// --- Sprites del jugador ---

let spritesJugador = null; // { idle: [canvas,canvas], correr: [4], saltar: [1], caer: [1], golpeado: [1] }

function generarSpriteJugador(color, estado, frame) {
    const c = document.createElement('canvas');
    c.width = 12;
    c.height = 14;
    const ctx = c.getContext('2d');

    const claro = mezclarColor(color, 1.3);
    const oscuro = mezclarColor(color, 0.7);
    const ojoBlanco = '#ffffff';
    const pupila = '#111111';

    // Offset vertical para animacion de respiracion (idle)
    const offY = estado === 'idle' && frame === 1 ? -1 : 0;

    // Cabeza (4x4, centrada en x=4..7, y=0..3)
    const headY = 0 + offY;
    for (let hy = 0; hy < 4; hy++) {
        for (let hx = 4; hx < 8; hx++) {
            px(ctx, hx, headY + hy, hy === 0 ? claro : color);
        }
    }
    // Pelo encima
    px(ctx, 4, headY, oscuro);
    px(ctx, 5, headY, oscuro);
    px(ctx, 6, headY, oscuro);
    px(ctx, 7, headY, oscuro);

    // Cara (ojos en fila 2): blanco - pupila - blanco
    px(ctx, 5, headY + 2, ojoBlanco);
    px(ctx, 6, headY + 2, pupila);
    px(ctx, 7, headY + 2, ojoBlanco);

    // Cuerpo (6x5, x=3..8, y=4..8)
    const bodyY = 4 + offY;
    for (let by = 0; by < 5; by++) {
        for (let bx = 3; bx < 9; bx++) {
            px(ctx, bx, bodyY + by, by === 0 ? claro : color);
        }
    }

    // Brazos
    if (estado === 'saltar') {
        // Brazos arriba
        px(ctx, 2, bodyY, color);
        px(ctx, 2, bodyY - 1, color);
        px(ctx, 9, bodyY, color);
        px(ctx, 9, bodyY - 1, color);
    } else if (estado === 'caer') {
        // Brazos extendidos
        px(ctx, 1, bodyY + 1, color);
        px(ctx, 2, bodyY + 1, color);
        px(ctx, 9, bodyY + 1, color);
        px(ctx, 10, bodyY + 1, color);
    } else if (estado === 'golpeado') {
        // Brazos encogidos
        px(ctx, 2, bodyY + 2, color);
        px(ctx, 9, bodyY + 2, color);
    } else {
        // Brazos normales (idle/correr)
        const brazoOff = estado === 'correr' ? (frame % 2 === 0 ? 0 : 1) : 0;
        px(ctx, 2, bodyY + 1 + brazoOff, color);
        px(ctx, 9, bodyY + 1 - brazoOff, color);
    }

    // Piernas (2x4 cada una, y=9..13)
    const legY = 9 + offY;
    if (estado === 'correr') {
        // Walk cycle: 4 frames
        const paso = frame % 4;
        if (paso === 0) {
            // Pierna izq adelante, derecha atras
            px(ctx, 4, legY, oscuro);
            px(ctx, 4, legY + 1, oscuro);
            px(ctx, 4, legY + 2, oscuro);
            px(ctx, 4, legY + 3, oscuro);
            px(ctx, 5, legY, oscuro);
            px(ctx, 7, legY, oscuro);
            px(ctx, 7, legY + 1, oscuro);
            px(ctx, 7, legY + 2, oscuro);
        } else if (paso === 1) {
            // Ambas centradas
            px(ctx, 4, legY, oscuro);
            px(ctx, 4, legY + 1, oscuro);
            px(ctx, 4, legY + 2, oscuro);
            px(ctx, 4, legY + 3, oscuro);
            px(ctx, 5, legY, oscuro);
            px(ctx, 5, legY + 1, oscuro);
            px(ctx, 6, legY, oscuro);
            px(ctx, 6, legY + 1, oscuro);
            px(ctx, 6, legY + 2, oscuro);
            px(ctx, 6, legY + 3, oscuro);
            px(ctx, 7, legY, oscuro);
            px(ctx, 7, legY + 1, oscuro);
        } else if (paso === 2) {
            // Pierna derecha adelante
            px(ctx, 7, legY, oscuro);
            px(ctx, 7, legY + 1, oscuro);
            px(ctx, 7, legY + 2, oscuro);
            px(ctx, 7, legY + 3, oscuro);
            px(ctx, 6, legY, oscuro);
            px(ctx, 4, legY, oscuro);
            px(ctx, 4, legY + 1, oscuro);
            px(ctx, 4, legY + 2, oscuro);
        } else {
            // Paso transicion
            px(ctx, 4, legY, oscuro);
            px(ctx, 4, legY + 1, oscuro);
            px(ctx, 4, legY + 2, oscuro);
            px(ctx, 4, legY + 3, oscuro);
            px(ctx, 5, legY, oscuro);
            px(ctx, 5, legY + 1, oscuro);
            px(ctx, 6, legY, oscuro);
            px(ctx, 6, legY + 1, oscuro);
            px(ctx, 6, legY + 2, oscuro);
            px(ctx, 6, legY + 3, oscuro);
            px(ctx, 7, legY, oscuro);
            px(ctx, 7, legY + 1, oscuro);
        }
    } else if (estado === 'saltar') {
        // Piernas juntas
        px(ctx, 5, legY, oscuro);
        px(ctx, 5, legY + 1, oscuro);
        px(ctx, 5, legY + 2, oscuro);
        px(ctx, 6, legY, oscuro);
        px(ctx, 6, legY + 1, oscuro);
        px(ctx, 6, legY + 2, oscuro);
    } else if (estado === 'caer') {
        // Piernas abiertas
        px(ctx, 3, legY, oscuro);
        px(ctx, 3, legY + 1, oscuro);
        px(ctx, 4, legY + 1, oscuro);
        px(ctx, 4, legY + 2, oscuro);
        px(ctx, 7, legY, oscuro);
        px(ctx, 7, legY + 1, oscuro);
        px(ctx, 8, legY + 1, oscuro);
        px(ctx, 8, legY + 2, oscuro);
    } else if (estado === 'golpeado') {
        // Piernas encogidas
        px(ctx, 4, legY, oscuro);
        px(ctx, 5, legY, oscuro);
        px(ctx, 6, legY, oscuro);
        px(ctx, 7, legY, oscuro);
        px(ctx, 4, legY + 1, oscuro);
        px(ctx, 7, legY + 1, oscuro);
    } else {
        // Idle: piernas rectas
        px(ctx, 4, legY, oscuro);
        px(ctx, 4, legY + 1, oscuro);
        px(ctx, 4, legY + 2, oscuro);
        px(ctx, 4, legY + 3, oscuro);
        px(ctx, 5, legY, oscuro);
        px(ctx, 6, legY, oscuro);
        px(ctx, 7, legY, oscuro);
        px(ctx, 7, legY + 1, oscuro);
        px(ctx, 7, legY + 2, oscuro);
        px(ctx, 7, legY + 3, oscuro);
    }

    return c;
}

export function iniciarSpritesJugador(colorBase) {
    spritesJugador = {
        idle: [
            generarSpriteJugador(colorBase, 'idle', 0),
            generarSpriteJugador(colorBase, 'idle', 1),
        ],
        correr: [
            generarSpriteJugador(colorBase, 'correr', 0),
            generarSpriteJugador(colorBase, 'correr', 1),
            generarSpriteJugador(colorBase, 'correr', 2),
            generarSpriteJugador(colorBase, 'correr', 3),
        ],
        saltar: [generarSpriteJugador(colorBase, 'saltar', 0)],
        caer: [generarSpriteJugador(colorBase, 'caer', 0)],
        golpeado: [generarSpriteJugador(colorBase, 'golpeado', 0)],
    };
}

export function obtenerSpriteJugador(estado, frameIndex) {
    if (!spritesJugador || !spritesJugador[estado]) return null;
    const frames = spritesJugador[estado];
    return frames[frameIndex % frames.length];
}

// --- Sprites de enemigos ---

let spritesEsbirros = null; // Map: colorKey → { idle: [2], patrulla: [2] }
let spritesBoss = null; // Map: faseKey → { idle: [2] }

function generarSpriteEnemigo(ancho, alto, color, estado, frame) {
    const c = document.createElement('canvas');
    c.width = ancho;
    c.height = alto;
    const ctx = c.getContext('2d');

    const claro = mezclarColor(color, 1.3);
    const oscuro = mezclarColor(color, 0.7);

    // Cuerpo principal
    const margenX = 1;
    const margenY = 1;
    for (let by = margenY; by < alto - margenY; by++) {
        for (let bx = margenX; bx < ancho - margenX; bx++) {
            px(ctx, bx, by, by === margenY ? claro : color);
        }
    }

    // Sombra inferior
    for (let bx = margenX; bx < ancho - margenX; bx++) {
        px(ctx, bx, alto - margenY - 1, oscuro);
    }

    // Ojos (en el tercio superior)
    const ojoY = Math.floor(alto * 0.3);
    const ojoIzq = Math.floor(ancho * 0.3);
    const ojoDer = Math.floor(ancho * 0.65);
    px(ctx, ojoIzq, ojoY, '#ffffff');
    px(ctx, ojoIzq + 1, ojoY, '#ffffff');
    px(ctx, ojoDer, ojoY, '#ffffff');
    px(ctx, ojoDer + 1, ojoY, '#ffffff');
    // Pupilas
    px(ctx, ojoIzq + 1, ojoY, '#111111');
    px(ctx, ojoDer, ojoY, '#111111');

    // Animacion idle: ligero movimiento
    if (estado === 'idle' && frame === 1) {
        // Patitas visibles
        px(ctx, margenX + 1, alto - 1, oscuro);
        px(ctx, ancho - margenX - 2, alto - 1, oscuro);
    }

    // Animacion patrulla
    if (estado === 'patrulla') {
        const legOff = frame % 2;
        px(ctx, margenX + legOff, alto - 1, oscuro);
        px(ctx, ancho - margenX - 1 - legOff, alto - 1, oscuro);
    }

    return c;
}

export function obtenerSpriteEnemigo(color, ancho, alto, esBoss, estado, frameIndex) {
    const key = color + '_' + ancho + '_' + estado;
    const cache = esBoss ? spritesBoss : spritesEsbirros;
    if (!cache) return null;

    if (!cache[key]) {
        // Generar sprites bajo demanda
        cache[key] = [
            generarSpriteEnemigo(ancho, alto, color, estado, 0),
            generarSpriteEnemigo(ancho, alto, color, estado, 1),
        ];
    }

    return cache[key][frameIndex % cache[key].length];
}

export function iniciarSpritesEnemigos() {
    spritesEsbirros = {};
    spritesBoss = {};
}

// Colores de boss por fase
export function obtenerColorBossFase(ratio) {
    if (ratio <= 0.33) return '#e94560'; // rojo
    if (ratio <= 0.66) return '#f0a030'; // naranja
    return '#bb86fc'; // violeta normal
}

export function limpiarSprites() {
    spritesJugador = null;
    spritesEsbirros = null;
    spritesBoss = null;
}
