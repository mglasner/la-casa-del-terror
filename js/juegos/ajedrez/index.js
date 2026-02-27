// El Ajedrez — Juego de ajedrez vs IA
// Flujo: Dificultad + Color → Ejército héroes → auto villanos → Partida

import { CFG } from './config.js';
import { PERSONAJES } from '../../personajes.js';
import { crearPantallaJuego } from '../../componentes/pantallaJuego.js';
import { lanzarToast } from '../../componentes/toast.js';
import { crearElemento } from '../../utils.js';
import { notificarVidaCambio, notificarVictoria } from '../../eventos.js';
import { generarEquipoEnemigo, generarEquipoHeroes } from '../ajedrez-comun/piezas.js';
import { crearModoPortrait } from '../../componentes/modoPortrait.js';
import { crearTablero } from '../ajedrez-comun/tablero.js';
import { crearPanelEjercito } from '../ajedrez-comun/ejercito.js';
import {
    nuevaPartida,
    obtenerEstado,
    moverJugador,
    moverIA,
    movimientosValidos,
    esTurnoJugador,
    obtenerTurno,
    hayJaque,
    hayJaqueMate,
    hayTablas,
    partidaTerminada,
} from '../ajedrez-comun/motor.js';

// --- Estado del modulo ---

let jugador = null;
let callbackSalir = null;
let pantalla = null;
let tablero = null;
let bloqueado = false;
let casillaSeleccionada = null;
let movimientosDisponibles = [];
let colorElegido = 'white';
let timeoutIA = null;
let timeoutFin = null;
let equipoHeroes = null;
let equipoVillanos = null;
let modoPortrait = null;

// --- Selector de dificultad, color y ejercito ---

function crearSelectorInicial(onElegir, onVolver) {
    const overlay = crearElemento('div', 'ajedrez-dificultad-overlay');
    const panel = crearElemento('div', 'ajedrez-dificultad-panel');

    let colorSel = CFG.color.opciones[CFG.color.default].valor;
    let nivelSel = CFG.dificultad.opciones[CFG.dificultad.default].nivel;

    // --- Pantalla 1: Config IA (color + dificultad) ---
    const pantallaIA = crearElemento('div', 'ajedrez-selector-pantalla');
    panel.appendChild(pantallaIA);

    function mostrarConfigIA() {
        pantallaIA.innerHTML = '';

        // Color
        pantallaIA.appendChild(
            crearElemento('h3', 'ajedrez-dificultad-titulo', CFG.textos.eligeColor)
        );
        const opcionesColor = crearElemento('div', 'ajedrez-dificultad-opciones');
        const botonesColor = [];

        CFG.color.opciones.forEach(function (opcion, i) {
            const btn = crearElemento(
                'button',
                'ajedrez-dificultad-btn ajedrez-color-btn',
                opcion.nombre
            );
            btn.type = 'button';
            if (i === CFG.color.default) btn.classList.add('ajedrez-color-activo');
            btn.addEventListener('click', function () {
                colorSel = opcion.valor;
                botonesColor.forEach(function (b) {
                    b.classList.remove('ajedrez-color-activo');
                });
                btn.classList.add('ajedrez-color-activo');
            });
            botonesColor.push(btn);
            opcionesColor.appendChild(btn);
        });
        pantallaIA.appendChild(opcionesColor);

        // Dificultad
        pantallaIA.appendChild(
            crearElemento(
                'h3',
                'ajedrez-dificultad-titulo ajedrez-dificultad-titulo-segundo',
                'Elige la dificultad'
            )
        );
        const opcionesDif = crearElemento('div', 'ajedrez-dificultad-opciones');
        const botonesDif = [];

        CFG.dificultad.opciones.forEach(function (opcion, i) {
            const btn = crearElemento('button', 'ajedrez-dificultad-btn', opcion.nombre);
            btn.type = 'button';
            if (i === CFG.dificultad.default) btn.classList.add('ajedrez-dificultad-activo');
            btn.addEventListener('click', function () {
                nivelSel = opcion.nivel;
                botonesDif.forEach(function (b) {
                    b.classList.remove('ajedrez-dificultad-activo');
                });
                btn.classList.add('ajedrez-dificultad-activo');
            });
            botonesDif.push(btn);
            opcionesDif.appendChild(btn);
        });
        pantallaIA.appendChild(opcionesDif);

        // Acciones: Volver al libro + Siguiente
        const acciones = crearElemento('div', 'ajedrez-acciones');

        const btnVolver = crearElemento(
            'button',
            'ajedrez-btn-iniciar ajedrez-btn-volver',
            'Volver'
        );
        btnVolver.type = 'button';
        btnVolver.addEventListener('click', onVolver);
        acciones.appendChild(btnVolver);

        const btnSig = crearElemento('button', 'ajedrez-btn-iniciar', 'Siguiente \u2192');
        btnSig.type = 'button';
        btnSig.addEventListener('click', function () {
            pantallaIA.classList.add('oculto');
            mostrarPanelHeroes();
        });
        acciones.appendChild(btnSig);
        pantallaIA.appendChild(acciones);
    }

    // --- Pantalla 2: Ejercito Heroes ---
    const pantalla2 = crearElemento('div', 'ajedrez-selector-pantalla oculto');
    panel.appendChild(pantalla2);

    function mostrarPanelHeroes() {
        pantalla2.innerHTML = '';
        const presel = generarEquipoHeroes();
        const todosHeroes = Object.values(PERSONAJES);
        const masculinos = todosHeroes.filter(function (p) {
            return p.genero === 'masculino';
        });
        const femeninos = todosHeroes.filter(function (p) {
            return p.genero === 'femenino';
        });
        const restricciones = {
            rey: masculinos,
            reina: femeninos,
            torre: todosHeroes,
            alfil: todosHeroes,
            caballo: todosHeroes,
            peon: todosHeroes,
        };

        const { panel: panelEj, obtenerEquipo } = crearPanelEjercito(
            'Arma tu ejército',
            restricciones,
            presel
        );
        pantalla2.appendChild(panelEj);

        // Acciones: Volver + Jugar
        const acciones = crearElemento('div', 'ajedrez-acciones');

        const btnVolver = crearElemento(
            'button',
            'ajedrez-btn-iniciar ajedrez-btn-volver',
            'Volver'
        );
        btnVolver.type = 'button';
        btnVolver.addEventListener('click', function () {
            pantalla2.classList.add('oculto');
            pantallaIA.classList.remove('oculto');
        });
        acciones.appendChild(btnVolver);

        const btnJugar = crearElemento('button', 'ajedrez-btn-iniciar', 'Jugar');
        btnJugar.type = 'button';
        btnJugar.addEventListener('click', function () {
            equipoHeroes = obtenerEquipo();
            equipoVillanos = generarEquipoEnemigo();
            overlay.remove();
            onElegir(nivelSel, colorSel, equipoHeroes, equipoVillanos);
        });
        acciones.appendChild(btnJugar);
        pantalla2.appendChild(acciones);
        pantalla2.classList.remove('oculto');
    }

    mostrarConfigIA();
    overlay.appendChild(panel);
    return overlay;
}

