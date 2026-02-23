// GENERADO desde datos/*.yaml — no editar directamente

export const CFG = {
    meta: {
        titulo: 'El Laberinto 3D',
        itemInventario: '',
        timeoutExito: 1500,
    },
    textos: {
        indicadorBusqueda: 'Encuentra el cofre del tesoro',
        indicadorLlaveObtenida: '¡Tesoro encontrado! Escapa del laberinto',
        toastLlave: '¡Encontraste el cofre del tesoro!',
        mensajeExito: '¡Escapaste con el tesoro!',
    },
    laberinto: {
        filas: 13,
        columnas: 13,
        atajos: 6,
    },
    trampasFuego: {
        cantidadMin: 6,
        cantidadMax: 10,
        distanciaMinEntrada: 2,
        periodoMin: 1500,
        periodoMax: 3500,
        desfaseMax: 3000,
        cooldown: 1000,
        danoMin: 5,
        danoMax: 10,
    },
    rendimiento: {
        warmupFrames: 30,
        umbralFrameLento: 33,
        framesLentosParaFallback: 10,
        flashDano: 6,
    },
};
