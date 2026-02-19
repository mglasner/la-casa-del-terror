// Habitación 3 — El Memorice: constantes de configuración

export const CONFIG = {
    filas: 4,
    columnas: 5,
    numHeroes: 5,
    numVillanos: 5,
    intentosMax: 20,

    // Tiempos de animación (ms)
    tiempoVolteo: 500,
    tiempoNoMatch: 800,
    tiempoVictoria: 2000,

    // Umbral para alerta visual de intentos bajos
    intentosAlerta: 5,

    // Margen de turnos sobrantes para lanzar advertencia toast
    margenAdvertencia: 3,

    meta: {
        titulo: 'El Memorice',
        itemInventario: 'llave-habitacion-4',
    },

    textos: {
        indicador: (restantes) => `Intentos: ${restantes}`,
        toastMatch: '¡Par encontrado!',
        toastVictoria: '¡Memorice completado!',
        toastAdvertencia: '¡Quedan pocos turnos!',
    },
};
