// El Duelo — Renderizado del canvas
// Arena plana, luchadores con sprites, efectos de pantallas VS/countdown/resultado

import { CFG } from './config.js';
import { obtenerSprite } from './spritesDuelo.js';

const RND = CFG.render;
const ARENA = CFG.arena;

function hexARgb(hex) {
    if (!hex || hex.length < 7) return { r: 200, g: 100, b: 255 };
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    };
}

// --- Aura radial detrás de cada luchador ---

function renderizarAura(ctx, l) {
    const cx = l.x + l.ancho / 2;
    const cy = l.y + l.alto * 0.5;
    const pulso = 1 + 0.15 * Math.sin(Date.now() * 0.004);
    const radio = l.alto * 0.6 * pulso;
    const { r, g, b } = hexARgb(l.colorHud);

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radio);
    grad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',0.15)');
    grad.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radio, 0, Math.PI * 2);
    ctx.fill();
}

// --- Efecto visual del arco de ataque ---

function renderizarAtaque(ctx, l) {
    if (l.estado !== 'atacando' || !l.tipoAtaque) return;
    const duracion =
        l.tipoAtaque === 'rapido'
            ? CFG.combate.ataqueRapidoDuracion
            : CFG.combate.ataqueFuerteDuracion;
    const progreso = 1 - l.ataqueTimer / duracion;
    if (progreso < 0.2 || progreso > 0.8) return;

    const radio = l.tipoAtaque === 'rapido' ? 20 : 28;
    const alpha = 0.25 * (1 - progreso);
    const { r, g, b } = hexARgb(l.colorHud);

    // Centro del arco: frente al luchador (ya está flippeado por el ctx)
    const ax = l.x + l.ancho;
    const ay = l.y + l.alto * 0.4;

    ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    ctx.beginPath();
    ctx.arc(ax, ay, radio, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
}

// --- Flash de pantalla al golpear ---

function renderizarFlash(ctx, ancho, alto, flashAlpha) {
    if (flashAlpha <= 0.01) return;
    ctx.fillStyle = 'rgba(255,255,255,' + flashAlpha + ')';
    ctx.fillRect(0, 0, ancho, alto);
}

// --- Fondo y arena ---

function renderizarArena(ctx, ancho, alto) {
    // Fondo degradado
    const grad = ctx.createLinearGradient(0, 0, 0, alto);
    grad.addColorStop(0, RND.colorFondo);
    grad.addColorStop(0.7, '#1a0d2a');
    grad.addColorStop(1, RND.colorSuelo);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, ancho, alto);

    // Suelo
    ctx.fillStyle = RND.colorSuelo;
    ctx.fillRect(0, ARENA.sueloY, ancho, alto - ARENA.sueloY);

    // Línea de borde superior del suelo
    ctx.fillStyle = RND.colorArenaClaro || '#3d2560';
    ctx.fillRect(0, ARENA.sueloY, ancho, 2);

    // Marcas decorativas del suelo
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let x = ARENA.limiteIzq; x < ARENA.limiteDer; x += 40) {
        ctx.fillRect(x, ARENA.sueloY + 8, 20, 1);
    }
}

// --- Escudo de bloqueo ---

