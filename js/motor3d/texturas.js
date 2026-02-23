// Motor 3D — Generación procedural de texturas (offscreen canvases 64x64)

import { TEX_SIZE } from './config.js';

// --- Ruido procedural ---

// Hash simple para ruido reproducible
function hash(x, y, seed) {
    let h = seed + x * 374761393 + y * 668265263;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h = h ^ (h >>> 16);
    return (h & 0x7fffffff) / 0x7fffffff;
}

// Ruido de valor con interpolación bilineal suavizada
function valueNoise(x, y, escala, seed) {
    const sx = x / escala;
    const sy = y / escala;
    const ix = Math.floor(sx);
    const iy = Math.floor(sy);
    const fx = sx - ix;
    const fy = sy - iy;

    // Suavizado Hermite
    const u = fx * fx * (3 - 2 * fx);
    const v = fy * fy * (3 - 2 * fy);

    const a = hash(ix, iy, seed);
    const b = hash(ix + 1, iy, seed);
    const c = hash(ix, iy + 1, seed);
    const d = hash(ix + 1, iy + 1, seed);

    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

// Fractal Brownian Motion (ruido multicapa)
function fbm(x, y, octavas, escala, seed) {
    let valor = 0;
    let amplitud = 1;
    let frecuencia = 1;
    let max = 0;

    for (let i = 0; i < octavas; i++) {
        valor += valueNoise(x * frecuencia, y * frecuencia, escala, seed + i * 100) * amplitud;
        max += amplitud;
        amplitud *= 0.5;
        frecuencia *= 2;
    }

    return valor / max;
}

// --- Generadores de textura ---

// Piedra: grises fríos azulados con grietas oscuras
function generarPiedra() {
    const c = document.createElement('canvas');
    c.width = TEX_SIZE;
    c.height = TEX_SIZE;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(TEX_SIZE, TEX_SIZE);

    for (let y = 0; y < TEX_SIZE; y++) {
        for (let x = 0; x < TEX_SIZE; x++) {
            const idx = (y * TEX_SIZE + x) * 4;
            const n = fbm(x, y, 4, 16, 42);

            // Grietas donde el ruido secundario es bajo
            const grieta = fbm(x, y, 2, 8, 137);
            const factorGrieta = grieta < 0.3 ? 0.55 : 1.0;

            const base = 70 + n * 60;
            const val = base * factorGrieta;

            // Gris frío azulado
            img.data[idx] = Math.floor(val * 0.75);
            img.data[idx + 1] = Math.floor(val * 0.78);
            img.data[idx + 2] = Math.floor(val * 0.85);
            img.data[idx + 3] = 255;
        }
    }

    ctx.putImageData(img, 0, 0);
    return c;
}

// Ladrillo: patrón regular con mortero gris claro y cuerpo terracota
function generarLadrillo() {
    const c = document.createElement('canvas');
    c.width = TEX_SIZE;
    c.height = TEX_SIZE;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(TEX_SIZE, TEX_SIZE);

    const anchoLadrillo = 16;
    const altoLadrillo = 8;
    const mortero = 1;

    for (let y = 0; y < TEX_SIZE; y++) {
        for (let x = 0; x < TEX_SIZE; x++) {
            const idx = (y * TEX_SIZE + x) * 4;

            const fila = Math.floor(y / altoLadrillo);
            const offset = fila % 2 === 0 ? 0 : anchoLadrillo / 2;
            const bx = (x + offset) % anchoLadrillo;
            const by = y % altoLadrillo;
            const esMortero = bx < mortero || by < mortero;

            if (esMortero) {
                // Mortero gris claro
                const n = valueNoise(x, y, 8, 200);
                const val = 40 + n * 20;
                img.data[idx] = Math.floor(val * 0.85);
                img.data[idx + 1] = Math.floor(val * 0.82);
                img.data[idx + 2] = Math.floor(val * 0.78);
            } else {
                // Cuerpo terracota
                const n = fbm(x, y, 2, 12, 99);
                const ladrilloN = hash(Math.floor((x + offset) / anchoLadrillo), fila, 77);
                const base = 70 + ladrilloN * 40;
                img.data[idx] = Math.min(255, Math.floor((base + n * 15) * 1.1));
                img.data[idx + 1] = Math.floor((base + n * 15) * 0.55);
                img.data[idx + 2] = Math.floor((base + n * 10) * 0.4);
            }
            img.data[idx + 3] = 255;
        }
    }

    ctx.putImageData(img, 0, 0);
    return c;
}

// Musgo: base gris neutro con parches verdes brillantes
function generarMusgo() {
    const c = document.createElement('canvas');
    c.width = TEX_SIZE;
    c.height = TEX_SIZE;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(TEX_SIZE, TEX_SIZE);

    for (let y = 0; y < TEX_SIZE; y++) {
        for (let x = 0; x < TEX_SIZE; x++) {
            const idx = (y * TEX_SIZE + x) * 4;
            const piedra = fbm(x, y, 4, 16, 42);
            const musgo = fbm(x, y, 3, 10, 300);

            const basePiedra = 70 + piedra * 60;

            if (musgo > 0.5) {
                // Parche de musgo verde intenso
                const intensidad = (musgo - 0.5) / 0.5;
                const r = basePiedra * 0.72 * (1 - intensidad) + 20 * intensidad;
                const g = basePiedra * 0.75 * (1 - intensidad) + (70 + piedra * 50) * intensidad;
                const b = basePiedra * 0.72 * (1 - intensidad) + 15 * intensidad;
                img.data[idx] = Math.floor(r);
                img.data[idx + 1] = Math.floor(g);
                img.data[idx + 2] = Math.floor(b);
            } else {
                // Base gris neutro
                img.data[idx] = Math.floor(basePiedra * 0.72);
                img.data[idx + 1] = Math.floor(basePiedra * 0.75);
                img.data[idx + 2] = Math.floor(basePiedra * 0.72);
            }
            img.data[idx + 3] = 255;
        }
    }

    ctx.putImageData(img, 0, 0);
    return c;
}

// Tierra: marrones saturados con variación
function generarTierra() {
    const c = document.createElement('canvas');
    c.width = TEX_SIZE;
    c.height = TEX_SIZE;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(TEX_SIZE, TEX_SIZE);

    for (let y = 0; y < TEX_SIZE; y++) {
        for (let x = 0; x < TEX_SIZE; x++) {
            const idx = (y * TEX_SIZE + x) * 4;
            const n = fbm(x, y, 3, 12, 500);
            const detalle = valueNoise(x, y, 4, 550);

            const base = 50 + n * 45;
            img.data[idx] = Math.floor(base * 0.72 + detalle * 10);
            img.data[idx + 1] = Math.floor(base * 0.48 + detalle * 8);
            img.data[idx + 2] = Math.floor(base * 0.28 + detalle * 4);
            img.data[idx + 3] = 255;
        }
    }

    ctx.putImageData(img, 0, 0);
    return c;
}

// Cueva: FBM 5 octavas con cavidades oscuras, paleta gris-marrón fría
function generarCueva() {
    const c = document.createElement('canvas');
    c.width = TEX_SIZE;
    c.height = TEX_SIZE;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(TEX_SIZE, TEX_SIZE);

    for (let y = 0; y < TEX_SIZE; y++) {
        for (let x = 0; x < TEX_SIZE; x++) {
            const idx = (y * TEX_SIZE + x) * 4;
            const n = fbm(x, y, 5, 14, 600);

            // Cavidades oscuras donde el ruido es bajo
            const factor = n < 0.25 ? 0.4 : 1.0;
            const base = 55 + n * 50;
            const val = base * factor;

            // Gris-marrón frío
            img.data[idx] = Math.floor(val * 0.68);
            img.data[idx + 1] = Math.floor(val * 0.65);
            img.data[idx + 2] = Math.floor(val * 0.7);
            img.data[idx + 3] = 255;
        }
    }

    ctx.putImageData(img, 0, 0);
    return c;
}

// Piedra tallada: bloques 16×16 con bordes cincelados (bisel 3D)
function generarPiedraTallada() {
    const c = document.createElement('canvas');
    c.width = TEX_SIZE;
    c.height = TEX_SIZE;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(TEX_SIZE, TEX_SIZE);

    const tamBloque = 16;
    const bisel = 2;

    for (let y = 0; y < TEX_SIZE; y++) {
        for (let x = 0; x < TEX_SIZE; x++) {
            const idx = (y * TEX_SIZE + x) * 4;
            const bx = x % tamBloque;
            const by = y % tamBloque;

            // Ruido base para variación sutil
            const n = fbm(x, y, 3, 20, 700);
            const base = 75 + n * 35;

            let val;
            if (bx < 1 || by < 1) {
                // Junta entre bloques (oscura)
                val = base * 0.4;
            } else if (bx < bisel + 1 || by < bisel + 1) {
                // Borde superior-izquierdo (claro — luz)
                val = base * 1.15;
            } else if (bx >= tamBloque - bisel || by >= tamBloque - bisel) {
                // Borde inferior-derecho (oscuro — sombra)
                val = base * 0.65;
            } else {
                // Cara del bloque
                val = base;
            }

            // Gris neutro
            img.data[idx] = Math.floor(val * 0.78);
            img.data[idx + 1] = Math.floor(val * 0.76);
            img.data[idx + 2] = Math.floor(val * 0.74);
            img.data[idx + 3] = 255;
        }
    }

    ctx.putImageData(img, 0, 0);
    return c;
}

// Cristales: roca oscura con incrustaciones cyan/violeta brillantes
function generarCristales() {
    const c = document.createElement('canvas');
    c.width = TEX_SIZE;
    c.height = TEX_SIZE;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(TEX_SIZE, TEX_SIZE);

    for (let y = 0; y < TEX_SIZE; y++) {
        for (let x = 0; x < TEX_SIZE; x++) {
            const idx = (y * TEX_SIZE + x) * 4;
            const n = fbm(x, y, 4, 12, 800);
            const cristal = fbm(x, y, 3, 8, 850);

            // Roca base oscura
            const base = 40 + n * 35;

            if (cristal > 0.65) {
                // Incrustación de cristal: mezcla cyan/violeta según ruido terciario
                const tipo = fbm(x, y, 2, 6, 900);
                const intensidad = (cristal - 0.65) / 0.35;

                if (tipo > 0.5) {
                    // Cristal cyan
                    img.data[idx] = Math.floor(base * 0.5 * (1 - intensidad) + 80 * intensidad);
                    img.data[idx + 1] = Math.floor(
                        base * 0.5 * (1 - intensidad) + 200 * intensidad
                    );
                    img.data[idx + 2] = Math.floor(
                        base * 0.6 * (1 - intensidad) + 220 * intensidad
                    );
                } else {
                    // Cristal violeta
                    img.data[idx] = Math.floor(base * 0.5 * (1 - intensidad) + 140 * intensidad);
                    img.data[idx + 1] = Math.floor(base * 0.5 * (1 - intensidad) + 60 * intensidad);
                    img.data[idx + 2] = Math.floor(
                        base * 0.6 * (1 - intensidad) + 200 * intensidad
                    );
                }
            } else {
                // Roca oscura
                img.data[idx] = Math.floor(base * 0.55);
                img.data[idx + 1] = Math.floor(base * 0.52);
                img.data[idx + 2] = Math.floor(base * 0.6);
            }
            img.data[idx + 3] = 255;
        }
    }

    ctx.putImageData(img, 0, 0);
    return c;
}

// --- Overlays de variación vertical (se hornean en cada textura) ---

// Aplica gradientes de humedad (abajo) y musgo (arriba) sobre una textura generada
function aplicarOverlaysVerticales(canvas) {
    const ctx = canvas.getContext('2d');

    // Humedad: transparente arriba → verdoso oscuro en el 25% inferior
    const gradH = ctx.createLinearGradient(0, 0, 0, TEX_SIZE);
    gradH.addColorStop(0, 'rgba(15,30,20,0)');
    gradH.addColorStop(0.75, 'rgba(15,30,20,0)');
    gradH.addColorStop(1, 'rgba(15,30,20,0.35)');
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);

    // Musgo superior: verde sutil arriba → transparente
    const gradM = ctx.createLinearGradient(0, 0, 0, TEX_SIZE);
    gradM.addColorStop(0, 'rgba(30,60,25,0.25)');
    gradM.addColorStop(0.15, 'rgba(30,60,25,0)');
    gradM.addColorStop(1, 'rgba(30,60,25,0)');
    ctx.fillStyle = gradM;
    ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
}

