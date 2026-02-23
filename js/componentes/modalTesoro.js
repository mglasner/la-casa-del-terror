// Componente: Modal de revelación de tesoro
// Muestra el tesoro obtenido con presentación visual adaptada al tier
// Incluye sorteo ponderado de tesoros

import { TESOROS } from '../tesoros.js';
import { crearElemento } from '../utils.js';
import { sonidoTesoro } from '../audio.js';

const TIERS_LABEL = {
    curioso: 'Curioso',
    raro: 'Raro',
    epico: 'Épico',
    legendario: 'Legendario',
    mitico: 'Mítico',
};

const TIERS_ALTOS = new Set(['epico', 'legendario', 'mitico']);
const TOTAL_PARTICULAS = 10;

// --- Sorteo ponderado ---

/** Sortea un tesoro aleatorio ponderado, excluyendo los ya encontrados */
export function sortearTesoro(encontrados) {
    const candidatos = [];
    let pesoTotal = 0;

    for (const [nombre, datos] of Object.entries(TESOROS)) {
        if (encontrados.has(nombre)) continue;
        candidatos.push({ nombre, peso: datos.peso });
        pesoTotal += datos.peso;
    }

    if (candidatos.length === 0) return null;

    let random = Math.random() * pesoTotal;
    for (const c of candidatos) {
        random -= c.peso;
        if (random <= 0) return c.nombre;
    }

    return candidatos[candidatos.length - 1].nombre;
}

// --- Componente modal ---

export function crearModalTesoro() {
    let callbackAceptar = null;
    let abierto = false;

    function cerrar() {
        const modal = document.querySelector('.modal-tesoro');
        if (modal) {
            modal.classList.remove('visible');
            setTimeout(function () {
                modal.remove();
            }, 400);
        }
        abierto = false;
        if (callbackAceptar) callbackAceptar();
    }

    function crearParticulas(visual, cantidad) {
        for (let i = 0; i < cantidad; i++) {
            const p = crearElemento('div', 'tesoro-particula');
            p.style.setProperty('--dur', 2 + Math.random() * 3 + 's');
            p.style.setProperty('--delay', -Math.random() * 3 + 's');
            visual.appendChild(p);
        }
    }

    function mostrar(nombreTesoro, contenedor) {
        const datos = TESOROS[nombreTesoro];
        if (!datos) return;

        abierto = true;
        const tier = datos.tier;
        const tieneSprite = datos.sprite && datos.frames;

        const modal = crearElemento('div', 'modal-tesoro ' + tier);
        const fondo = crearElemento('div', 'modal-tesoro-fondo');
        const caja = crearElemento('div', 'modal-tesoro-caja');

        caja.appendChild(
            crearElemento('span', 'modal-tesoro-tier tier-' + tier, TIERS_LABEL[tier])
        );

        const visual = crearElemento('div', 'modal-tesoro-visual');

        if (tieneSprite && TIERS_ALTOS.has(tier)) {
            const sprite = crearElemento('div', 'modal-tesoro-sprite');
            sprite.style.backgroundImage = 'url(' + datos.sprite + ')';
            sprite.style.setProperty('--frames', datos.frames);
            visual.appendChild(sprite);
        } else {
            const img = crearElemento('img', 'modal-tesoro-img');
            img.src = datos.img;
            img.alt = nombreTesoro;
            img.draggable = false;
            visual.appendChild(img);
        }

        if (TIERS_ALTOS.has(tier)) {
            crearParticulas(visual, TOTAL_PARTICULAS);
        }

        caja.appendChild(visual);

        const nombre = crearElemento('h2', 'modal-tesoro-nombre', nombreTesoro);
        if (tier === 'mitico') {
            nombre.style.setProperty('--tw-chars', nombreTesoro.length);
            nombre.style.setProperty('--tw-dur', nombreTesoro.length * 0.08 + 's');
        }
        caja.appendChild(nombre);

        if (datos.descripcion) {
            caja.appendChild(crearElemento('p', 'modal-tesoro-desc', datos.descripcion.trim()));
        }

        const btn = crearElemento('button', 'modal-tesoro-btn', 'Continuar');
        btn.type = 'button';
        btn.addEventListener('click', cerrar);
        caja.appendChild(btn);

        if (tier === 'legendario' || tier === 'mitico') {
            modal.appendChild(crearElemento('div', 'modal-tesoro-flash'));
        }

        modal.appendChild(fondo);
        modal.appendChild(caja);
        fondo.addEventListener('click', cerrar);

        contenedor.appendChild(modal);

        void modal.offsetHeight; // reflow para activar transición
        modal.classList.add('visible');

        if (tier === 'legendario') {
            modal.classList.add('revelar-shake');
        }

        sonidoTesoro(tier);
    }

    return {
        mostrar: mostrar,

        estaAbierto: function () {
            return abierto;
        },

        manejarTecla: function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                cerrar();
            }
        },

        onAceptar: function (callback) {
            callbackAceptar = callback;
        },
    };
}
