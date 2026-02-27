// El Duelo — Sistema de partículas
// Emisores para impacto de golpe, bloqueo, KO, y aura

import { CFG } from './config.js';

const SUELO_Y = CFG.arena.sueloY;

function hexARgb(hex) {
    if (!hex || hex.length < 7) return { r: 200, g: 100, b: 255 };
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    };
}

// --- Partículas ---

const particulas = [];
const MAX_PARTICULAS = 200;

function emitir(x, y, cantidad, cfg) {
    for (let i = 0; i < cantidad && particulas.length < MAX_PARTICULAS; i++) {
        const angulo = Math.random() * Math.PI * 2;
        const vel = cfg.velMin + Math.random() * (cfg.velMax - cfg.velMin);
        particulas.push({
            x: x + (Math.random() - 0.5) * (cfg.spread || 4),
            y: y + (Math.random() - 0.5) * (cfg.spread || 4),
            vx: Math.cos(angulo) * vel,
            vy: Math.sin(angulo) * vel - (cfg.uplift || 0),
            vida: cfg.vidaMin + Math.random() * (cfg.vidaMax - cfg.vidaMin),
            vidaMax: cfg.vidaMax,
            r: cfg.r,
            g: cfg.g,
            b: cfg.b,
            tam: cfg.tamMin + Math.random() * (cfg.tamMax - cfg.tamMin),
            gravedad: cfg.gravedad || 0,
            friccion: cfg.friccion || 0.98,
            tipo: cfg.tipo || 'cuadrado',
        });
    }
}

/**
 * Emite partículas de aura orbitando alrededor de un luchador
 */
export function emitirAura(l) {
    if (Math.random() > 0.3) return; // 30% prob por frame

    const cx = l.x + l.ancho / 2;
    const cy = l.y + l.alto * 0.5;
    const dist = Math.max(l.ancho, l.alto) * 0.6;
    const angulo = Math.random() * Math.PI * 2;

    const { r, g, b } = hexARgb(l.colorHud);

    // Posición orbital
    const px = cx + Math.cos(angulo) * dist;
    const py = cy + Math.sin(angulo) * dist;

    // Velocidad tangencial suave
    const tang = 0.3 + Math.random() * 0.3;

    particulas.push({
        x: px,
        y: py,
        vx: -Math.sin(angulo) * tang,
        vy: Math.cos(angulo) * tang * 0.5 - 0.15,
        vida: 15 + Math.random() * 10,
        vidaMax: 25,
        r,
        g,
        b,
        tam: 1.5 + Math.random(),
        gravedad: 0,
        friccion: 0.97,
        tipo: 'aura',
    });
}

/**
 * Emite partículas de impacto de golpe
 */
export function emitirImpacto(x, y, r, g, b) {
    emitir(x, y, 12, {
        r,
        g,
        b,
        velMin: 1,
        velMax: 3,
        vidaMin: 10,
        vidaMax: 25,
        tamMin: 1.5,
        tamMax: 3,
        uplift: 1,
        spread: 6,
        gravedad: 0.08,
        friccion: 0.95,
        tipo: 'chispa',
    });
    // Chispas blancas
    emitir(x, y, 5, {
        r: 255,
        g: 255,
        b: 255,
        velMin: 2,
        velMax: 4,
        vidaMin: 5,
        vidaMax: 12,
        tamMin: 1,
        tamMax: 2,
        spread: 3,
        friccion: 0.92,
        tipo: 'chispa',
    });
}

/**
 * Emite partículas de bloqueo (escudo)
 */
export function emitirBloqueo(x, y) {
    emitir(x, y, 8, {
        r: 200,
        g: 220,
        b: 255,
        velMin: 0.5,
        velMax: 2,
        vidaMin: 8,
        vidaMax: 18,
        tamMin: 1,
        tamMax: 2.5,
        uplift: 0.5,
        spread: 8,
        friccion: 0.96,
        tipo: 'aura',
    });
}

/**
 * Emite partículas de KO (explosión grande)
 */
export function emitirKO(x, y) {
    // Explosión naranja/roja — chispas
    emitir(x, y, 25, {
        r: 255,
        g: 140,
        b: 40,
        velMin: 1.5,
        velMax: 5,
        vidaMin: 15,
        vidaMax: 40,
        tamMin: 2,
        tamMax: 5,
        uplift: 2,
        spread: 10,
        gravedad: 0.05,
        friccion: 0.94,
        tipo: 'chispa',
    });
    // Estrellas blancas — aura
    emitir(x, y, 10, {
        r: 255,
        g: 255,
        b: 220,
        velMin: 2,
        velMax: 6,
        vidaMin: 10,
        vidaMax: 30,
        tamMin: 1.5,
        tamMax: 3.5,
        spread: 6,
        friccion: 0.93,
        tipo: 'aura',
    });
}