// --- Logica de clics ---

function onClickCelda(casilla) {
    if (bloqueado) return;
    if (!esTurnoJugador()) return;

    // Si hay una pieza seleccionada y el clic es en un movimiento valido
    if (casillaSeleccionada && movimientosDisponibles.includes(casilla)) {
        ejecutarMovimientoJugador(casillaSeleccionada, casilla);
        return;
    }

    // Si hace clic en la misma casilla, deseleccionar
    if (casillaSeleccionada === casilla) {
        deseleccionar();
        return;
    }

    // Intentar seleccionar una pieza propia
    const estado = obtenerEstado();
    const pieza = estado.pieces[casilla];
    if (!pieza) {
        deseleccionar();
        return;
    }

    // Validar que la pieza sea del turno actual
    const turnoActual = obtenerTurno();
    const esBlanca = pieza === pieza.toUpperCase();
    const esDelTurno = turnoActual === 'white' ? esBlanca : !esBlanca;
    if (!esDelTurno) {
        deseleccionar();
        return;
    }

    // Solo piezas del color del jugador
    const esPropia = colorElegido === 'white' ? esBlanca : !esBlanca;
    if (!esPropia) {
        deseleccionar();
        return;
    }

    const movs = movimientosValidos(casilla);
    if (movs.length === 0) {
        deseleccionar();
        return;
    }

    // Seleccionar pieza y mostrar movimientos
    tablero.limpiarResaltado();
    casillaSeleccionada = casilla;
    movimientosDisponibles = movs;
    tablero.resaltarSeleccion(casilla);
    tablero.resaltarMovimientos(movs);
}

function deseleccionar() {
    casillaSeleccionada = null;
    movimientosDisponibles = [];
    if (tablero) tablero.limpiarResaltado();
}

async function ejecutarMovimientoJugador(desde, hasta) {
    bloqueado = true;
    deseleccionar();

    await tablero.animarMovimiento(desde, hasta);

    moverJugador(desde, hasta);

    const estado = obtenerEstado();
    tablero.actualizar(estado);
    tablero.marcarUltimoMovimiento(desde, hasta);

    if (verificarFinPartida()) return;

    if (hayJaque()) {
        tablero.indicarJaque(true, estado.turn);
        lanzarToast(CFG.textos.toastJaque, '\u265A', 'dano');
    } else {
        tablero.indicarJaque(false);
    }

    tablero.marcarTurno(obtenerTurno());
    timeoutIA = setTimeout(ejecutarMovimientoIA, CFG.ia.retardoMovimiento);
}

