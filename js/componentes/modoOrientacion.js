// Nucleo compartido para modoLandscape y modoPortrait.
// Encapsula deteccion mobile (pointer: coarse), fullscreen, lock de orientacion
// y overlay "gira tu dispositivo". Los wrappers especializados eligen la orientacion.

import { crearOverlayRotar } from './overlayRotar.js';

export function crearModoOrientacion(orientacion, onCambio) {
    const esMobile = window.matchMedia('(pointer: coarse)').matches;
    let overlayRotar = null;
    // AbortController agrupa listeners para limpieza segura
    let ac = null;

    function onFullscreenChange() {
        // Doble rAF: el layout no se actualiza en el mismo frame que fullscreenchange
        if (onCambio) {
            requestAnimationFrame(function () {
                requestAnimationFrame(onCambio);
            });
        }
    }

    function activar() {
        if (overlayRotar) return; // ya activo

        overlayRotar = crearOverlayRotar(orientacion);
        overlayRotar.activar(function () {
            if (onCambio) requestAnimationFrame(onCambio);
        });

        if (esMobile) {
            ac = new AbortController();
            document.addEventListener('fullscreenchange', onFullscreenChange, {
                signal: ac.signal,
            });
            const el = document.documentElement;
            if (el.requestFullscreen) {
                el.requestFullscreen()
                    .then(function () {
                        if (screen.orientation && screen.orientation.lock) {
                            screen.orientation.lock(orientacion).catch(function () {});
                        }
                    })
                    .catch(function () {
                        // Fullscreen no disponible o denegado
                    });
            }
        }
    }

    function desactivar() {
        if (esMobile) {
            if (ac) {
                ac.abort();
                ac = null;
            }
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(function () {});
            }
            if (screen.orientation && screen.orientation.unlock) {
                try {
                    screen.orientation.unlock();
                } catch {
                    // API no disponible
                }
            }
        }

        if (overlayRotar) {
            overlayRotar.desactivar();
            overlayRotar = null;
        }
    }

    return { esMobile, activar, desactivar };
}
