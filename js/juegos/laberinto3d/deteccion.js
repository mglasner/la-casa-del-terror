// Detección de cofre del tesoro y salida

import { CFG } from './config.js';
import { est, actualizarHUDInventarioLocal } from './estado.js';
import { lanzarToast } from '../../componentes/toast.js';
import { notificarVictoria } from '../../eventos.js';

export function detectarLlave() {
    if (est.tieneLlave) return;

    const celdaX = Math.floor(est.posicion.x);
    const celdaY = Math.floor(est.posicion.y);

    if (celdaY === est.llaveFila && celdaX === est.llaveCol) {
        est.tieneLlave = true;
        est.indicador.replaceChildren();
        const imgObtenida = document.createElement('img');
        imgObtenida.src = 'assets/img/llaves/cofre-laberinto3d-icono.webp';
        imgObtenida.alt = '';
        imgObtenida.className = 'indicador-llave-img';
        est.indicador.appendChild(imgObtenida);
        est.indicador.appendChild(document.createTextNode(' ' + CFG.textos.indicadorLlaveObtenida));
        est.indicador.classList.add('llave-obtenida');

        actualizarHUDInventarioLocal();
        lanzarToast(CFG.textos.toastLlave, '\u2728', 'item');
    }
}

export function detectarSalida(limpiarLaberinto3d) {
    if (!est.tieneLlave) return;

    const celdaX = Math.floor(est.posicion.x);
    const celdaY = Math.floor(est.posicion.y);

    if (celdaY === est.entradaFila && celdaX === est.entradaCol) {
        est.activo = false;
        est.mensajeExito.textContent = CFG.textos.mensajeExito;
        est.mensajeExito.classList.remove('oculto');
        lanzarToast(CFG.textos.mensajeExito, '\uD83D\uDEAA', 'exito');
        notificarVictoria();

        setTimeout(function () {
            limpiarLaberinto3d();
            est.callbackSalir();
        }, CFG.meta.timeoutExito);
    }
}