/**
 * Actualiza todas las partículas
 */
export function actualizarParticulas(dt) {
    for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];
        p.vx *= p.friccion;
        p.vy *= p.friccion;
        p.vy += p.gravedad * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vida -= dt;

        // Rebote en el suelo
        if (p.gravedad > 0 && p.y >= SUELO_Y && p.vy > 0) {
            p.y = SUELO_Y;
            p.vy *= -0.4;
        }

        if (p.vida <= 0) {
            particulas.splice(i, 1);
        }
    }
}

/**
 * Renderiza todas las partículas en el canvas
 */
export function renderizarParticulas(ctx) {
    for (let i = 0; i < particulas.length; i++) {
        const p = particulas[i];
        const alpha = Math.max(0, p.vida / p.vidaMax);
        const tam = p.tam * (0.5 + alpha * 0.5);

        ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + alpha + ')';

        if (p.tipo === 'aura' || p.tipo === 'chispa') {
            // Círculo suave
            ctx.beginPath();
            ctx.arc(Math.round(p.x), Math.round(p.y), tam, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Cuadrado (default)
            ctx.fillRect(Math.round(p.x - tam / 2), Math.round(p.y - tam / 2), tam, tam);
        }
    }
}

// --- Proyectiles (orbes de energía) ---

const proyectiles = [];

/**
 * Lanza un proyectil visual desde el atacante hacia el defensor.
 * Solo se emite si el ataque actual es de arquetipo 'proyectil'.
 */
export function emitirProyectil(atacante, defensor) {
    const esRapido = atacante.tipoAtaque === 'rapido';
    const idx = esRapido ? 0 : Math.min(1, atacante.ataquesDatos.length - 1);
    const ataque = atacante.ataquesDatos[idx];
    if (!ataque || ataque.arquetipo !== 'proyectil') return;

    const { r, g, b } = hexARgb(ataque.color || atacante.colorHud);

    // Inicio: frente del atacante
    const sx = atacante.direccion > 0 ? atacante.x + atacante.ancho + 2 : atacante.x - 2;
    const sy = atacante.y + atacante.alto * 0.4;

    // Destino: centro del defensor
    const tx = defensor.x + defensor.ancho / 2;
    const duracion = esRapido ? CFG.combate.ataqueRapidoDuracion : CFG.combate.ataqueFuerteDuracion;
    const dist = tx - sx;
    const vx = dist / (duracion * 0.55);

    proyectiles.push({
        x: sx,
        y: sy,
        vx,
        r,
        g,
        b,
        radio: esRapido ? 3 : 4.5,
        vida: duracion * 0.7,
        vidaMax: duracion * 0.7,
    });
}

/**
 * Actualiza proyectiles y emite partículas de estela
 */
export function actualizarProyectiles(dt) {
    for (let i = proyectiles.length - 1; i >= 0; i--) {
        const p = proyectiles[i];
        p.x += p.vx * dt;
        p.vida -= dt;

        // Estela de partículas
        if (Math.random() > 0.4) {
            emitir(p.x, p.y, 1, {
                r: p.r,
                g: p.g,
                b: p.b,
                velMin: 0.1,
                velMax: 0.4,
                vidaMin: 4,
                vidaMax: 8,
                tamMin: 1,
                tamMax: 1.5,
                spread: 2,
                friccion: 0.94,
                tipo: 'aura',
            });
        }

        if (p.vida <= 0) {
            proyectiles.splice(i, 1);
        }
    }
}

/**
 * Renderiza proyectiles como orbes brillantes con halo
 */
export function renderizarProyectiles(ctx) {
    for (let i = 0; i < proyectiles.length; i++) {
        const p = proyectiles[i];
        const alpha = Math.max(0.3, p.vida / p.vidaMax);
        const px = Math.round(p.x);
        const py = Math.round(p.y);

        // Halo exterior
        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.radio * 2.5);
        grad.addColorStop(0, 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + alpha * 0.4 + ')');
        grad.addColorStop(1, 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, p.radio * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo coloreado
        ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + alpha + ')';
        ctx.beginPath();
        ctx.arc(px, py, p.radio, 0, Math.PI * 2);
        ctx.fill();

        // Centro brillante
        ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
        ctx.beginPath();
        ctx.arc(px, py, p.radio * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function limpiarParticulas() {
    particulas.length = 0;
    proyectiles.length = 0;
}
