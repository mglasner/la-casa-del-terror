// Habitacion 4 — El Abismo: Creacion del DOM (pantalla, canvas, cabecera)

import { CFG } from './config.js';

function calcularEscala(contenedor) {
    const rect = contenedor.getBoundingClientRect();
    const disponibleAncho = rect.width - 16;
    const disponibleAlto = rect.height - 60;

    const escalaX = Math.floor(disponibleAncho / CFG.canvas.anchoBase) || 1;
    const escalaY = Math.floor(disponibleAlto / CFG.canvas.altoBase) || 1;

    return Math.max(1, Math.min(escalaX, escalaY));
}

export function crearPantalla(esTouch, onHuir) {
    const anchoCanvas = CFG.canvas.anchoBase;
    const altoCanvas = CFG.canvas.altoBase;

    const pantalla = document.createElement('div');
    pantalla.id = 'pantalla-habitacion4';
    pantalla.className = 'habitacion-4';

    // Cabecera: boton huir + titulo
    const cabecera = document.createElement('div');
    cabecera.className = 'cabecera-habitacion';

    const btnHuir = document.createElement('button');
    btnHuir.className = 'btn-huir';
    btnHuir.title = 'Huir al pasillo (Esc)';
    btnHuir.setAttribute('aria-label', 'Huir al pasillo');
    const imgHuir = document.createElement('img');
    imgHuir.src = 'assets/img/icons/btn-salir.webp';
    imgHuir.alt = '';
    imgHuir.className = 'btn-huir-icono';
    btnHuir.appendChild(imgHuir);
    btnHuir.addEventListener('click', onHuir);

    const titulo = document.createElement('h2');
    titulo.className = 'titulo-habitacion';
    titulo.textContent = CFG.meta.titulo;

    cabecera.appendChild(btnHuir);
    cabecera.appendChild(titulo);

    // Canvas (dimensiones logicas fijas)
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-platformer';
    canvas.width = anchoCanvas;
    canvas.height = altoCanvas;
    const ctx = canvas.getContext('2d');

    // Hint de controles (solo desktop)
    let hint = null;
    if (!esTouch) {
        hint = document.createElement('p');
        hint.className = 'laberinto-hint';
        hint.textContent =
            'Flechas \u2190 \u2192 para mover \u00b7 \u2191 para saltar \u00b7 Esc para huir';
    }

    pantalla.appendChild(cabecera);
    pantalla.appendChild(canvas);
    if (hint) pantalla.appendChild(hint);

    // Agregar al DOM antes de calcular escala (getBoundingClientRect necesita layout)
    document.getElementById('juego').appendChild(pantalla);

    const escala = calcularEscala(pantalla);
    canvas.style.width = anchoCanvas * escala + 'px';
    canvas.style.height = altoCanvas * escala + 'px';

    return { pantalla, canvas, ctx, escala };
}
