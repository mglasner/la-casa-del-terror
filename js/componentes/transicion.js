// Componente: Transiciones cinemáticas entre pantallas
// Tres estilos: fade (oscurecer), wipe (cortina horizontal), iris (círculo cartoon)
// Uso: await transicion.ejecutar('fade', callback)

export function crearTransicion() {
    const overlay = document.createElement('div');
    overlay.className = 'transicion-overlay';
    document.body.appendChild(overlay);

    let enCurso = false;

    // Ejecuta una transición con el estilo dado
    // callback se invoca en el punto medio (pantalla cubierta) para cambiar contenido
    function ejecutar(estilo, callback) {
        if (enCurso) {
            callback();
            return Promise.resolve();
        }
        enCurso = true;

        return new Promise(function (resolve) {
            // Aplicar estilo de entrada
            overlay.className = 'transicion-overlay transicion-' + estilo + '-in';

            function alCubrir() {
                overlay.removeEventListener('animationend', alCubrir);
                // Punto medio: pantalla cubierta, cambiar contenido
                callback();

                // Animar salida
                overlay.className = 'transicion-overlay transicion-' + estilo + '-out';

                function alDescubrir() {
                    overlay.removeEventListener('animationend', alDescubrir);
                    overlay.className = 'transicion-overlay';
                    enCurso = false;
                    resolve();
                }
                overlay.addEventListener('animationend', alDescubrir);
            }
            overlay.addEventListener('animationend', alCubrir);
        });
    }

    return { ejecutar };
}
