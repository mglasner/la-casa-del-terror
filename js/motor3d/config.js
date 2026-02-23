// Motor 3D — Configuración y constantes

export const TEX_SIZE = 64;
export const FOV = Math.PI / 3; // 60 grados
export const VELOCIDAD_MOV = 0.06;
export const VELOCIDAD_GIRO = 0.04;
export const RADIO_COLISION = 0.2;

// Paleta de colores por defecto (sin zonas activas)
export const COLORES = {
    paredNS: { r: 26, g: 62, b: 30 },
    paredEO: { r: 37, g: 85, b: 42 },
    cieloArriba: '#050f05',
    cieloAbajo: '#0a1a0f',
    sueloArriba: '#0d240d',
    sueloAbajo: '#050a05',
    minimapaFondo: '#060e06',
    minimapaParedes: '#2a5e2a',
};

// Paleta de colores por zona temática
export const COLORES_ZONA = [
    // Zona 0 — Mazmorra (cálido ocre)
    {
        cieloArriba: '#0a0804',
        cieloAbajo: '#1a1208',
        sueloArriba: '#1a1408',
        sueloAbajo: '#0a0804',
        tinte: 'rgba(180,140,60,0.04)',
    },
    // Zona 1 — Cueva (frío azul-gris)
    {
        cieloArriba: '#04080c',
        cieloAbajo: '#0a1520',
        sueloArriba: '#0a1218',
        sueloAbajo: '#040810',
        tinte: 'rgba(80,120,160,0.05)',
    },
    // Zona 2 — Profundidades (violeta oscuro)
    {
        cieloArriba: '#08040c',
        cieloAbajo: '#140a1e',
        sueloArriba: '#120a18',
        sueloAbajo: '#06030a',
        tinte: 'rgba(120,60,180,0.06)',
    },
];

// Estado mutable del canvas (se recalcula al redimensionar)
export const canvas = {
    ancho: 640,
    alto: 400,
    numRayos: 320,
    anchoFranja: 2,
    anchoMini: 150,
    altoMini: 150,
};

// Recalcula dimensiones usando todo el viewport disponible
// opciones.landscape: true para landscape fullscreen (sin forzar 16:10)
export function calcularDimensiones(opciones) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const landscape = opciones && opciones.landscape;

    // Landscape fullscreen: UI oculta, márgenes mínimos, llenar pantalla
    const overheadV = landscape ? 10 : 180;
    const margenH = landscape ? 10 : 40;

    const maxAncho = Math.min(vw - margenH, 1280);
    const maxAlto = vh - overheadV;

    if (landscape) {
        // Llenar todo el espacio sin forzar aspecto 16:10
        canvas.ancho = maxAncho;
        canvas.alto = maxAlto;
    } else {
        // Aspecto 16:10 — ajustar a la dimensión limitante
        const anchoPorAlto = Math.round(maxAlto * 1.6);

        if (anchoPorAlto <= maxAncho) {
            canvas.ancho = anchoPorAlto;
            canvas.alto = maxAlto;
        } else {
            canvas.ancho = maxAncho;
            canvas.alto = Math.round(maxAncho / 1.6);
        }
    }

    // Mínimos razonables
    canvas.ancho = Math.max(320, canvas.ancho);
    canvas.alto = Math.max(200, canvas.alto);

    // Números pares para renderizado limpio
    canvas.ancho = Math.floor(canvas.ancho / 2) * 2;
    canvas.alto = Math.floor(canvas.alto / 2) * 2;

    canvas.numRayos = Math.max(160, Math.round(canvas.ancho / 2));
    canvas.anchoFranja = canvas.ancho / canvas.numRayos;
    canvas.anchoMini = Math.min(150, Math.round(canvas.ancho * 0.2));
    canvas.altoMini = canvas.anchoMini;
}