function renderizarEscudo(ctx, l) {
    const rx = l.alto * 0.22; // estrecho: pasa cerca del cuerpo
    const ry = l.alto * 0.5; // alto: cubre bien verticalmente
    // Frente del luchador (tras el flip del ctx, siempre queda hacia el rival)
    const ex = l.x + l.ancho;
    const ey = l.y + l.alto * 0.5;
    const pulso = 0.7 + 0.3 * Math.sin(Date.now() * 0.008);
    const color = l.colorHud || '#5eeadb';

    ctx.save();
    ctx.globalAlpha = pulso;

    // Relleno con gradiente radial (elíptico via escala)
    const grad = ctx.createRadialGradient(ex, ey, 0, ex, ey, ry);
    grad.addColorStop(0, color + '2E'); // alpha ~0.18
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(ex, ey, rx, ry, 0, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    // Borde
    ctx.strokeStyle = color + '66'; // alpha ~0.4
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(ex, ey, rx, ry, 0, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    ctx.restore();
}

// --- Luchador ---

function renderizarLuchador(ctx, l) {
    const sprite = obtenerSprite(l);

    // Aura radial siempre visible (detrás del sprite)
    renderizarAura(ctx, l);

    // Parpadeo de invulnerabilidad
    if (l.invulFrames > 0 && Math.floor(l.invulFrames) % 4 < 2) return;

    ctx.save();

    // Centro del luchador para voltear según dirección
    const cx = l.x + l.ancho / 2;
    const cy = l.y + l.alto;

    if (sprite) {
        // Renderizar sprite sheet
        const sw = l.spriteW;
        const sh = l.spriteH;
        const dx = cx - sw / 2;
        const dy = cy - sh;

        ctx.translate(cx, 0);
        ctx.scale(l.direccion, 1);
        ctx.translate(-cx, 0);
        ctx.drawImage(sprite, dx, dy, sw, sh);
        if (l.bloqueando) renderizarEscudo(ctx, l);
        renderizarAtaque(ctx, l);
    } else {
        // Fallback procedural: rectángulo coloreado
        const color = l.colorHud || (l.esVillano ? '#e94560' : '#5eeadb');
        ctx.translate(cx, 0);
        ctx.scale(l.direccion, 1);
        ctx.translate(-cx, 0);

        // Cuerpo
        ctx.fillStyle = color;
        ctx.fillRect(l.x, l.y, l.ancho, l.alto);

        // Ojos
        const ojoY = l.y + l.alto * 0.25;
        const ojoIzq = l.x + l.ancho * 0.3;
        const ojoDer = l.x + l.ancho * 0.6;
        ctx.fillStyle = '#fff';
        ctx.fillRect(ojoIzq, ojoY, 3, 3);
        ctx.fillRect(ojoDer, ojoY, 3, 3);
        ctx.fillStyle = '#111';
        ctx.fillRect(ojoIzq + 1, ojoY + 1, 1, 1);
        ctx.fillRect(ojoDer + 1, ojoY + 1, 1, 1);

        // Indicador de estado
        if (l.estado === 'atacando') {
            // Brazo de ataque
            const brazoX = l.direccion > 0 ? l.x + l.ancho : l.x - 8;
            ctx.fillStyle = color;
            ctx.fillRect(brazoX, l.y + l.alto * 0.3, 8, 4);
        }
        if (l.bloqueando) renderizarEscudo(ctx, l);
        renderizarAtaque(ctx, l);
    }

    ctx.restore();

    // Sombra en el suelo
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    const sombra = l.ancho * 0.8;
    ctx.beginPath();
    ctx.ellipse(cx, ARENA.sueloY + 2, sombra / 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
}

// --- Countdown ---

function renderizarCountdown(ctx, ancho, alto, timer) {
    const segundos = Math.ceil(timer / 60);
    const texto = segundos > 0 ? String(segundos) : CFG.textos.pelea;

    // Pulso de escala
    const progreso = (timer % 60) / 60;
    const escala = 1 + progreso * 0.3;

    ctx.save();
    ctx.translate(ancho / 2, alto / 2);
    ctx.scale(escala, escala);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f0e6d3';
    ctx.font = 'bold 48px sans-serif';
    ctx.globalAlpha = 0.5 + progreso * 0.5;
    ctx.fillText(texto, 0, 0);
    ctx.restore();
}

// --- Resultado ---

function renderizarResultado(ctx, ancho, alto, est) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, ancho, alto);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 28px sans-serif';

    let texto;
    let color;
    if (est.ganador === 'jugador') {
        texto = CFG.textos.victoria;
        color = est.luchador1.colorHud || '#5eeadb';
    } else if (est.ganador === 'enemigo') {
        texto = CFG.textos.derrota;
        color = '#e94560';
    } else {
        texto = CFG.textos.tiempoAgotado;
        color = '#f0e6d3';
    }

    ctx.fillStyle = color;
    ctx.fillText(texto, ancho / 2, alto / 2 - 10);

    // Subtexto con nombre del ganador
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#f0e6d3';
    ctx.globalAlpha = 0.7;
    if (est.ganador === 'jugador') {
        ctx.fillText(est.luchador1.nombre + ' gana', ancho / 2, alto / 2 + 20);
    } else if (est.ganador === 'enemigo') {
        ctx.fillText(est.luchador2.nombre + ' gana', ancho / 2, alto / 2 + 20);
    } else {
        ctx.fillText('Empate', ancho / 2, alto / 2 + 20);
    }
    ctx.restore();
}

// --- Escena completa ---

export function renderizarEscena(ctx, ancho, alto, est) {
    // Limpiar
    ctx.clearRect(0, 0, ancho, alto);

    // Arena y luchadores siempre visibles
    renderizarArena(ctx, ancho, alto);

    if (est.luchador1) renderizarLuchador(ctx, est.luchador1);
    if (est.luchador2) renderizarLuchador(ctx, est.luchador2);

    // Flash de impacto (entre luchadores y overlays)
    if (est.flashAlpha > 0) {
        renderizarFlash(ctx, ancho, alto, est.flashAlpha);
    }

    // Overlays según fase
    if (est.fase === 'countdown') {
        renderizarCountdown(ctx, ancho, alto, est.faseTimer);
    } else if (est.fase === 'resultado') {
        renderizarResultado(ctx, ancho, alto, est);
    }
}
