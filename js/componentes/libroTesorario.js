// El Tesorario — libro de tesoros coleccionables
// Muestra tesoros encontrados con presentación adaptada al tier

import { TESOROS } from '../tesoros.js';
import { crearElemento } from '../utils.js';
import { crearLibro, generarPortada } from './libro.js';

const NOMBRES_JUEGOS = {
    laberinto: 'El Laberinto',
    laberinto3d: 'El Laberinto 3D',
    memorice: 'El Memorice',
    abismo: 'El Abismo',
    ajedrez: 'El Ajedrez',
};

// Orden: curioso → raro → épico → legendario → mítico
const ORDEN_TIER = ['curioso', 'raro', 'epico', 'legendario', 'mitico'];

function esTierAlto(tier) {
    return ORDEN_TIER.indexOf(tier) >= 2;
}

// Entidades con flag `encontrado` — se setea antes de crear el libro
// porque ordenar() y generarDetalle() necesitan acceso a los datos
let entidadesActuales = {};

function construirEntidades(encontrados) {
    const entidades = {};
    for (const [nombre, datos] of Object.entries(TESOROS)) {
        entidades[nombre] = { ...datos, encontrado: encontrados.has(nombre) };
    }
    return entidades;
}

function ordenarPorTier(nombres) {
    return nombres.slice().sort(function (a, b) {
        const tierA = ORDEN_TIER.indexOf(entidadesActuales[a].tier);
        const tierB = ORDEN_TIER.indexOf(entidadesActuales[b].tier);
        return tierA - tierB;
    });
}

function generarInfoJuegos(juegos) {
    if (!Array.isArray(juegos) || juegos.length === 0) return null;
    const nombres = juegos.map(function (slug) {
        return NOMBRES_JUEGOS[slug] || slug;
    });
    return crearElemento('p', 'tesorario-juegos', 'Se encuentra en: ' + nombres.join(', '));
}

function generarDetalleTesoro(nombre) {
    const datos = entidadesActuales[nombre];
    const tier = datos.tier;
    const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
    const contenido = crearElemento(
        'div',
        'libro-detalle-contenido tesorario-detalle ' + datos.clase
    );

    contenido.appendChild(
        crearElemento('span', 'tesorario-tier-badge tesorario-tier-' + tier, tierLabel)
    );

    if (!datos.encontrado) {
        const visual = crearElemento('div', 'tesorario-visual tesorario-visual-bloqueado');
        const img = crearElemento('img', 'tesorario-img tesorario-img-bloqueado');
        img.src = datos.img;
        img.alt = nombre;
        img.draggable = false;
        visual.appendChild(img);
        visual.appendChild(crearElemento('div', 'tesorario-candado', '\uD83D\uDD12'));
        contenido.appendChild(visual);
        contenido.appendChild(
            crearElemento('h2', 'tesorario-nombre tesorario-nombre-bloqueado', nombre)
        );
    } else {
        const visual = crearElemento('div', 'tesorario-visual tesorario-visual-' + tier);
        const tieneSprite = datos.sprite && datos.frames;

        if (tieneSprite) {
            const sprite = crearElemento('div', 'tesorario-sprite');
            sprite.style.backgroundImage = 'url(' + datos.sprite + ')';
            sprite.style.setProperty('--frames', datos.frames);
            visual.appendChild(sprite);
            visual.appendChild(crearElemento('div', 'tesorario-aura tesorario-aura-' + tier));
        } else {
            const img = crearElemento('img', 'tesorario-img');
            img.src = datos.img;
            img.alt = nombre;
            img.draggable = false;
            visual.appendChild(img);
        }

        if (esTierAlto(tier)) {
            for (let i = 0; i < 8; i++) {
                const p = crearElemento('div', 'tesorario-particula');
                p.style.setProperty('--dur', 2.5 + Math.random() * 2.5 + 's');
                p.style.setProperty('--delay', -Math.random() * 3 + 's');
                visual.appendChild(p);
            }
        }

        contenido.appendChild(visual);
        contenido.appendChild(crearElemento('h2', 'tesorario-nombre', nombre));
    }

    contenido.appendChild(crearElemento('div', 'libro-ornamento'));
    if (datos.descripcion) {
        contenido.appendChild(crearElemento('p', 'tesorario-desc', datos.descripcion.trim()));
    }
    const infoJuegos = generarInfoJuegos(datos.juegos);
    if (infoJuegos) contenido.appendChild(infoJuegos);

    return contenido;
}

function generarPrologo(encontrados) {
    const contenido = crearElemento('div', 'libro-detalle-contenido libro-intro');
    contenido.appendChild(crearElemento('h2', 'libro-intro-game-titulo', 'El Tesorario'));
    contenido.appendChild(crearElemento('div', 'libro-ornamento'));

    const texto = crearElemento('div', 'libro-intro-texto');
    const total = Object.keys(TESOROS).length;
    const cant = encontrados.size;

    if (cant >= total) {
        texto.appendChild(
            crearElemento(
                'p',
                null,
                '¡Felicidades! Has encontrado todos los tesoros. Eres un verdadero explorador del Relatario.'
            )
        );
    } else {
        texto.appendChild(
            crearElemento(
                'p',
                null,
                'Cada victoria en un desafío puede revelar un tesoro misterioso. Algunos son comunes, otros extraordinariamente raros.'
            )
        );
        texto.appendChild(
            crearElemento(
                'p',
                null,
                'Explora cada rincón del Relatario y completa los desafíos para descubrir las diez reliquias ocultas.'
            )
        );
    }

    texto.appendChild(
        crearElemento('p', 'libro-intro-cta', 'Tesoros descubiertos: ' + cant + ' / ' + total)
    );
    contenido.appendChild(texto);

    return contenido;
}

function necesitaSeparadorTesoro(nombres, i) {
    if (i === 0) return false;
    return entidadesActuales[nombres[i]].tier !== entidadesActuales[nombres[i - 1]].tier;
}

/**
 * Crea el libro El Tesorario.
 * @param {Set<string>} encontrados - nombres de tesoros encontrados
 */
export function crearLibroTesorario(encontrados) {
    const entidades = construirEntidades(encontrados);
    entidadesActuales = entidades;

    return crearLibro({
        entidades,
        generarDetalle: generarDetalleTesoro,
        claseRaiz: 'libro-tesorario',
        ordenar: ordenarPorTier,
        crearSeparador: necesitaSeparadorTesoro,
        crearItemIndice: function (nombre, datos) {
            return datos.encontrado ? nombre : '\uD83D\uDD12 ' + nombre;
        },
        titulo: 'El Tesorario',
        subtitulo: 'Reliquias y tesoros',
        tituloEntidades: 'Tesoros',
        paginaInicio: {
            textoIndice: 'Portada',
            textoSeccion: 'Portada',
            generarContenido: function () {
                return generarPortada(
                    'El Tesorario',
                    'assets/img/biblioteca/portada-tesorario.webp'
                );
            },
        },
        paginasExtras: [
            {
                textoIndice: 'Prólogo',
                generarContenido: function () {
                    return generarPrologo(encontrados);
                },
            },
        ],
    });
}
