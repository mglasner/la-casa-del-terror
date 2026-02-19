// Libro generalizado — núcleo reutilizable para Heroario y Villanario

import { crearElemento } from '../utils.js';

// Crea cabecera reutilizable (avatar + nombre)
export function crearCabecera(nombre, datos, claseAvatar) {
    const frag = document.createDocumentFragment();

    const avatarDiv = crearElemento('div', 'avatar ' + (claseAvatar || ''));
    const img = document.createElement('img');
    img.src = datos.img;
    img.alt = nombre;
    avatarDiv.appendChild(img);
    frag.appendChild(avatarDiv);

    const cabecera = crearElemento('div', 'libro-detalle-cabecera');
    cabecera.appendChild(crearElemento('h3', null, nombre));
    frag.appendChild(cabecera);

    return frag;
}

// Construye un libro completo (índice + detalle + navegación)
// opciones: { entidades, generarDetalle, claseRaiz, ordenar, crearItemIndice, crearSeparador, titulo, subtitulo, pieContenido }
export function crearLibro(opciones) {
    const entidades = opciones.entidades;
    const generarDetalle = opciones.generarDetalle;
    const claseRaiz = opciones.claseRaiz;
    const ordenar =
        opciones.ordenar ||
        function (nombres) {
            return nombres.slice().sort();
        };
    const crearItemIndice =
        opciones.crearItemIndice ||
        function (nombre) {
            return nombre;
        };
    const crearSeparador =
        opciones.crearSeparador ||
        function () {
            return false;
        };
    const titulo = opciones.titulo || '';
    const subtitulo = opciones.subtitulo || '';
    const pieContenido = opciones.pieContenido || null;

    const nombres = ordenar(Object.keys(entidades));
    let indiceActual = 0;
    let transicionEnCurso = false;

    const libro = crearElemento('div', claseRaiz + ' ' + entidades[nombres[0]].clase);

    // --- Página izquierda: índice ---
    const paginaIzq = crearElemento('div', 'libro-pagina libro-pagina-izq');

    if (titulo) {
        paginaIzq.appendChild(crearElemento('h3', 'libro-titulo', titulo));
    }
    if (subtitulo) {
        paginaIzq.appendChild(crearElemento('p', 'libro-subtitulo', subtitulo));
    }

    paginaIzq.appendChild(crearElemento('div', 'libro-ornamento'));

    const listaIndice = crearElemento('ul', 'libro-indice');
    nombres.forEach(function (nombre, i) {
        const datos = entidades[nombre];

        // Separador opcional entre grupos
        if (crearSeparador(nombres, i)) {
            const sep = crearElemento('li', 'libro-indice-sep');
            sep.setAttribute('aria-hidden', 'true');
            listaIndice.appendChild(sep);
        }

        const item = crearElemento('li', 'libro-indice-item');
        item.dataset.nombre = nombre;
        item.dataset.indice = i;
        item.tabIndex = 0;
        item.textContent = crearItemIndice(nombre, datos);

        if (i === 0) item.classList.add('libro-indice-activo');

        item.addEventListener('click', function () {
            navegarA(i);
        });
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                navegarA(i);
            }
        });

        listaIndice.appendChild(item);
    });
    paginaIzq.appendChild(listaIndice);
    paginaIzq.appendChild(crearElemento('div', 'libro-ornamento'));

    // --- Lomo con costuras ---
    const lomo = crearElemento('div', 'libro-lomo');
    for (let i = 0; i < 3; i++) {
        lomo.appendChild(crearElemento('div', 'libro-lomo-costura'));
    }

    // --- Página derecha: detalle ---
    const paginaDer = crearElemento('div', 'libro-pagina libro-pagina-der');

    // Esquinas ornamentales
    ['tl', 'tr', 'bl', 'br'].forEach(function (pos) {
        paginaDer.appendChild(crearElemento('div', 'libro-esquina libro-esquina-' + pos));
    });

    const detalleWrap = crearElemento('div', 'libro-detalle-wrap');
    detalleWrap.appendChild(generarDetalle(nombres[0]));
    paginaDer.appendChild(detalleWrap);

    // Navegación inferior
    const nav = crearElemento('div', 'libro-navegacion');

    const btnAnterior = crearElemento('button', 'libro-nav-btn', '\u2039');
    btnAnterior.type = 'button';
    btnAnterior.disabled = true;
    btnAnterior.addEventListener('click', function () {
        navegarA(indiceActual - 1);
    });

    const contador = crearElemento('span', 'libro-nav-contador', '1 / ' + nombres.length);

    const btnSiguiente = crearElemento('button', 'libro-nav-btn', '\u203A');
    btnSiguiente.type = 'button';
    btnSiguiente.disabled = nombres.length <= 1;
    btnSiguiente.addEventListener('click', function () {
        navegarA(indiceActual + 1);
    });

    nav.appendChild(btnAnterior);
    nav.appendChild(contador);
    nav.appendChild(btnSiguiente);
    paginaDer.appendChild(nav);

    // Pie de contenido opcional (ej: botón Empezar del Heroario)
    if (pieContenido) {
        pieContenido(paginaDer, function () {
            return nombres[indiceActual];
        });
    }

    // Ensamblar libro
    libro.appendChild(paginaIzq);
    libro.appendChild(lomo);
    libro.appendChild(paginaDer);

    // --- Navegación con crossfade ---
    function navegarA(nuevoIndice) {
        if (transicionEnCurso) return;
        if (nuevoIndice < 0 || nuevoIndice >= nombres.length) return;
        if (nuevoIndice === indiceActual) return;

        transicionEnCurso = true;
        const contenidoActual = detalleWrap.querySelector('.libro-detalle-contenido');

        if (contenidoActual) {
            contenidoActual.classList.add('libro-fade-out');
        }

        setTimeout(function () {
            const tabAnterior = (contenidoActual && contenidoActual._tabActivo) || 'perfil';
            detalleWrap.replaceChildren();
            const nuevoContenido = generarDetalle(nombres[nuevoIndice], tabAnterior);
            nuevoContenido.classList.add('libro-fade-in');
            detalleWrap.appendChild(nuevoContenido);

            // Propagar clase de la entidad al libro
            libro.className = claseRaiz + ' ' + entidades[nombres[nuevoIndice]].clase;

            indiceActual = nuevoIndice;
            actualizarIndice();

            setTimeout(function () {
                nuevoContenido.classList.remove('libro-fade-in');
                transicionEnCurso = false;
            }, 350);
        }, 300);
    }

    function actualizarIndice() {
        const items = listaIndice.querySelectorAll('.libro-indice-item');
        items.forEach(function (item, i) {
            item.classList.toggle('libro-indice-activo', i === indiceActual);
        });

        btnAnterior.disabled = indiceActual === 0;
        btnSiguiente.disabled = indiceActual === nombres.length - 1;
        contador.textContent = indiceActual + 1 + ' / ' + nombres.length;
    }

    // Navegación por teclado (flechas dentro del libro)
    function manejarTecladoLibro(e) {
        if (!libro.contains(document.activeElement) && document.activeElement !== document.body) {
            return;
        }

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navegarA(indiceActual - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navegarA(indiceActual + 1);
        }
    }

    return {
        libro: libro,
        manejarTecladoLibro: manejarTecladoLibro,
        getNombreActual: function () {
            return nombres[indiceActual];
        },
    };
}
