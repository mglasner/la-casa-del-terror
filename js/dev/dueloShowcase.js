// Showcase del Duelo — herramienta de desarrollo
// Canvas animado con arena y 2 luchadores en estados controlables

import { renderizarEscena } from '../juegos/duelo/renderer.js';
import { crearLuchador } from '../juegos/duelo/luchador.js';
import { cargarSpritesLuchador } from '../juegos/duelo/spritesDuelo.js';
import {
    emitirAura,
    actualizarParticulas,
    renderizarParticulas,
} from '../juegos/duelo/particulas.js';

const W = 480;
const H = 270;

const ESTADOS = ['idle', 'caminar', 'saltar', 'atacando', 'golpeado', 'agachado', 'bloquear'];

// --- Luchadores mock ---

function crearMocks() {
    const l1 = crearLuchador({
        nombre: 'donbu',
        img: 'assets/img/personajes/donbu.webp',
        estatura: 1.55,
        velocidad: 6,
        vidaMax: 100,
        colorHud: '#5eeadb',
        direccion: 1,
        x: 140,
    });
    const l2 = crearLuchador({
        nombre: 'siniestra',
        img: 'assets/img/enemigos/siniestra.webp',
        esVillano: true,
        estatura: 1.6,
        velocidad: 7,
        vidaMax: 100,
        colorHud: '#e94560',
        direccion: -1,
        x: 300,
    });
    cargarSpritesLuchador(l1);
    cargarSpritesLuchador(l2);
    return { l1, l2 };
}

// --- Aplicar estado visual a un luchador ---

function aplicarEstado(l, estado) {
    // Reset
    l.bloqueando = false;
    l.agachado = false;
    l.vx = 0;
    l.vy = 0;
    l.enSuelo = true;
    l.ataqueTimer = 0;
    l.invulFrames = 0;

    switch (estado) {
        case 'caminar':
            l.vx = l.vel * l.direccion;
            break;
        case 'saltar':
            l.vy = -3;
            l.enSuelo = false;
            break;
        case 'atacando':
            l.ataqueTimer = 999;
            l.tipoAtaque = 'rapido';
            break;
        case 'golpeado':
            l.invulFrames = 999;
            break;
        case 'agachado':
            l.agachado = true;
            break;
        case 'bloquear':
            l.bloqueando = true;
            break;
    }
    l.estado = estado;
}

// --- Toolbar con botones de estado ---

function crearToolbar(contenedor, label, estadoActual, onChange) {
    const fila = document.createElement('div');
    fila.className = 'toolbar';
    fila.style.marginBottom = '8px';

    const nombre = document.createElement('span');
    nombre.className = 'state-indicator';
    nombre.textContent = label;
    fila.appendChild(nombre);

    const sep = document.createElement('div');
    sep.className = 'sep';
    fila.appendChild(sep);

    const grupo = document.createElement('div');
    grupo.className = 'btn-group';

    const botones = [];
    for (const est of ESTADOS) {
        const btn = document.createElement('button');
        btn.className = 'state-btn' + (est === estadoActual ? ' active' : '');
        btn.textContent = est;
        btn.addEventListener('click', function () {
            for (const b of botones) b.classList.remove('active');
            btn.classList.add('active');
            onChange(est);
        });
        botones.push(btn);
        grupo.appendChild(btn);
    }

    fila.appendChild(grupo);
    contenedor.appendChild(fila);
}

// --- Montaje ---

function montar() {
    const contenedor = document.getElementById('dueloShowcase');
    if (!contenedor) return;

    const { l1, l2 } = crearMocks();

    const estMock = {
        fase: 'pelea',
        luchador1: l1,
        luchador2: l2,
        faseTimer: 0,
        ganador: null,
        tiempoRestante: 90,
        flashAlpha: 0,
    };

    // Canvas
    const card = document.createElement('div');
    card.className = 'card';
    card.style.minWidth = 'auto';

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = '480px';
    canvas.style.height = '270px';
    card.appendChild(canvas);

    // Toolbars dentro del card
    crearToolbar(card, 'Jugador:', 'idle', function (est) {
        aplicarEstado(l1, est);
    });
    crearToolbar(card, 'Rival:', 'idle', function (est) {
        aplicarEstado(l2, est);
    });

    contenedor.appendChild(card);

    const ctx = canvas.getContext('2d');

    // Loop de animación
    function loop() {
        // Avanzar animación de sprites
        l1.frameTimer++;
        l2.frameTimer++;
        const vel = 8;
        if (l1.frameTimer >= vel) {
            l1.frameTimer = 0;
            l1.frameAnim++;
        }
        if (l2.frameTimer >= vel) {
            l2.frameTimer = 0;
            l2.frameAnim++;
        }

        // Partículas de aura orbitando
        emitirAura(l1);
        emitirAura(l2);
        actualizarParticulas(1);

        renderizarEscena(ctx, W, H, estMock);
        renderizarParticulas(ctx);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

montar();
