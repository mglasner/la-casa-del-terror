// Configuración de BrowserSync para desarrollo
// Usado por: scripts/dev.js

module.exports = {
    server: true,
    files: ['**/*.html, **/*.css, **/*.js'],
    notify: false,
    // Ghost mode desactivado: usamos BroadcastChannel propio (js/dev/sync.js)
    ghostMode: false,
};
