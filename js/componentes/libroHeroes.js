// Heroario — libro de héroes como vista principal (inline, no modal)

import { crearElemento } from '../utils.js';
import { PERSONAJES } from '../personajes.js';
import { llenarStats } from './stats.js';
import { crearLibro, crearCabecera } from './libro.js';

// Genera el contenido de detalle para un héroe (2 paneles + tabs)
function generarDetalle(nombre, tabInicial) {
    const datos = PERSONAJES[nombre];
    const clasePersonaje = datos.clase.replace('jugador-', 'personaje-');
    const mostrarStats = tabInicial === 'stats';
    const contenido = crearElemento('div', 'libro-detalle-contenido');
    contenido.className = 'libro-detalle-contenido ' + clasePersonaje;
    contenido._tabActivo = mostrarStats ? 'stats' : 'perfil';

    // --- Tabs ---
    const tabs = crearElemento('div', 'libro-tabs');
    const tabPerfil = crearElemento(
        'button',
        'libro-tab' + (mostrarStats ? '' : ' libro-tab-activo'),
        'Perfil'
    );
    tabPerfil.type = 'button';
    const tabStats = crearElemento(
        'button',
        'libro-tab' + (mostrarStats ? ' libro-tab-activo' : ''),
        'Habilidades'
    );
    tabStats.type = 'button';
    tabs.appendChild(tabPerfil);
    tabs.appendChild(tabStats);
    contenido.appendChild(tabs);

    // --- Panel Perfil ---
    const panelPerfil = crearElemento(
        'div',
        'libro-panel' + (mostrarStats ? '' : ' libro-panel-activo')
    );
    panelPerfil.appendChild(crearCabecera(nombre, datos));
    panelPerfil.appendChild(crearElemento('div', 'libro-ornamento'));
    panelPerfil.appendChild(
        crearElemento('p', 'descripcion libro-descripcion-grande', datos.descripcion)
    );
    contenido.appendChild(panelPerfil);

    // --- Panel Habilidades ---
    const panelStats = crearElemento(
        'div',
        'libro-panel' + (mostrarStats ? ' libro-panel-activo' : '')
    );
    panelStats.appendChild(crearCabecera(nombre, datos, 'libro-avatar-mini'));

    // Contenedores para llenarStats
    panelStats.appendChild(crearElemento('p', 'descripcion', ''));
    panelStats.appendChild(crearElemento('div', 'stats'));

    // llenarStats busca .descripcion y .stats dentro del contenedor
    llenarStats(panelStats, datos);

    // Ocultar la descripción duplicada del panel stats (llenarStats la llena pero no la necesitamos)
    const descOculta = panelStats.querySelector('.descripcion');
    if (descOculta) descOculta.style.display = 'none';

    contenido.appendChild(panelStats);

    // --- Lógica de tabs ---
    tabPerfil.addEventListener('click', function () {
        tabPerfil.classList.add('libro-tab-activo');
        tabStats.classList.remove('libro-tab-activo');
        panelPerfil.classList.add('libro-panel-activo');
        panelStats.classList.remove('libro-panel-activo');
        contenido._tabActivo = 'perfil';
    });
    tabStats.addEventListener('click', function () {
        tabStats.classList.add('libro-tab-activo');
        tabPerfil.classList.remove('libro-tab-activo');
        panelStats.classList.add('libro-panel-activo');
        panelPerfil.classList.remove('libro-panel-activo');
        contenido._tabActivo = 'stats';
    });

    return contenido;
}

// Entidades adaptadas para el libro: clase debe ser personaje-X (no jugador-X)
function adaptarEntidades() {
    const adaptado = {};
    Object.keys(PERSONAJES).forEach(function (nombre) {
        const datos = PERSONAJES[nombre];
        adaptado[nombre] = Object.create(datos);
        adaptado[nombre].clase = datos.clase.replace('jugador-', 'personaje-');
    });
    return adaptado;
}

export function crearLibroHeroes(contenedor) {
    const entidades = adaptarEntidades();

    const { libro, manejarTecladoLibro, getNombreActual } = crearLibro({
        entidades: entidades,
        generarDetalle: generarDetalle,
        claseRaiz: 'libro-heroes',
        titulo: 'Heroario',
        subtitulo: 'Elige tu personaje',
        pieContenido: function (paginaDer, obtenerNombreActual) {
            const btnEmpezar = crearElemento(
                'button',
                'btn-empezar libro-heroes-empezar',
                '¡Empezar!'
            );
            btnEmpezar.type = 'button';
            btnEmpezar.addEventListener('click', function () {
                document.dispatchEvent(
                    new CustomEvent('heroe-seleccionado', {
                        detail: { nombre: obtenerNombreActual() },
                    })
                );
            });
            paginaDer.appendChild(btnEmpezar);
        },
    });

    contenedor.appendChild(libro);

    // Activar teclado
    document.addEventListener('keydown', manejarTecladoLibro);

    return {
        getNombreActual: getNombreActual,
        destruir: function () {
            document.removeEventListener('keydown', manejarTecladoLibro);
            libro.remove();
        },
    };
}
