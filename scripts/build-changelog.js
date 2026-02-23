// Script de build: genera js/changelog/registro.js desde git log

import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { execFileSync } from 'child_process';
import prettier from 'prettier';

const SALIDA = 'js/changelog/registro.js';
const CABECERA = '// \u2699\ufe0f GENERADO desde git log \u2014 no editar directamente\n';

// Nombres de meses en espa\u00f1ol
const MESES_ES = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

// Mapeo de tipos a \u00edconos
const ICONOS = {
    feat: '\u2728',
    fix: '\ud83d\udd27',
};

// Mapeo de scopes a nombres amigables
const SCOPES = {
    tesorario: 'El Tesorario',
    abismo: 'El Abismo',
    laberinto: 'El Laberinto',
    laberinto3d: 'El Laberinto 3D',
    memorice: 'El Memorice',
    ajedrez: 'El Ajedrez',
    biblioteca: 'La Biblioteca',
    build: 'El Taller',
    cuentos: 'Los Cuentos',
    pwa: 'La App',
    dpad: 'Los Controles',
    seo: 'SEO',
    heroario: 'El Heroario',
    villanario: 'El Villanario',
    novedades: 'Las Novedades',
};

// Lee la config de Prettier del proyecto
async function leerConfigPrettier() {
    const raw = readFileSync('.prettierrc', 'utf-8');
    return { ...JSON.parse(raw), parser: 'babel' };
}

// Capitaliza la primera letra
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Convierte YYYY-MM a etiqueta legible ("Febrero 2026")
function etiquetaMes(clave) {
    const [anio, mes] = clave.split('-');
    return `${MESES_ES[parseInt(mes, 10) - 1]} ${anio}`;
}

// Obtiene el nombre amigable de un scope
function nombreScope(scope) {
    if (!scope) return '';
    return SCOPES[scope] || capitalizar(scope);
}

// Parsea el log de git y retorna los commits feat/fix agrupados por mes
function obtenerCommits() {
    const regex = /^(feat|fix)(?:\(([^)]*)\))?: (.+)$/;

    // execFileSync no usa shell, seguro contra inyecci\u00f3n
    let logConFechas;
    try {
        logConFechas = execFileSync('git', ['log', '--format=%aI\t%s', '--all'], {
            encoding: 'utf-8',
            maxBuffer: 10 * 1024 * 1024,
        });
    } catch {
        console.warn('  ! No se pudo ejecutar git log, generando changelog vac\u00edo');
        return [];
    }

    const commits = [];
    const lineas = logConFechas.trim().split('\n');

    for (const linea of lineas) {
        if (!linea) continue;
        const tabIdx = linea.indexOf('\t');
        if (tabIdx === -1) continue;

        const fecha = linea.slice(0, tabIdx);
        const mensaje = linea.slice(tabIdx + 1);
        const match = regex.exec(mensaje);
        if (!match) continue;

        const [, tipo, scope, texto] = match;
        const claveMes = fecha.slice(0, 7); // YYYY-MM

        commits.push({
            claveMes,
            icono: ICONOS[tipo],
            scope: nombreScope(scope),
            texto: capitalizar(texto.trim()),
        });
    }

    return commits;
}

// Agrupa commits por mes
function agruparPorMes(commits) {
    const grupos = {};

    for (const commit of commits) {
        if (!grupos[commit.claveMes]) {
            grupos[commit.claveMes] = [];
        }
        grupos[commit.claveMes].push({
            icono: commit.icono,
            scope: commit.scope,
            texto: commit.texto,
        });
    }

    // Ordenar meses de m\u00e1s reciente a m\u00e1s antiguo
    const claves = Object.keys(grupos).sort().reverse();

    return claves.map(function (clave) {
        return {
            etiqueta: etiquetaMes(clave),
            cambios: grupos[clave],
        };
    });
}

// Genera el JS del registro
function generarRegistroJS(meses) {
    const estante = {
        id: 'novedades',
        titulo: 'Libro de Novedades',
        color: '#5b8a72',
        img: 'assets/img/biblioteca/lomo-novedades.webp',
    };

    const datos = {
        titulo: 'Libro de Novedades',
        subtitulo: 'La historia de El Relatario',
        meses,
    };

    return [
        CABECERA,
        `export const CHANGELOG_ESTANTE = ${JSON.stringify(estante, null, 4)};\n`,
        `export const CHANGELOG_DATOS = ${JSON.stringify(datos, null, 4)};\n`,
    ].join('\n');
}

async function main() {
    const configPrettier = await leerConfigPrettier();
    const commits = obtenerCommits();
    const meses = agruparPorMes(commits);

    mkdirSync(dirname(SALIDA), { recursive: true });

    const js = generarRegistroJS(meses);
    const formateado = await prettier.format(js, configPrettier);
    writeFileSync(SALIDA, formateado);

    const totalCambios = meses.reduce(function (sum, m) {
        return sum + m.cambios.length;
    }, 0);
    console.log(`${SALIDA} generado (${meses.length} meses, ${totalCambios} cambios)`);
}

main();
