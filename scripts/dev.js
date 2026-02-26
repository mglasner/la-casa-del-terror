// Script de desarrollo: observador YAML + servidor BrowserSync

import { spawn, exec } from 'child_process';

// Observador de datos YAML — regenera JS al cambiar
const watcher = spawn('node', ['scripts/watch-datos.js'], { stdio: 'inherit' });

// Servidor de desarrollo con hot-reload
// stdout en 'pipe' para detectar cuando esté listo y abrir la vitrina
// Comando como string único + shell:true (necesario en Windows para npx).
// Evita el DeprecationWarning de Node 24 que afecta a args[] con shell:true.
const server = spawn('npx browser-sync start --config bs-config.cjs', {
    stdio: ['inherit', 'pipe', 'inherit'],
    shell: true,
});

// Re-imprimir stdout del servidor y detectar la URL local para abrir páginas dev
let paginasAbiertas = false;
server.stdout.on('data', function (chunk) {
    const txt = chunk.toString();
    process.stdout.write(txt);

    if (!paginasAbiertas) {
        const match = txt.match(/Local:\s*(https?:\/\/localhost:\d+)/);
        if (match) {
            paginasAbiertas = true;
            // BrowserSync ya abre index.html (desktop).
            // Escalonar para garantizar el orden: mobile → showcase
            const base = match[1];
            setTimeout(function () {
                abrirUrl(base + '/preview-mobile.html');
            }, 300);
            setTimeout(function () {
                abrirUrl(base + '/vitrina.html');
            }, 600);
        }
    }
});

function abrirUrl(url) {
    const cmd =
        process.platform === 'win32'
            ? 'start'
            : process.platform === 'darwin'
              ? 'open'
              : 'xdg-open';
    exec(cmd + ' ' + url);
}

function salir() {
    watcher.kill();
    server.kill();
    process.exit();
}

process.on('SIGINT', salir);
process.on('SIGTERM', salir);
server.on('exit', salir);
