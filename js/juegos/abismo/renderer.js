// Habitacion 4 — El Abismo: Renderizado con texturas, parallax, vineta y HUD mejorado

import { CFG } from './config.js';
import { obtenerTile, obtenerFilas, obtenerColumnas } from './nivel.js';
import { obtenerTextura, hashVariante } from './texturasTiles.js';

const T = CFG.tiles.tipos;
const TAM = CFG.tiles.tamano;
const COL = CFG.render;

// Vineta: offscreen canvas generado una vez
let vinetaCanvas = null;

function generarVineta(ancho, alto) {
    const c = document.createElement('canvas');
    c.width = ancho;
    c.height = alto;
    const ctx = c.getContext('2d');

    const grad = ctx.createRadialGradient(
        ancho / 2,
        alto / 2,
        Math.min(ancho, alto) * 0.35,
        ancho / 2,
        alto / 2,
        Math.max(ancho, alto) * 0.7
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, ancho, alto);
    return c;
}

export function iniciarRenderer(ancho, alto) {
    vinetaCanvas = generarVineta(ancho, alto);
}

export function renderizarTiles(ctx, camaraX, anchoCanvas, altoCanvas, bossVivo, tiempo) {
    const filas = obtenerFilas();
    const cols = obtenerColumnas();

    // Culling: solo dibujar columnas visibles
    const colInicio = Math.max(0, Math.floor(camaraX / TAM));
    const colFin = Math.min(cols, Math.ceil((camaraX + anchoCanvas) / TAM));

    for (let fila = 0; fila < filas; fila++) {
        for (let col = colInicio; col < colFin; col++) {
            const tipo = obtenerTile(fila, col);
            const px = col * TAM - camaraX;
            const py = fila * TAM;

            if (tipo === T.SUELO) {
                const variante = hashVariante(fila, col);
                const tex = obtenerTextura('SUELO', variante);
                if (tex) {
                    ctx.drawImage(tex, px, py);
                } else {
                    ctx.fillStyle = COL.colorSuelo;
                    ctx.fillRect(px, py, TAM, TAM);
                }
            } else if (tipo === T.PLATAFORMA) {
                const variante = hashVariante(fila, col);
                const tex = obtenerTextura('PLATAFORMA', variante);
                if (tex) {
                    ctx.drawImage(tex, px, py);
                } else {
                    ctx.fillStyle = COL.colorPlataforma;
                    ctx.fillRect(px, py, TAM, TAM);
                }
            } else if (tipo === T.ABISMO) {
                // Fuego animado: ciclo rapido + offset espacial
                const fireFrame = Math.floor(tiempo / 100) + hashVariante(fila, col);
                const tex = obtenerTextura('ABISMO', fireFrame);
                if (tex) {
                    ctx.drawImage(tex, px, py);
                } else {
                    ctx.fillStyle = '#c03c0a';
                    ctx.fillRect(px, py, TAM, TAM);
                }

                // Resplandor hacia arriba (solo desde la primera fila de fuego)
                const tipoArriba = obtenerTile(fila - 1, col);
                if (tipoArriba !== T.ABISMO) {
                    const pulso = 0.2 + Math.sin(tiempo * 0.005 + col) * 0.06;
                    const glowGrad = ctx.createLinearGradient(px, py, px, py - TAM * 2);
                    glowGrad.addColorStop(0, 'rgba(255,100,20,' + pulso.toFixed(2) + ')');
                    glowGrad.addColorStop(0.5, 'rgba(255,60,10,' + (pulso * 0.3).toFixed(2) + ')');
                    glowGrad.addColorStop(1, 'rgba(255,30,5,0)');
                    ctx.fillStyle = glowGrad;
                    ctx.fillRect(px, py - TAM * 2, TAM, TAM * 2);
                }
            } else if (tipo === T.META) {
                if (!bossVivo) {
                    renderizarPortalMeta(ctx, px, py, tiempo);
                }
            }
        }
    }
}

// Portal META animado: glow verde, vortice giratorio y cofre central
function renderizarPortalMeta(ctx, px, py, tiempo) {
    const cx = px + TAM / 2;
    const cy = py + TAM / 2;
    const t = tiempo * 0.004;

    // Glow exterior
    const glowRadius = TAM * 0.8;
    const glowAlpha = 0.15 + Math.sin(t) * 0.08;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
    grad.addColorStop(0, 'rgba(107,252,134,' + glowAlpha.toFixed(2) + ')');
    grad.addColorStop(0.6, 'rgba(107,252,134,' + (glowAlpha * 0.4).toFixed(2) + ')');
    grad.addColorStop(1, 'rgba(107,252,134,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - glowRadius, cy - glowRadius, glowRadius * 2, glowRadius * 2);

    // Vortice: anillos concentricos rotando
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
        const radio = 3 + i * 2;
        const angulo = t * (2 - i * 0.5) + i * 2.1;
        const alpha = 0.3 - i * 0.08;
        ctx.strokeStyle = 'rgba(107,252,134,' + alpha.toFixed(2) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, radio, angulo, angulo + Math.PI * 1.2);
        ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();

    // Cofre en el centro (pixel art 10×8 centrado)
    const ox = Math.round(cx - 5);
    const oy = Math.round(cy - 4);

    // Cuerpo del cofre (marrón oscuro)
    ctx.fillStyle = '#8b5e3c';
    ctx.fillRect(ox, oy + 3, 10, 5);

    // Tapa del cofre (marrón claro, con borde superior redondeado)
    ctx.fillStyle = '#c08050';
    ctx.fillRect(ox + 2, oy, 6, 1);
    ctx.fillRect(ox + 1, oy + 1, 8, 3);

    // Cerradura dorada
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(ox + 4, oy + 3, 2, 2);

    // Brillo (esquina superior izquierda)
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(ox + 2, oy + 1, 2, 1);
}

export function renderizarVineta(ctx) {
    if (vinetaCanvas) {
        ctx.drawImage(vinetaCanvas, 0, 0);
    }
}

export function renderizarFlash(ctx, anchoCanvas, altoCanvas, flashAlpha) {
    if (flashAlpha > 0.01) {
        ctx.fillStyle = 'rgba(255,255,255,' + flashAlpha.toFixed(2) + ')';
        ctx.fillRect(0, 0, anchoCanvas, altoCanvas);
    }
}

// Indicador de direccion del boss fuera de pantalla
export function renderizarIndicadorBoss(ctx, bossX, bossAncho, camaraX, anchoCanvas, tiempo) {
    const screenX = bossX - camaraX;

    if (screenX > anchoCanvas) {
        // Boss a la derecha
        const pulso = 0.6 + Math.sin(tiempo * 0.008) * 0.3;
        ctx.fillStyle = 'rgba(187,134,252,' + pulso.toFixed(2) + ')';
        // Flecha derecha
        ctx.beginPath();
        ctx.moveTo(anchoCanvas - 8, 135);
        ctx.lineTo(anchoCanvas - 2, 140);
        ctx.lineTo(anchoCanvas - 8, 145);
        ctx.closePath();
        ctx.fill();
    } else if (screenX + bossAncho < 0) {
        // Boss a la izquierda
        const pulso = 0.6 + Math.sin(tiempo * 0.008) * 0.3;
        ctx.fillStyle = 'rgba(187,134,252,' + pulso.toFixed(2) + ')';
        ctx.beginPath();
        ctx.moveTo(8, 135);
        ctx.lineTo(2, 140);
        ctx.lineTo(8, 145);
        ctx.closePath();
        ctx.fill();
    }
}

export function limpiarRenderer() {
    vinetaCanvas = null;
}
