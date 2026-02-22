// Habitacion 4 — El Abismo: Camara horizontal con lerp suave + screen shake

import { CFG } from './config.js';
import { obtenerColumnas } from './nivel.js';

const LERP = 0.1;
const OFFSET_X = 0.35; // Jugador al 35% desde la izquierda
const SHAKE_DECAY = CFG.camara.shakeDecay;

let x = 0;
let anchoCanvas = CFG.canvas.anchoBase;
let anchoNivel = 0;

// Screen shake
let shakeIntensidad = 0;
let shakeOffX = 0;
let shakeOffY = 0;

// Freeze frame
let freezeFrames = 0;

// Flash blanco
let flashAlpha = 0;

export function iniciarCamara(anchoC) {
    anchoCanvas = anchoC;
    anchoNivel = obtenerColumnas() * CFG.tiles.tamano;
    x = 0;
    shakeIntensidad = 0;
    shakeOffX = 0;
    shakeOffY = 0;
    freezeFrames = 0;
    flashAlpha = 0;
}

export function actualizarCamara(jugadorX) {
    // Freeze frame: no actualizar camara
    if (freezeFrames > 0) {
        freezeFrames--;
        return;
    }

    const objetivo = jugadorX - anchoCanvas * OFFSET_X;

    // Lerp suave
    x += (objetivo - x) * LERP;

    // Clamp a los bordes del nivel
    if (x < 0) x = 0;
    const maxX = anchoNivel - anchoCanvas;
    if (x > maxX) x = maxX;

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

export function obtenerShakeY() {
    return Math.round(shakeOffY);
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