// --- API pública ---

// Genera todas las texturas del motor (llamar una vez al iniciar)
// Cada textura incluye overlays de humedad/musgo ya horneados
export function generarTexturas() {
    const piedra = generarPiedra();
    const ladrillo = generarLadrillo();
    const musgo = generarMusgo();
    const tierra = generarTierra();
    const cueva = generarCueva();
    const piedraTallada = generarPiedraTallada();
    const cristales = generarCristales();

    // Hornear overlays verticales en cada textura (evita drawImage extra por columna)
    const todas = { piedra, ladrillo, musgo, tierra, cueva, piedraTallada, cristales };
    for (const tex of Object.values(todas)) {
        aplicarOverlaysVerticales(tex);
    }

    return todas;
}

// Selecciona textura determinística basada en posición de la celda (sin zonas)
export function obtenerTextura(mapX, mapY, texturas) {
    const h = hash(mapX, mapY, 12345);
    if (h < 0.22) return texturas.piedra;
    if (h < 0.38) return texturas.ladrillo;
    if (h < 0.5) return texturas.musgo;
    if (h < 0.62) return texturas.tierra;
    if (h < 0.76) return texturas.cueva;
    if (h < 0.88) return texturas.piedraTallada;
    return texturas.cristales;
}

// --- Zonas temáticas ---

