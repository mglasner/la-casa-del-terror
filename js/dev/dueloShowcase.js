// Showcase del Duelo — herramienta de desarrollo
// 5 paneles: arena base (sin clima) + 4 estaciones, mismo tamaño que clima showcase
// Usa crearEstadoClima() para tener partículas independientes por panel.

import { renderizarEscena } from '../juegos/duelo/renderer.js';
import { crearLuchador } from '../juegos/duelo/luchador.js';
import { cargarSpritesLuchador } from '../juegos/duelo/spritesDuelo.js';
import {
    crearEstadoClima,
    emitirClima,
    actualizarParticulas,
    renderizarParticulas,
} from '../juegos/duelo/particulas.js';
import { inicializarGradas, actualizarGradas } from '../juegos/duelo/gradas.js';

const W = 480;
const H = 270;

const CASOS = [
    { label: 'Sin clima', sub: '— Noche por defecto —', estacion: null },
    { label: 'Invierno', sub: 'La Tormenta Arcana', estacion: 'invierno' },
    { label: 'Primavera', sub: 'El Despertar del Bosque', estacion: 'primavera' },
    { label: 'Verano', sub: 'El Sol Abrasador', estacion: 'verano' },
    { label: 'Otoño', sub: 'La Danza de las Hojas', estacion: 'otono' },
];

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

// --- Montaje ---

function montar() {
    const contenedor = document.getElementById('dueloShowcase');
    if (!contenedor) return;

    const { l1, l2 } = crearMocks();
    inicializarGradas('donbu', false, 'siniestra', true);

    // Estado mock base
    const estBase = {
        fase: 'pelea',
        luchador1: l1,
        luchador2: l2,
        faseTimer: 0,
        ganador: null,
        tiempoRestante: 90,
        flashAlpha: 0,
        estacion: null,
    };

    // Crear un panel por cada caso (mismo formato que climaShowcase)
    const paneles = [];
    for (const caso of CASOS) {
        const card = document.createElement('div');
        card.className = 'card';

        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        canvas.style.width = '240px';
        canvas.style.height = '135px';

        const nombre = document.createElement('span');
        nombre.className = 'name';
        nombre.textContent = caso.label;

        const sub = document.createElement('span');
        sub.style.cssText =
            'display:block;font-size:0.65em;color:#888;margin-top:2px;line-height:1.2;min-height:2em';
        sub.textContent = caso.sub;

        card.append(canvas, nombre, sub);
        contenedor.appendChild(card);

        paneles.push({
            ctx: canvas.getContext('2d'),
            estacion: caso.estacion,
            ep: crearEstadoClima(),
        });
    }

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

        actualizarGradas(estBase);

        for (const panel of paneles) {
            estBase.estacion = panel.estacion;

            // Emitir y actualizar partículas con estado local del panel
            emitirClima(panel.estacion, W, panel.ep);
            actualizarParticulas(1, panel.ep);

            // Renderizar escena (arena + gradas + luchadores)
            renderizarEscena(panel.ctx, W, H, estBase);

            // Renderizar partículas locales encima
            renderizarParticulas(panel.ctx, panel.ep);
        }

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

montar();
