// El Duelo — Gradas animadas con espectadores
// Héroes y villanos del juego observan la pelea desde las gradas del coliseo

import { CFG } from './config.js';
import { PERSONAJES } from '../../personajes.js';
import { ENEMIGOS } from '../../enemigos.js';

const ANCHO_ARENA = CFG.canvas.anchoBase;

// --- Constantes de layout ---

const FILAS = [
    { y: 155, escala: 1.0, alpha: 0.8 }, // frente
    { y: 105, escala: 0.78, alpha: 0.6 }, // medio
    { y: 60, escala: 0.62, alpha: 0.4 }, // fondo
];

const BARANDA_Y = 178;
const LADO_IZQ = { min: 15, max: 225 }; // héroes
const LADO_DER = { min: 255, max: 465 }; // villanos
const PILAR_INTERVALO = 50;

// Paletas de piedra por iluminación (noche vs día)
const PIEDRA_NOCHE = {
    escalon: '#150b25',
    franja: '#1a0e2e',
    borde: '#3d2560',
    baranda: '#2a1640',
    barandaClaro: '#3d2560',
};
const PIEDRA_DIA = {
    escalon: '#6b5e50',
    franja: '#8a7a68',
    borde: '#a09080',
    baranda: '#7a6a58',
    barandaClaro: '#a09080',
};

function obtenerPiedra(estacion) {
    if (estacion === 'primavera' || estacion === 'verano') return PIEDRA_DIA;
    return PIEDRA_NOCHE;
}

// Radio base de la cabeza-avatar en la fila frontal (px)
const CABEZA_RADIO_BASE = 7;

// Civiles genéricos: cantidad y paleta de colores de ropa
const CIVILES_TOTAL = 12;
const COLORES_ROPA = [
    '#8b6914',
    '#b5651d',
    '#6b8e23',
    '#4682b4',
    '#9370db',
    '#cd853f',
    '#708090',
    '#bc8f8f',
    '#daa520',
    '#5f9ea0',
];
const COLORES_PIEL = ['#f5d0a9', '#d4a574', '#c68642', '#8d5524', '#e8beac'];

// --- Estado del módulo ---

let espectadores = [];
let frame = 0;
let faseAnterior = null;
let flashAnterior = 0;
const cacheImg = {};

// --- Utilidades ---

function cargarImagen(src) {
    if (cacheImg[src]) return cacheImg[src];
    const img = new Image();
    img.src = src;
    cacheImg[src] = img;
    return img;
}

function obtenerColor(entidad, esVillano) {
    // Personajes tienen colorHud, enemigos usan color del primer ataque
    if (!esVillano && entidad.colorHud) return entidad.colorHud;
    if (entidad.ataques && entidad.ataques[0] && entidad.ataques[0].color) {
        return entidad.ataques[0].color;
    }
    return esVillano ? '#e94560' : '#5eeadb';
}

// --- Inicialización ---

export function inicializarGradas(nombre1, _esVillano1, nombre2, _esVillano2) {
    espectadores = [];
    frame = 0;
    faseAnterior = null;
    flashAnterior = 0;

    const heroes = [];
    const villanos = [];

    // Recoger héroes (excluyendo al luchador 1 si es héroe, o al 2)
    for (const key of Object.keys(PERSONAJES)) {
        const p = PERSONAJES[key];
        const nom = p.nombre.toLowerCase();
        if (nom === nombre1.toLowerCase() || nom === nombre2.toLowerCase()) continue;
        heroes.push({ nombre: p.nombre, color: obtenerColor(p, false), img: p.img });
    }

    // Recoger villanos (excluyendo luchador y pesadillas)
    for (const key of Object.keys(ENEMIGOS)) {
        const e = ENEMIGOS[key];
        if (e.tier === 'pesadilla') continue;
        const nom = e.nombre.toLowerCase();
        if (nom === nombre1.toLowerCase() || nom === nombre2.toLowerCase()) continue;
        villanos.push({ nombre: e.nombre, color: obtenerColor(e, true), img: e.img });
    }

    // Distribuir en filas
    repartirEnFilas(heroes, LADO_IZQ, 'heroe');
    repartirEnFilas(villanos, LADO_DER, 'villano');

    // Civiles genéricos para llenar las gradas
    agregarCiviles();
}

