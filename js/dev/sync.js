// Dev-only: sincronizar clics entre desktop y mobile preview via BroadcastChannel.
// Solo carga en localhost (ver index.html). No entra en build de producción.
//
// Ambas instancias (desktop e iframe) envían y reciben clics.
// El flag `reproduciendo` evita que los clics reproducidos se re-emitan.

(function () {
    if (!window.BroadcastChannel) return;

    const bc = new BroadcastChannel('relatario-dev-sync');
    let reproduciendo = false;

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

    // Enviar clics al canal (ignorar los que son reproducción)
    document.addEventListener(
        'click',
        function (e) {
            if (reproduciendo) return;
            bc.postMessage({ selector: obtenerSelector(e.target) });
        },
        true
    );

    // Recibir y reproducir clics del otro lado
    bc.onmessage = function (e) {
        if (!e.data.selector) return;
        const el = document.querySelector(e.data.selector);
        if (el) {
            reproduciendo = true;
            el.click();
            reproduciendo = false;
        }
    };
})();
