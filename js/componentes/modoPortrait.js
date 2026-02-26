import { crearModoOrientacion } from './modoOrientacion.js';

export function crearModoPortrait(onCambio) {
    return crearModoOrientacion('portrait', onCambio);
}