function agregarCiviles() {
    const margen = 15;
    for (let i = 0; i < CIVILES_TOTAL; i++) {
        const f = Math.floor(Math.random() * FILAS.length);
        const x = margen + Math.random() * (ANCHO_ARENA - margen * 2);

        // Evitar superponerse con espectadores existentes (mínimo 14px)
        let solapado = false;
        for (const esp of espectadores) {
            if (esp.fila === f && Math.abs(esp.x - x) < 14) {
                solapado = true;
                break;
            }
        }
        if (solapado) continue;

        const ropa = COLORES_ROPA[Math.floor(Math.random() * COLORES_ROPA.length)];
        const piel = COLORES_PIEL[Math.floor(Math.random() * COLORES_PIEL.length)];

        espectadores.push({
            nombre: null,
            color: ropa,
            colorPiel: piel,
            img: null,
            x: x,
            baseY: FILAS[f].y,
            fila: f,
            escala: FILAS[f].escala,
            alpha: FILAS[f].alpha,
            fase: Math.random() * Math.PI * 2,
            equipo: Math.random() < 0.5 ? 'heroe' : 'villano',
            estado: 'idle',
            estadoTimer: 0,
        });
    }
}

function repartirEnFilas(lista, lado, equipo) {
    if (lista.length === 0) return;

    // Mezclar aleatoriamente
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }

    const rangoX = lado.max - lado.min;
    const porFila = Math.ceil(lista.length / FILAS.length);

    let idx = 0;
    for (let f = 0; f < FILAS.length && idx < lista.length; f++) {
        const enEstaFila = Math.min(porFila, lista.length - idx);
        const espaciado = rangoX / (enEstaFila + 1);

        for (let i = 0; i < enEstaFila; i++) {
            const ent = lista[idx++];
            const jitterX = (Math.random() - 0.5) * 12;
            const x = lado.min + espaciado * (i + 1) + jitterX;

            espectadores.push({
                nombre: ent.nombre,
                color: ent.color,
                img: ent.img ? cargarImagen(ent.img) : null,
                x: x,
                baseY: FILAS[f].y,
                fila: f,
                escala: FILAS[f].escala,
                alpha: FILAS[f].alpha,
                fase: Math.random() * Math.PI * 2, // fase única para sway
                equipo: equipo,
                estado: 'idle',
                estadoTimer: 0,
            });
        }
    }
}

// --- Actualización por frame ---

export function actualizarGradas(est) {
    frame++;

    // Detectar impacto: flashAlpha subió bruscamente
    const flashSubio = est.flashAlpha > 0.15 && est.flashAlpha > flashAnterior + 0.05;
    flashAnterior = est.flashAlpha;

    // Detectar transición a pelea (para ola)
    if (est.fase === 'pelea' && faseAnterior === 'countdown') {
        iniciarOla();
    }

    // Detectar fase resultado
    if (est.fase === 'resultado' && faseAnterior !== 'resultado') {
        iniciarReaccionResultado(est.ganador);
    }

    faseAnterior = est.fase;

    for (const esp of espectadores) {
        // Decrementar timer de estado especial
        if (esp.estadoTimer > 0) {
            esp.estadoTimer--;
            if (esp.estadoTimer <= 0) esp.estado = 'idle';
        }

        // Impacto → aplaudir (solo si están en idle)
        if (flashSubio && esp.estado === 'idle') {
            // El equipo del atacante aplaude
            // flashAlpha sube cuando hay impacto; no sabemos quién golpeó,
            // así que ambos lados reaccionan aleatoriamente con preferencia
            if (Math.random() < 0.6) {
                esp.estado = 'aplaudir';
                esp.estadoTimer = 20;
            }
        }
    }
}