// BFS desde la entrada para asignar distancia a cada celda, dividir en 3 zonas
// Retorna Uint8Array[filas * cols] con zona 0/1/2 (paredes toman zona del vecino más cercano)
export function calcularZonas(mapa, filas, cols, entradaFila, entradaCol) {
    const zonas = new Uint8Array(filas * cols);
    zonas.fill(255); // 255 = no asignado / pared

    // BFS para calcular distancia desde entrada
    const dist = new Int16Array(filas * cols);
    dist.fill(-1);

    const cola = [entradaFila * cols + entradaCol];
    dist[entradaFila * cols + entradaCol] = 0;
    let maxDist = 0;

    const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    let head = 0;
    while (head < cola.length) {
        const pos = cola[head++];
        const f = Math.floor(pos / cols);
        const c = pos % cols;
        const d = dist[pos];

        for (const [df, dc] of dirs) {
            const nf = f + df;
            const nc = c + dc;
            if (nf < 0 || nf >= filas || nc < 0 || nc >= cols) continue;
            const npos = nf * cols + nc;
            if (dist[npos] !== -1) continue;
            if (mapa[nf][nc] === 1) continue; // Pared

            dist[npos] = d + 1;
            if (d + 1 > maxDist) maxDist = d + 1;
            cola.push(npos);
        }
    }

    // Dividir en tercios por distancia
    const umbral1 = Math.floor(maxDist / 3);
    const umbral2 = Math.floor((maxDist * 2) / 3);

    for (let i = 0; i < filas * cols; i++) {
        if (dist[i] === -1) continue; // Pared o inaccesible
        if (dist[i] <= umbral1)
            zonas[i] = 0; // Mazmorra
        else if (dist[i] <= umbral2)
            zonas[i] = 1; // Cueva
        else zonas[i] = 2; // Profundidades
    }

    // Asignar zona a paredes según vecinos transitables más cercanos
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < cols; c++) {
            const idx = f * cols + c;
            if (zonas[idx] !== 255) continue;

            // Buscar zona del vecino transitable más cercano
            let mejorZona = 0;
            for (const [df, dc] of dirs) {
                const nf = f + df;
                const nc = c + dc;
                if (nf < 0 || nf >= filas || nc < 0 || nc >= cols) continue;
                const nz = zonas[nf * cols + nc];
                if (nz !== 255 && nz > mejorZona) mejorZona = nz;
            }
            zonas[idx] = mejorZona;
        }
    }

    return zonas;
}

