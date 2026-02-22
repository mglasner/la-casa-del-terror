// El Ajedrez — Juego de ajedrez con villanos como piezas enemigas
// El jugador elige heroe y enfrenta un ejercito aleatorio de villanos

import { CFG } from './config.js';
import { crearPantallaJuego } from '../../componentes/pantallaJuego.js';
import { lanzarToast } from '../../componentes/toast.js';
import { crearElemento } from '../../utils.js';
import { notificarVidaCambio } from '../../eventos.js';
import { generarEquipoEnemigo } from './piezas.js';
import { crearTablero } from './tablero.js';
import {
    nuevaPartida,
    obtenerEstado,
    moverJugador,
    moverIA,
    movimientosValidos,
    esTurnoJugador,
    hayJaque,
    hayJaqueMate,
    hayTablas,
    partidaTerminada,
} from './motor.js';

// --- Estado del modulo ---

let jugador = null;
let callbackSalir = null;
let pantalla = null;
let tablero = null;
let bloqueado = false;
let casillaSeleccionada = null;
let movimientosDisponibles = [];

// --- Selector de dificultad ---

function crearSelectorDificultad(onElegir) {
    const overlay = crearElemento('div', 'ajedrez-dificultad-overlay');
    const panel = crearElemento('div', 'ajedrez-dificultad-panel');

    panel.appendChild(crearElemento('h3', 'ajedrez-dificultad-titulo', 'Elige la dificultad'));

    const opciones = crearElemento('div', 'ajedrez-dificultad-opciones');
    CFG.dificultad.opciones.forEach(function (opcion, i) {
        const btn = crearElemento('button', 'ajedrez-dificultad-btn', opcion.nombre);
        btn.type = 'button';
        if (i === CFG.dificultad.default) {
            btn.classList.add('ajedrez-dificultad-default');
        }
        btn.addEventListener('click', function () {
            overlay.remove();
            onElegir(opcion.nivel);
        });
        opciones.appendChild(btn);
    });

    panel.appendChild(opciones);
    overlay.appendChild(panel);
    return overlay;
}

// --- Indicador de turno ---

let indicadorTurno = null;

function crearIndicadorTurno() {
    indicadorTurno = crearElemento('div', 'ajedrez-indicador-turno');
    actualizarIndicadorTurno();
    return indicadorTurno;
}

function actualizarIndicadorTurno() {
    if (!indicadorTurno) return;
    const esMiTurno = esTurnoJugador();
    indicadorTurno.textContent = esMiTurno ? CFG.textos.turnoJugador : CFG.textos.turnoIA;
    indicadorTurno.classList.toggle('ajedrez-turno-jugador', esMiTurno);
    indicadorTurno.classList.toggle('ajedrez-turno-ia', !esMiTurno);
}

// --- Logica de clics ---