async function ejecutarMovimientoIA() {
    if (!tablero) return;

    const tableroRef = tablero;
    const { desde, hasta } = moverIA();

    await tableroRef.animarMovimiento(desde, hasta);

    if (!tablero) return;

    const estado = obtenerEstado();
    tablero.actualizar(estado);
    tablero.marcarUltimoMovimiento(desde, hasta);

    if (verificarFinPartida()) return;

    if (hayJaque()) {
        tablero.indicarJaque(true, estado.turn);
        lanzarToast(CFG.textos.toastJaque, '\u265A', 'dano');
    } else {
        tablero.indicarJaque(false);
    }

    tablero.marcarTurno(obtenerTurno());
    bloqueado = false;
}

function verificarFinPartida() {
    if (hayJaqueMate()) {
        const ganoJugador = !esTurnoJugador();
        if (ganoJugador) {
            victoria();
        } else {
            derrota();
        }
        return true;
    }
    if (hayTablas() || partidaTerminada()) {
        tablas();
        return true;
    }
    return false;
}

function victoria() {
    bloqueado = true;

    const min = CFG.curacion.victoriaMin;
    const max = CFG.curacion.victoriaMax;
    const cantidad = Math.floor(Math.random() * (max - min + 1)) + min;
    jugador.vidaActual = Math.min(jugador.vidaActual + cantidad, jugador.vidaMax);
    notificarVidaCambio();
    notificarVictoria();

    lanzarToast(CFG.textos.toastVictoria, '\u2728', 'exito');

    timeoutFin = setTimeout(function () {
        limpiarAjedrez();
        callbackSalir();
    }, CFG.meta.tiempoVictoria);
}

function derrota() {
    bloqueado = true;
    lanzarToast(CFG.textos.toastDerrota, '\u265A', 'dano');

    timeoutFin = setTimeout(function () {
        limpiarAjedrez();
        callbackSalir();
    }, CFG.meta.tiempoVictoria);
}

function tablas() {
    bloqueado = true;
    lanzarToast(CFG.textos.toastTablas, '\u00BD', 'item');

    timeoutFin = setTimeout(function () {
        limpiarAjedrez();
        callbackSalir();
    }, CFG.meta.tiempoVictoria);
}

function huir() {
    limpiarAjedrez();
    callbackSalir();
}

// --- Handler de teclado ---

function onKeyDown(e) {
    if (e.key === 'Escape') huir();
}

// --- Iniciar partida tras seleccion ---

function iniciarPartida(nivel, color, eqHeroes, eqVillanos) {
    colorElegido = color;
    equipoHeroes = eqHeroes;
    equipoVillanos = eqVillanos;

    // Actualizar jugador al rey del ejercito
    const reyHeroes = eqHeroes.rey;
    jugador.nombre = reyHeroes.nombre;
    jugador.img = reyHeroes.img;
    jugador.clase = reyHeroes.clase;
    notificarVidaCambio();

    nuevaPartida(nivel, colorElegido);

    tablero = crearTablero({
        equipoVillanos,
        equipoHeroes,
        colorJugador: colorElegido,
        onClickCelda,
    });

    pantalla.appendChild(tablero.contenedor);

    const estado = obtenerEstado();
    tablero.actualizar(estado);
    tablero.marcarTurno(obtenerTurno());

    if (colorElegido === 'black') {
        // IA juega primero (blancas)
        bloqueado = true;
        timeoutIA = setTimeout(ejecutarMovimientoIA, CFG.ia.retardoMovimiento);
    } else {
        bloqueado = false;
    }
}

// --- API publica ---

/**
 * Inicia El Ajedrez.
 * @param {Object} jugadorRef - Personaje seleccionado
 * @param {Function} callback - Callback para volver al Libro de Juegos
 * @param {Object} [dpadRef] - Controles touch D-pad (se oculta)
 */
export function iniciarAjedrez(jugadorRef, callback, dpadRef) {
    jugador = jugadorRef;
    callbackSalir = callback;
    bloqueado = true;
    casillaSeleccionada = null;
    movimientosDisponibles = [];
    colorElegido = 'white';
    equipoHeroes = null;
    equipoVillanos = null;

    if (dpadRef) dpadRef.ocultar();

    modoPortrait = crearModoPortrait();
    modoPortrait.activar();

    ({ pantalla } = crearPantallaJuego('pantalla-ajedrez', 'juego-ajedrez', CFG.meta.titulo, huir));

    document.getElementById('juego').appendChild(pantalla);

    const selector = crearSelectorInicial(iniciarPartida, huir);
    pantalla.appendChild(selector);

    document.addEventListener('keydown', onKeyDown);
}

/** Limpia y destruye El Ajedrez */
export function limpiarAjedrez() {
    clearTimeout(timeoutIA);
    clearTimeout(timeoutFin);
    timeoutIA = null;
    timeoutFin = null;

    document.removeEventListener('keydown', onKeyDown);

    if (pantalla) {
        pantalla.remove();
        pantalla = null;
    }

    tablero = null;
    bloqueado = false;
    casillaSeleccionada = null;
    movimientosDisponibles = [];
    equipoHeroes = null;
    equipoVillanos = null;

    if (modoPortrait) {
        modoPortrait.desactivar();
        modoPortrait = null;
    }
}
