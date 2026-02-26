// Dev-only: sincronizar clics entre desktop y mobile preview via BroadcastChannel.
// Inyectado por BrowserSync en todas las páginas (bs-config.js). No entra en build.
//
// - Ventana principal (desktop): captura clics y los emite al canal
// - Dentro de iframe (mobile preview): recibe y reproduce los clics

(function () {
    if (!window.BroadcastChannel) return;

    const bc = new BroadcastChannel('relatario-dev-sync');

    // Construye un selector CSS estable para el elemento clickeado
    function obtenerSelector(el) {
        const partes = [];
        let actual = el;
        while (actual && actual !== document.documentElement) {
            let seg = actual.tagName.toLowerCase();
            if (actual.id) {
                partes.unshift('#' + actual.id);
                break;
            }
            const padre = actual.parentElement;
            if (padre && padre.children.length > 1) {
                const idx = Array.from(padre.children).indexOf(actual) + 1;
                seg += ':nth-child(' + idx + ')';
            }
            partes.unshift(seg);
            actual = padre;
        }
        return partes.join(' > ');
    }

    if (window === window.top) {
        // Ventana principal (desktop): enviar clics al canal
        document.addEventListener(
            'click',
            function (e) {
                bc.postMessage({ selector: obtenerSelector(e.target) });
            },
            true
        );
    } else {
        // Dentro de iframe (mobile): recibir y reproducir clics
        let reproduciendo = false;
        bc.onmessage = function (e) {
            if (reproduciendo || !e.data.selector) return;
            const el = document.querySelector(e.data.selector);
            if (el) {
                reproduciendo = true;
                el.click();
                reproduciendo = false;
            }
        };
    }
})();
