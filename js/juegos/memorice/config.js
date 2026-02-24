// GENERADO desde datos/*.yaml — no editar directamente

export const CFG = {
    meta: {
        titulo: 'El Memorice',
        itemInventario: '',
        tiempoVictoria: 2000,
    },
    tablero: {
        filas: 4,
        columnas: 5,
        numHeroes: 5,
        numVillanos: 5,
    },
    intentos: {
        max: 25,
        alerta: 5,
        margenAdvertencia: 3,
    },
    curacion: {
        parMin: 1,
        parMax: 3,
        victoriaMin: 8,
        victoriaMax: 12,
    },
    tiempos: {
        volteo: 500,
        noMatch: 800,
    },
    textos: {
        indicador: 'Intentos: {restantes}',
        toastMatch: '¡Par encontrado!',
        toastVictoria: '¡Memorice completado!',
        toastAdvertencia: '¡Quedan pocos turnos!',
        toastCuracion: '+{cantidad} vida',
        toastRelampago: '¡Relámpago! Las cartas se revelaron',
        toastBarajar: '¡Las cartas se mezclan!',
    },
    dificultad: {
        opciones: [
            {
                id: 'facil',
                nombre: 'Fácil',
                icono: '⚡',
                descripcion: 'Los relámpagos revelan las cartas de vez en cuando',
            },
            {
                id: 'normal',
                nombre: 'Normal',
                icono: '🎯',
                descripcion: 'El desafío clásico sin ayudas',
            },
            {
                id: 'dificil',
                nombre: 'Difícil',
                icono: '🌀',
                descripcion: 'Las cartas se mezclan después de cada par',
            },
        ],
        default: 1,
    },
    relampago: {
        probabilidad: 0.25,
        duracion: 900,
        flash: 150,
    },
    barajar: {
        retraso: 600,
        animacion: 400,
    },
};