function iniciarOla() {
    for (const esp of espectadores) {
        // Delay proporcional a posición X (ola de izquierda a derecha)
        const delay = Math.floor((esp.x / ANCHO_ARENA) * 40);
        esp.estado = 'ola';
        esp.estadoTimer = 60 + delay;
    }
}

function iniciarReaccionResultado(ganador) {
    for (const esp of espectadores) {
        if (ganador === 'jugador') {
            esp.estado = esp.equipo === 'heroe' ? 'ovacion' : 'lamentar';
        } else if (ganador === 'enemigo') {
            esp.estado = esp.equipo === 'villano' ? 'ovacion' : 'lamentar';
        } else {
            // Empate: lamento suave de todos
            esp.estado = 'lamentar';
        }
        esp.estadoTimer = 180; // dura toda la fase resultado
    }
}

// --- Renderizado ---

export function renderizarGradas(ctx, ancho, estacion) {
    const piedra = obtenerPiedra(estacion);
    renderizarEscalones(ctx, ancho, piedra);
    renderizarEspectadores(ctx);
    renderizarBaranda(ctx, ancho, piedra);
}

function renderizarEscalones(ctx, ancho, piedra) {
    for (let f = FILAS.length - 1; f >= 0; f--) {
        const fila = FILAS[f];
        const altoEscalon = f === 0 ? BARANDA_Y - fila.y : FILAS[f - 1].y - fila.y;
        const y = fila.y - 5;

        // Relleno plano del escalón
        ctx.fillStyle = piedra.escalon;
        ctx.fillRect(0, y, ancho, altoEscalon);

        // Borde iluminado superior (1px)
        ctx.fillStyle = piedra.borde;
        ctx.fillRect(0, y, ancho, 1);

        // Franja clara superior (2px, simula profundidad)
        ctx.fillStyle = piedra.franja;
        ctx.fillRect(0, y + 1, ancho, 2);
    }
}

function renderizarBaranda(ctx, ancho, piedra) {
    // Barra horizontal
    ctx.fillStyle = piedra.baranda;
    ctx.fillRect(0, BARANDA_Y, ancho, 6);

    // Borde superior iluminado
    ctx.fillStyle = piedra.barandaClaro;
    ctx.fillRect(0, BARANDA_Y, ancho, 1);

    // Pilares
    for (let x = 20; x < ancho; x += PILAR_INTERVALO) {
        ctx.fillStyle = piedra.baranda;
        ctx.fillRect(x, BARANDA_Y - 3, 4, 12);
        // Highlight del pilar
        ctx.fillStyle = piedra.barandaClaro;
        ctx.fillRect(x, BARANDA_Y - 3, 1, 12);
    }
}

function renderizarEspectadores(ctx) {
    // Dibujar de atrás hacia adelante (fila 2 → 1 → 0)
    for (let f = FILAS.length - 1; f >= 0; f--) {
        for (const esp of espectadores) {
            if (esp.fila !== f) continue;
            renderizarEspectador(ctx, esp);
        }
    }
}

