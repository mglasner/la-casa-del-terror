// Libro de Novedades — adapta changelog al motor gen\u00e9rico crearLibro()

import { crearElemento } from '../utils.js';
import { crearLibro, generarPortada } from './libro.js';

// Renderiza la lista de cambios de un mes
function renderizarMes(mes) {
    const contenido = crearElemento('div', 'libro-detalle-contenido libro-novedades-mes');

    contenido.appendChild(crearElemento('h2', 'libro-capitulo-titulo', mes.etiqueta));
    contenido.appendChild(crearElemento('div', 'libro-ornamento'));

    const lista = crearElemento('ul', 'libro-novedades-lista');

    mes.cambios.forEach(function (cambio) {
        const item = crearElemento('li', 'libro-novedades-cambio');

        item.appendChild(crearElemento('span', 'libro-novedades-icono', cambio.icono));

        const cuerpo = crearElemento('div', 'libro-novedades-cuerpo');
        if (cambio.scope) {
            cuerpo.appendChild(crearElemento('span', 'libro-novedades-scope', cambio.scope));
        }
        cuerpo.appendChild(crearElemento('span', 'libro-novedades-texto', cambio.texto));
        item.appendChild(cuerpo);

        lista.appendChild(item);
    });

    contenido.appendChild(lista);

    return contenido;
}

// Crea un libro de novedades a partir de los datos generados por build-changelog
export function crearLibroNovedades(datos) {
    const paginas = datos.meses.map(function (mes) {
        return {
            textoIndice: mes.etiqueta,
            generarContenido: function () {
                return renderizarMes(mes);
            },
        };
    });

    return crearLibro({
        entidades: {},
        generarDetalle: function () {
            return crearElemento('div');
        },
        claseRaiz: 'libro-novedades',
        titulo: datos.titulo,
        subtitulo: datos.subtitulo,
        tituloExtras: 'Meses',
        paginaInicio: {
            textoIndice: 'Portada',
            textoSeccion: 'Portada',
            generarContenido: function () {
                return generarPortada(datos.titulo, 'assets/img/biblioteca/portada-novedades.webp');
            },
        },
        paginasExtras: paginas,
    });
}