// Texturas dominantes por zona:
// Zona 0 (Mazmorra): ladrillo + piedra tallada
// Zona 1 (Cueva):   cueva + tierra + musgo
// Zona 2 (Profundidades): piedra + cueva + cristales
const TEXTURAS_ZONA = [
    // zona 0 — Mazmorra
    [
        { max: 0.35, tex: 'ladrillo' },
        { max: 0.65, tex: 'piedraTallada' },
        { max: 0.8, tex: 'piedra' },
        { max: 0.92, tex: 'tierra' },
        { max: 1.0, tex: 'musgo' },
    ],
    // zona 1 — Cueva
    [
        { max: 0.35, tex: 'cueva' },
        { max: 0.55, tex: 'tierra' },
        { max: 0.72, tex: 'musgo' },
        { max: 0.88, tex: 'piedra' },
        { max: 1.0, tex: 'ladrillo' },
    ],
    // zona 2 — Profundidades
    [
        { max: 0.3, tex: 'piedra' },
        { max: 0.55, tex: 'cueva' },
        { max: 0.78, tex: 'cristales' },
        { max: 0.9, tex: 'piedraTallada' },
        { max: 1.0, tex: 'tierra' },
    ],
];

// Selecciona textura considerando la zona de la celda
export function obtenerTexturaZona(mapX, mapY, texturas, zonas, cols) {
    const zona = Math.min(zonas[mapY * cols + mapX] || 0, 2);
    const h = hash(mapX, mapY, 12345);
    const tabla = TEXTURAS_ZONA[zona];

    for (const entrada of tabla) {
        if (h < entrada.max) return texturas[entrada.tex];
    }
    return texturas.piedra;
}
