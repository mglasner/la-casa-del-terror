// Panel de asignacion de ejercito — compartido entre El Ajedrez y El Duelo de Ajedrez
// Permite asignar personajes a roles con auto-swap

import { crearElemento } from '../../utils.js';

export const ROLES = [
    { id: 'rey', icono: '\u265A', nombre: 'Rey' },
    { id: 'reina', icono: '\u265B', nombre: 'Reina' },
    { id: 'torre', icono: '\u265C', nombre: 'Torre' },
    { id: 'alfil', icono: '\u265D', nombre: 'Alfil' },
    { id: 'caballo', icono: '\u265E', nombre: 'Caballo' },
    { id: 'peon', icono: '\u265F', nombre: 'Peón' },
];

/**
 * Crea un panel de asignacion de ejercito con auto-swap.
 * Al elegir un personaje que ya esta en otro rol, se intercambian automaticamente.
 * @param {string} titulo - Encabezado
 * @param {Object} restricciones - { rol: [personajes disponibles] }
 * @param {Object} preseleccion - { peon, torre, caballo, alfil, rey, reina }
 * @returns {{ panel: HTMLElement, obtenerEquipo: Function }}
 */
export function crearPanelEjercito(titulo, restricciones, preseleccion) {
    const contenedor = crearElemento('div', 'ajedrez-ejercito');
    contenedor.appendChild(crearElemento('h3', 'ajedrez-ejercito-titulo', titulo));

    // Estado de asignaciones: { rol: personaje }
    const asignaciones = {};
    // Mapa de botones por fila para actualizar visualmente
    const botonesPorFila = {};

    ROLES.forEach(function (rol) {
        asignaciones[rol.id] = preseleccion[rol.id] || null;
    });

    // Crear filas
    ROLES.forEach(function (rol) {
        const fila = crearElemento('div', 'ajedrez-ejercito-fila');

        const labelRol = crearElemento('div', 'ajedrez-ejercito-rol');
        labelRol.appendChild(crearElemento('span', 'ajedrez-ejercito-rol-icono', rol.icono));
        labelRol.appendChild(crearElemento('span', null, rol.nombre));
        fila.appendChild(labelRol);

        const opciones = crearElemento('div', 'ajedrez-ejercito-opciones');
        const personajesRol = restricciones[rol.id];
        const esFijo = personajesRol.length === 1;
        const botones = [];

        personajesRol.forEach(function (pj) {
            const img = document.createElement('img');
            img.src = pj.img;
            img.alt = pj.nombre;
            img.title = pj.nombre;
            img.className = 'ajedrez-ejercito-avatar';
            img.draggable = false;

            if (esFijo) {
                img.classList.add('ajedrez-ejercito-fijo', 'ajedrez-ejercito-elegido');
            } else {
                img.addEventListener('click', function () {
                    seleccionarPersonaje(rol.id, pj);
                });
            }

            botones.push(img);
            opciones.appendChild(img);
        });

        botonesPorFila[rol.id] = { botones, personajes: personajesRol };
        fila.appendChild(opciones);
        contenedor.appendChild(fila);
    });

    function seleccionarPersonaje(rolId, pj) {
        const anterior = asignaciones[rolId];

        // Si ya es el mismo, no hacer nada
        if (anterior && anterior.nombre === pj.nombre) return;

        // Buscar si este personaje esta en otro rol → auto-swap
        for (const otroRol of ROLES) {
            if (otroRol.id === rolId) continue;
            if (asignaciones[otroRol.id] && asignaciones[otroRol.id].nombre === pj.nombre) {
                // Swap: el otro rol recibe lo que tenia este
                asignaciones[otroRol.id] = anterior;
                break;
            }
        }

        asignaciones[rolId] = pj;
        refrescarVisual();
    }

    // Nombres asignados en otros roles (para atenuar avatares ya usados)
    function nombresUsados(rolExcluido) {
        const usados = new Set();
        for (const rol of ROLES) {
            if (rol.id === rolExcluido) continue;
            if (asignaciones[rol.id]) usados.add(asignaciones[rol.id].nombre);
        }
        return usados;
    }

    // Refresca el estado visual de todas las filas
    function refrescarVisual() {
        ROLES.forEach(function (rol) {
            const { botones, personajes } = botonesPorFila[rol.id];
            const esFijo = personajes.length === 1;
            if (esFijo) return;

            const elegido = asignaciones[rol.id];
            const usados = nombresUsados(rol.id);
            personajes.forEach(function (pj, i) {
                const btn = botones[i];
                const esElegido = elegido && elegido.nombre === pj.nombre;
                btn.classList.toggle('ajedrez-ejercito-elegido', esElegido);
                btn.classList.toggle('ajedrez-ejercito-usado', !esElegido && usados.has(pj.nombre));
            });
        });
    }

    // Marcar estado inicial
    refrescarVisual();

    function obtenerEquipo() {
        return { ...asignaciones };
    }

    return { panel: contenedor, obtenerEquipo };
}
