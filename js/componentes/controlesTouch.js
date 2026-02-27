// Componente: D-pad virtual para dispositivos touch
// Soporta tres modos:
// - Centrado (laberinto 2D): 4 botones ▲◀▶▼ centrados abajo
// - Dividido (platformer): izq ◀▶ movimiento / der botones A (saltar) y B (agacharse)
// - CruzSplit: cruz ▲◀▶▼ a la izquierda + der A/B (keys configurables)
//
// La cruz soporta diagonales invisibles: tocar entre dos flechas adyacentes
// activa ambas direcciones simultáneamente (grilla 3x3 con esquinas diagonales).

export function crearControlesTouch() {
    // No crear si no hay soporte touch
    const esTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!esTouch) {
        return {
            setTeclasRef() {},
            mostrar() {},
            ocultar() {},
            setModoDividido() {},
            setModoCentrado() {},
            setModoCruzSplit(_opciones) {},
        };
    }

    let teclasRef = {};
    let modo = 'centrado'; // 'centrado' | 'dividido' | 'cruzSplit'

    // Keys configurables para botones A/B (se leen al momento del touch)
    let keyA = 'ArrowUp';
    let keyB = 'ArrowDown';

    // Helper: crear botón touch con key dinámica (lee getKey() al momento del touch)
    function crearBotonDinamico(clase, texto, getKey) {
        const btn = document.createElement('button');
        btn.className = 'dpad-btn ' + clase;
        btn.textContent = texto;
        btn.type = 'button';

        btn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            teclasRef[getKey()] = true;
        });

        btn.addEventListener('touchend', function (e) {
            e.preventDefault();
            delete teclasRef[getKey()];
        });

        btn.addEventListener('touchcancel', function () {
            delete teclasRef[getKey()];
        });

        return btn;
    }

    // Helper: crear botón touch con key fija (para split ◀▶)
    function crearBoton(clase, key, texto) {
        return crearBotonDinamico(clase, texto, function () {
            return key;
        });
    }

    // Helper: crear boton visual sin eventos touch (la cruz maneja touch a nivel contenedor)
    function crearBotonVisual(clase, texto) {
        const btn = document.createElement('button');
        btn.className = 'dpad-btn ' + clase;
        btn.textContent = texto;
        btn.type = 'button';
        return btn;
    }

    // --- Contenedor cruz (laberinto: ▲◀▶▼ con diagonales invisibles) ---
    const contenedor = document.createElement('div');
    contenedor.className = 'dpad-contenedor';

    const btnArriba = crearBotonVisual('dpad-arriba', '▲');
    const btnIzquierda = crearBotonVisual('dpad-izquierda', '◀');
    const btnDerecha = crearBotonVisual('dpad-derecha', '▶');
    const btnAbajo = crearBotonVisual('dpad-abajo', '▼');

    contenedor.appendChild(btnArriba);
    contenedor.appendChild(btnIzquierda);
    contenedor.appendChild(btnDerecha);
    contenedor.appendChild(btnAbajo);

    // --- Touch diagonal: grilla 3x3 sobre el contenedor ---
    // Cada celda mapea a 0, 1 o 2 teclas según su posición:
    //   ↑←  [▲]  ↑→
    //   [◀]  ·   [▶]
    //   ↓←  [▼]  ↓→
    const TECLAS_DIRECCION = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const ZONAS = [
        ['ArrowUp', 'ArrowLeft'],
        ['ArrowUp'],
        ['ArrowUp', 'ArrowRight'],
        ['ArrowLeft'],
        [],
        ['ArrowRight'],
        ['ArrowDown', 'ArrowLeft'],
        ['ArrowDown'],
        ['ArrowDown', 'ArrowRight'],
    ];

    // Referencia a botones por tecla para feedback visual
    const botonesDir = {
        ArrowUp: btnArriba,
        ArrowDown: btnAbajo,
        ArrowLeft: btnIzquierda,
        ArrowRight: btnDerecha,
    };

    // Touches activos en la cruz: Map<touchId, string[]>
    const touchesCruz = new Map();

    function obtenerZona(touch) {
        const rect = contenedor.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const col = Math.max(0, Math.min(2, Math.floor(x / (rect.width / 3))));
        const row = Math.max(0, Math.min(2, Math.floor(y / (rect.height / 3))));
        return ZONAS[row * 3 + col];
    }

    function recalcularTeclasCruz() {
        // Limpiar todas las teclas direccionales
        for (let i = 0; i < TECLAS_DIRECCION.length; i++) {
            delete teclasRef[TECLAS_DIRECCION[i]];
        }
        // Reactivar según touches activos
        touchesCruz.forEach(function (teclas) {
            for (let i = 0; i < teclas.length; i++) {
                teclasRef[teclas[i]] = true;
            }
        });
        // Feedback visual en botones
        for (const key in botonesDir) {
            botonesDir[key].classList.toggle('dpad-activo', !!teclasRef[key]);
        }
    }

    // touchstart/touchmove: actualizar zona del touch
    // touchend/touchcancel: eliminar touch del mapa
    function manejarTouchCruz(e) {
        const esFin = e.type === 'touchend' || e.type === 'touchcancel';
        if (e.type !== 'touchcancel') e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (esFin) {
                touchesCruz.delete(touch.identifier);
            } else {
                touchesCruz.set(touch.identifier, obtenerZona(touch));
            }
        }

        // Seguridad: si no quedan dedos en la cruz, limpiar entradas huérfanas
        if (esFin && e.targetTouches.length === 0) {
            touchesCruz.clear();
        }

        recalcularTeclasCruz();
    }

    contenedor.addEventListener('touchstart', manejarTouchCruz);
    contenedor.addEventListener('touchmove', manejarTouchCruz);
    contenedor.addEventListener('touchend', manejarTouchCruz);
    contenedor.addEventListener('touchcancel', manejarTouchCruz);

    // --- Contenedor izquierdo (platformer: ◀ ▶) ---
    const contIzq = document.createElement('div');
    contIzq.className = 'dpad-izq-contenedor';

    contIzq.appendChild(crearBoton('dpad-split-izq', 'ArrowLeft', '◀'));
    contIzq.appendChild(crearBoton('dpad-split-der', 'ArrowRight', '▶'));

    // --- Contenedor derecho (platformer: botones A y B estilo SNES) ---
    const contDer = document.createElement('div');
    contDer.className = 'dpad-der-contenedor';

    const btnB = crearBotonDinamico('dpad-btn-b', '▼', function () {
        return keyB;
    });
    const btnA = crearBotonDinamico('dpad-btn-a', 'A', function () {
        return keyA;
    });

    contDer.appendChild(btnB);
    contDer.appendChild(btnA);

    // Agregar los 3 contenedores al body
    document.body.appendChild(contenedor);
    document.body.appendChild(contIzq);
    document.body.appendChild(contDer);

    // Estado inicial: todos ocultos
    contenedor.classList.add('oculto');
    contIzq.classList.add('oculto');
    contDer.classList.add('oculto');

    function limpiarTouchesCruz() {
        touchesCruz.clear();
        recalcularTeclasCruz();
    }

    function setTeclasRef(obj) {
        teclasRef = obj;
        limpiarTouchesCruz();
    }

    function mostrar() {
        const esDividido = modo === 'dividido';
        const esCentrado = modo === 'centrado';

        contenedor.classList.toggle('oculto', esDividido);
        contenedor.classList.toggle('dpad-cruz-split', modo === 'cruzSplit');
        contIzq.classList.toggle('oculto', !esDividido);
        contDer.classList.toggle('oculto', esCentrado);
    }

    function ocultar() {
        limpiarTouchesCruz();
        contenedor.classList.add('oculto');
        contIzq.classList.add('oculto');
        contDer.classList.add('oculto');
    }

    function resetBotonesAB() {
        keyA = 'ArrowUp';
        keyB = 'ArrowDown';
        btnA.textContent = 'A';
        btnB.textContent = '▼';
    }

    function setModoDividido() {
        modo = 'dividido';
        resetBotonesAB();
    }

    function setModoCentrado() {
        modo = 'centrado';
        resetBotonesAB();
    }

    function setModoCruzSplit(opciones) {
        modo = 'cruzSplit';
        if (opciones) {
            if (opciones.a) keyA = opciones.a;
            if (opciones.b) keyB = opciones.b;
            if (opciones.textoA) btnA.textContent = opciones.textoA;
            if (opciones.textoB) btnB.textContent = opciones.textoB;
        } else {
            resetBotonesAB();
        }
    }

    return { setTeclasRef, mostrar, ocultar, setModoDividido, setModoCentrado, setModoCruzSplit };
}