function oscurecerHex(hex, factor) {
    if (!hex || hex.length < 7) return '#664488';
    const r = Math.floor(parseInt(hex.slice(1, 3), 16) * factor);
    const g = Math.floor(parseInt(hex.slice(3, 5), 16) * factor);
    const b = Math.floor(parseInt(hex.slice(5, 7), 16) * factor);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function renderizarEspectador(ctx, esp) {
    const s = esp.escala;

    // Calcular offset según estado
    let offsetY = 0;
    let brazosArriba = false;
    let brazosWave = false;

    switch (esp.estado) {
        case 'idle':
            offsetY = Math.sin(frame * 0.05 + esp.fase) * 1.5 * s;
            break;
        case 'aplaudir':
            offsetY = -4 * s * Math.abs(Math.sin(esp.estadoTimer * 0.3));
            brazosArriba = true;
            break;
        case 'ovacion':
            offsetY = -5 * s * Math.abs(Math.sin(frame * 0.2 + esp.fase));
            brazosWave = true;
            break;
        case 'lamentar':
            offsetY = 2 * s;
            break;
        case 'ola': {
            const delay = Math.floor((esp.x / ANCHO_ARENA) * 40);
            const t = 60 + delay - esp.estadoTimer;
            if (t > 0 && t < 20) {
                offsetY = -6 * s * Math.sin((t / 20) * Math.PI);
                brazosArriba = true;
            } else {
                offsetY = Math.sin(frame * 0.05 + esp.fase) * 1.5 * s;
            }
            break;
        }
    }

    // Coordenadas redondeadas a píxeles enteros
    const px = Math.round(esp.x);
    const py = Math.round(esp.baseY + offsetY);

    ctx.save();
    ctx.globalAlpha = esp.alpha;

    // Dimensiones del cuerpo pixel art
    const cuerpoW = Math.round(6 * s);
    const cuerpoH = Math.round(8 * s);
    const brazoW = Math.max(1, Math.round(1 * s));
    const brazoH = Math.round(5 * s);
    const cabezaR = Math.round(CABEZA_RADIO_BASE * s);

    const colorCuerpo = oscurecerHex(esp.color, 0.7);

    // Cuerpo (torso)
    ctx.fillStyle = colorCuerpo;
    ctx.fillRect(px - Math.floor(cuerpoW / 2), py, cuerpoW, cuerpoH);

    // Brazos
    ctx.fillStyle = colorCuerpo;
    const brazoIzqX = px - Math.floor(cuerpoW / 2) - brazoW - 1;
    const brazoDerX = px + Math.ceil(cuerpoW / 2) + 1;

    if (brazosArriba) {
        ctx.fillRect(brazoIzqX, py - brazoH + 2, brazoW, brazoH);
        ctx.fillRect(brazoDerX, py - brazoH + 2, brazoW, brazoH);
    } else if (brazosWave) {
        const alt = Math.sin(frame * 0.15 + esp.fase);
        const izqY = alt > 0 ? py - brazoH + 2 : py + 1;
        const derY = alt > 0 ? py + 1 : py - brazoH + 2;
        ctx.fillRect(brazoIzqX, izqY, brazoW, brazoH);
        ctx.fillRect(brazoDerX, derY, brazoW, brazoH);
    } else {
        ctx.fillRect(brazoIzqX, py + 1, brazoW, brazoH);
        ctx.fillRect(brazoDerX, py + 1, brazoW, brazoH);
    }

    // Cabeza: avatar recortado en círculo
    const cabezaCx = px;
    const cabezaCy = py - cabezaR;
    const imgObj = esp.img;

    if (imgObj && imgObj.complete && imgObj.naturalWidth > 0) {
        ctx.save();
        // Clip circular
        ctx.beginPath();
        ctx.arc(cabezaCx, cabezaCy, cabezaR, 0, Math.PI * 2);
        ctx.clip();
        // Dibujar avatar dentro del clip (suavizado para que se vea bien a escala pequeña)
        ctx.drawImage(imgObj, cabezaCx - cabezaR, cabezaCy - cabezaR, cabezaR * 2, cabezaR * 2);
        ctx.restore();

        // Borde circular del color del personaje
        ctx.strokeStyle = esp.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cabezaCx, cabezaCy, cabezaR, 0, Math.PI * 2);
        ctx.stroke();
    } else {
        // Civil genérico: círculo color piel
        ctx.fillStyle = esp.colorPiel || esp.color;
        ctx.beginPath();
        ctx.arc(cabezaCx, cabezaCy, cabezaR, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// --- Limpieza ---

export function limpiarGradas() {
    espectadores = [];
    frame = 0;
    faseAnterior = null;
    flashAnterior = 0;
}
