// Sistema de estaciones climáticas — efectos visuales por partida
// Se sortea al iniciar cada juego: 40% sin clima, 15% por estación
// Puramente visual, sin afectar mecánicas de juego

export const ESTACIONES = {
    invierno: {
        nombre: 'La Tormenta Arcana',
        // Tinte ambiental [r, g, b, alpha]
        tinte: [15, 30, 70, 0.18],
        // Paleta de cielo/suelo para El Laberinto 3D
        cielo3d: {
            cieloArriba: '#080d18',
            cieloAbajo: '#142240',
            sueloArriba: '#0a1428',
            sueloAbajo: '#060c18',
            tinte: 'rgba(30,60,120,0.12)',
        },
    },
    primavera: {
        nombre: 'El Despertar del Bosque',
        tinte: [100, 200, 80, 0.07],
        cielo3d: {
            cieloArriba: '#5ba8d4',
            cieloAbajo: '#9dd5b0',
            sueloArriba: '#4a9e5c',
            sueloAbajo: '#2d6b3a',
            tinte: 'rgba(100,200,80,0.08)',
        },
    },
    verano: {
        nombre: 'El Sol Abrasador',
        tinte: [220, 140, 20, 0.12],
        cielo3d: {
            cieloArriba: '#c07010',
            cieloAbajo: '#e8a020',
            sueloArriba: '#8b5010',
            sueloAbajo: '#5a3008',
            tinte: 'rgba(220,140,20,0.10)',
        },
    },
    otono: {
        nombre: 'La Danza de las Hojas',
        tinte: [180, 80, 20, 0.1],
        cielo3d: {
            cieloArriba: '#2a1408',
            cieloAbajo: '#5a2c0e',
            sueloArriba: '#6b3810',
            sueloAbajo: '#3a1c08',
            tinte: 'rgba(180,80,20,0.08)',
        },
    },
};

/**
 * Sortea una estación aleatoria.
 * @returns {string|null} Clave de estación ('invierno'|'primavera'|'verano'|'otono') o null (40%)
 */
export function sortearEstacion() {
    if (Math.random() < 0.2) return null;
    const keys = Object.keys(ESTACIONES);
    return keys[Math.floor(Math.random() * keys.length)];
}
