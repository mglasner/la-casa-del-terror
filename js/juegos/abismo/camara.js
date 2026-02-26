// Habitacion 4 — El Abismo: Camara 2D con lerp suave + screen shake
// Sigue al jugador en X e Y con offset configurable

import { CFG } from './config.js';
import { obtenerColumnas, obtenerFilas } from './nivel.js';

const LERP = 0.1;
const OFFSET_X = 0.35; // Jugador al 35% desde la izquierda
const OFFSET_Y = 0.55; // Jugador al 55% desde arriba (ve mas hacia arriba para saltar)
const SHAKE_DECAY = CFG.camara.shakeDecay;

let x = 0;
let y = 0;
let anchoCanvas = CFG.canvas.anchoBase;
let altoCanvas = CFG.canvas.altoBase;
let anchoNivel = 0;
let altoNivel = 0;

// Screen shake
let shakeIntensidad = 0;
let shakeOffX = 0;
let shakeOffY = 0;

// Freeze frame
let freezeFrames = 0;

// Flash blanco
let flashAlpha = 0;

export function iniciarCamara(anchoC, altoC) {
    anchoCanvas = anchoC;
    altoCanvas = altoC;
    anchoNivel = obtenerColumnas() * CFG.tiles.tamano;
    altoNivel = obtenerFilas() * CFG.tiles.tamano;
    x = 0;
    y = 0;
    shakeIntensidad = 0;
    shakeOffX = 0;
    shakeOffY = 0;
    freezeFrames = 0;
    flashAlpha = 0;
}

export function actualizarCamara(jugadorX, jugadorY) {
    // Freeze frame: no actualizar camara
    if (freezeFrames > 0) {
        freezeFrames--;
        return;
    }

    // Horizontal
    const objetivoX = jugadorX - anchoCanvas * OFFSET_X;
    x += (objetivoX - x) * LERP;
    if (x < 0) x = 0;
    const maxX = anchoNivel - anchoCanvas;
    if (maxX > 0) {
        if (x > maxX) x = maxX;
    } else {
        x = 0;
    }

    // Vertical
    const objetivoY = jugadorY - altoCanvas * OFFSET_Y;
    y += (objetivoY - y) * LERP;
    if (y < 0) y = 0;
    const maxY = altoNivel - altoCanvas;
    if (maxY > 0) {
        if (y > maxY) y = maxY;
    } else {
        y = 0;
    }

    // Actualizar shake
    if (shakeIntensidad > 0.3) {
        shakeOffX = (Math.random() - 0.5) * 2 * shakeIntensidad;
        shakeOffY = (Math.random() - 0.5) * 2 * shakeIntensidad;
        shakeIntensidad *= SHAKE_DECAY;
    } else {
        shakeIntensidad = 0;
        shakeOffX = 0;
        shakeOffY = 0;
    }

    // Actualizar flash
    if (flashAlpha > 0.01) {
        flashAlpha *= 0.85;
    } else {
        flashAlpha = 0;
    }
}

export function obtenerCamaraX() {
    return Math.round(x + shakeOffX);
}

export function obtenerCamaraY() {
    return Math.round(y + shakeOffY);
}

export function estaCongelada() {
    return freezeFrames > 0;
}

// Disparar screen shake
export function sacudir(intensidad) {
    shakeIntensidad = intensidad;
}

// Disparar freeze frame
export function congelar(frames) {
    freezeFrames = frames;
}

// Disparar flash blanco
export function flashBlanco(alpha) {
    flashAlpha = alpha;
}

export function obtenerFlashAlpha() {
    return flashAlpha;
}
