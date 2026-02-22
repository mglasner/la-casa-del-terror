// Componente: Estante de biblioteca (homepage)
// Escena inmersiva con mueble de madera, partículas flotantes y libros interactivos

import { crearElemento } from '../utils.js';

const TOTAL_PARTICULAS = 20;

/**
 * Crea el estante de la biblioteca con escena inmersiva.
 * @param {HTMLElement} contenedor - Elemento donde montar el estante
 * @param {Array<{id: string, titulo: string, color: string, icono?: string, onClick: Function}>} libros
 * @returns {{ mostrar: Function, ocultar: Function, destruir: Function }}
 */
export function crearEstante(contenedor, libros) {
    const escena = crearElemento('div', 'escena-biblioteca oculto');

    // Partículas de polvo flotante
    const particulas = crearElemento('div', 'escena-particulas');
    for (let i = 0; i < TOTAL_PARTICULAS; i++) {
        const p = crearElemento('div', 'particula');
        p.style.setProperty('--x', Math.random() * 100 + '%');
        p.style.setProperty('--drift', (Math.random() - 0.5) * 60 + 'px');
        p.style.setProperty('--dur', 15 + Math.random() * 20 + 's');
        p.style.setProperty('--delay', -Math.random() * 20 + 's');
        p.style.setProperty('--size', 2 + Math.random() * 3 + 'px');
        p.style.setProperty('--alpha', 0.2 + Math.random() * 0.3);
        particulas.appendChild(p);
    }
    escena.appendChild(particulas);

    // Overlay de luz de ventana
    escena.appendChild(crearElemento('div', 'escena-luz'));

    // Mueble
    const mueble = crearElemento('div', 'estante');

    // Corona decorativa (moldura superior)
    mueble.appendChild(crearElemento('div', 'estante-corona'));

    // Encabezado
    const encabezado = crearElemento('div', 'estante-encabezado');
    encabezado.appendChild(crearElemento('h1', 'estante-titulo', 'Biblioteca'));
    encabezado.appendChild(crearElemento('p', 'estante-subtitulo', 'de Aventuras'));
    mueble.appendChild(encabezado);

    // Repisa principal con lomos de libro
    const repisa = crearElemento('div', 'estante-repisa');

    libros.forEach(function (libro) {
        const lomo = document.createElement('button');
        lomo.type = 'button';
        lomo.className = 'estante-lomo';
        lomo.dataset.libro = libro.id;
        lomo.style.setProperty('--lomo-color', libro.color);

        if (libro.icono) {
            lomo.appendChild(crearElemento('span', 'estante-lomo-icono', libro.icono));
        }

        lomo.appendChild(crearElemento('span', 'estante-lomo-titulo', libro.titulo));

        lomo.addEventListener('click', function () {
            if (libro.onClick) libro.onClick();
        });

        repisa.appendChild(lomo);
    });

    mueble.appendChild(repisa);

    // Tabla de la repisa (frente visible del estante)
    mueble.appendChild(crearElemento('div', 'estante-tabla'));

    // Base del mueble
    mueble.appendChild(crearElemento('div', 'estante-base'));

    escena.appendChild(mueble);

    // Sombra proyectada en el piso
    escena.appendChild(crearElemento('div', 'estante-sombra-piso'));

    contenedor.appendChild(escena);

    let visible = false;

    return {
        mostrar: function () {
            if (visible) return;
            visible = true;
            escena.classList.remove('oculto');
            escena.classList.remove('escena-entrada');
            requestAnimationFrame(function () {
                escena.classList.add('escena-entrada');
            });
        },
        ocultar: function () {
            visible = false;
            escena.classList.add('oculto');
            escena.classList.remove('escena-entrada');
        },
        destruir: function () {
            escena.remove();
        },
    };
}