function onClickCelda(casilla) {
    if (bloqueado || !esTurnoJugador()) return;

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

    // Solo seleccionar piezas blancas
    const esBlanca = pieza === pieza.toUpperCase();
    if (!esBlanca) {
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
    tablero.limpiarResaltado();
}

async function ejecutarMovimientoJugador(desde, hasta) {
    bloqueado = true;
    deseleccionar();

    // Animar movimiento
    await tablero.animarMovimiento(desde, hasta);

    // Ejecutar en el motor
    moverJugador(desde, hasta);

    // Actualizar tablero
    const estado = obtenerEstado();
    tablero.actualizar(estado);
    tablero.marcarUltimoMovimiento(desde, hasta);

    // Verificar fin de partida
    if (verificarFinPartida()) return;

    // Verificar jaque (turno ya cambio a negras tras mover blancas)
    if (hayJaque()) {
        tablero.indicarJaque(true, 'black');
        lanzarToast(CFG.textos.toastJaque, '\u265A', 'dano');
    } else {
        tablero.indicarJaque(false);
    }

    // Turno de la IA
    actualizarIndicadorTurno();
    setTimeout(ejecutarMovimientoIA, CFG.ia.retardoMovimiento);
}

async function ejecutarMovimientoIA() {
    // Guardar referencia al tablero por si se limpia durante la animacion
    const tableroRef = tablero;
    const { desde, hasta } = moverIA();

    // Animar movimiento de la IA
    await tableroRef.animarMovimiento(desde, hasta);

    // Si se limpio durante la animacion (Escape), salir
    if (!tablero) return;

    // Actualizar tablero
    const estado = obtenerEstado();
    tablero.actualizar(estado);
    tablero.marcarUltimoMovimiento(desde, hasta);

    // Verificar fin de partida
    if (verificarFinPartida()) return;

    // Verificar jaque (turno ya cambio a blancas tras mover negras)
    if (hayJaque()) {
        tablero.indicarJaque(true, 'white');
        lanzarToast(CFG.textos.toastJaque, '\u265A', 'dano');
    } else {
        tablero.indicarJaque(false);
    }

    // Devolver turno al jugador
    actualizarIndicadorTurno();
    bloqueado = false;
}

function verificarFinPartida() {
    if (hayJaqueMate()) {
        const ganoJugador = !esTurnoJugador();
        // Despues del mate, el turno queda en quien esta en mate (el que perdio)
        // Si no es turno del jugador, significa que las negras estan en mate → jugador gano
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

    // Curacion por victoria
    const min = CFG.curacion.victoriaMin;
    const max = CFG.curacion.victoriaMax;
    const cantidad = Math.floor(Math.random() * (max - min + 1)) + min;
    jugador.vidaActual = Math.min(jugador.vidaActual + cantidad, jugador.vidaMax);
    notificarVidaCambio();

    lanzarToast(CFG.textos.toastVictoria, '\u2728', 'exito');

    setTimeout(function () {
        limpiarAjedrez();
        callbackSalir();
    }, CFG.meta.tiempoVictoria);
}

function derrota() {
    bloqueado = true;
    lanzarToast(CFG.textos.toastDerrota, '\u265A', 'dano');

    setTimeout(function () {
        limpiarAjedrez();
        callbackSalir();
    }, CFG.meta.tiempoVictoria);
}

function tablas() {
    bloqueado = true;
    lanzarToast(CFG.textos.toastTablas, '\u00BD', 'item');

    setTimeout(function () {
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
    if (e.key === 'Escape') {
        huir();
    }
}

// --- Iniciar partida tras seleccion de dificultad ---

function iniciarPartida(nivel) {
    const equipo = generarEquipoEnemigo();
    nuevaPartida(nivel);

    tablero = crearTablero({
        equipo,
        jugador,
        onClickCelda,
    });

    // Indicador de turno
    pantalla.appendChild(crearIndicadorTurno());

    // Tablero
    pantalla.appendChild(tablero.contenedor);

    // Render inicial
    const estado = obtenerEstado();
    tablero.actualizar(estado);
    bloqueado = false;
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

    // Ocultar D-pad (no se usa en ajedrez)
    if (dpadRef) dpadRef.ocultar();

    ({ pantalla } = crearPantallaJuego('pantalla-ajedrez', 'juego-ajedrez', CFG.meta.titulo, huir));

    document.getElementById('juego').appendChild(pantalla);

    // Mostrar selector de dificultad
    const selector = crearSelectorDificultad(iniciarPartida);
    pantalla.appendChild(selector);

    // Registrar controles
    document.addEventListener('keydown', onKeyDown);
}

/** Limpia y destruye El Ajedrez */
export function limpiarAjedrez() {
    document.removeEventListener('keydown', onKeyDown);

    if (pantalla) {
        pantalla.remove();
        pantalla = null;
    }

    tablero = null;
    indicadorTurno = null;
    bloqueado = false;
    casillaSeleccionada = null;
    movimientosDisponibles = [];
}
