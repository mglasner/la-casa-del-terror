// Habitación 3 — El Memorice: generación del tablero de cartas

import { PERSONAJES } from '../../personajes.js';
import { ENEMIGOS } from '../../enemigos.js';

// Mezcla Fisher-Yates
export function mezclar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
}

// Seleccionar N entidades aleatorias de un objeto { nombre: instancia }
function seleccionarAleatorios(entidades, cantidad) {
    const claves = mezclar(Object.keys(entidades));
    return claves.slice(0, cantidad).map(function (clave) {
        return entidades[clave];
    });
}

/**
 * Genera el tablero de cartas para el memorice.
 * Selecciona héroes y villanos aleatorios, crea 2 cartas por entidad y las mezcla.
 * @returns {Array} Array de objetos carta { id, pairId, nombre, img, tipo }
 */
export function generarTablero(numHeroes, numVillanos) {
    const heroes = seleccionarAleatorios(PERSONAJES, numHeroes);
    const villanos = seleccionarAleatorios(ENEMIGOS, numVillanos);

    const cartas = [];
    let id = 0;

    heroes.forEach(function (heroe) {
        const pairId = 'h-' + heroe.nombre;
        cartas.push({ id: id++, pairId, nombre: heroe.nombre, img: heroe.img, tipo: 'heroe' });
        cartas.push({ id: id++, pairId, nombre: heroe.nombre, img: heroe.img, tipo: 'heroe' });
    });

    villanos.forEach(function (villano) {
        const pairId = 'v-' + villano.nombre;
        cartas.push({
            id: id++,
            pairId,
            nombre: villano.nombre,
            img: villano.img,
            tipo: 'villano',
        });
        cartas.push({
            id: id++,
            pairId,
            nombre: villano.nombre,
            img: villano.img,
            tipo: 'villano',
        });
    });

    return mezclar(cartas);
}
