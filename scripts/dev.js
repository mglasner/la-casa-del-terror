// Script de desarrollo: observador YAML + servidor BrowserSync

import { spawn } from 'child_process';

// Observador de datos YAML — regenera JS al cambiar
const watcher = spawn('node', ['scripts/watch-datos.js'], { stdio: 'inherit' });

// Servidor de desarrollo con hot-reload
const server = spawn(
    'npx',
    ['browser-sync', 'start', '--server', '--files', '**/*.html, **/*.css, **/*.js', '--no-notify'],
    { stdio: 'inherit', shell: true }
);

function salir() {
    watcher.kill();
    server.kill();
    process.exit();
}

process.on('SIGINT', salir);
process.on('SIGTERM', salir);
server.on('exit', salir);
