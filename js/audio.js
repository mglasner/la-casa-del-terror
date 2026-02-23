// Sistema de audio — sonidos sintetizados con Web Audio API
// Lazy init del AudioContext (requiere interacción del usuario)

let ctx = null;

function obtenerContexto() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

// Genera un tono simple con envelope exponencial
function tono(freq, duracion, tipo, volumen, delay) {
    const ac = obtenerContexto();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = tipo;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volumen, ac.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duracion);
    osc.connect(gain).connect(ac.destination);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + duracion);
}

/** Reproduce un sonido sintetizado según el tier del tesoro */
export function sonidoTesoro(tier) {
    if (tier === 'curioso') {
        // Campanita: 2 tonos altos cortos
        tono(880, 0.3, 'sine', 0.15, 0);
        tono(1100, 0.4, 'sine', 0.12, 0.15);
    } else if (tier === 'raro') {
        // Destello ascendente: 3 tonos subiendo
        tono(660, 0.25, 'triangle', 0.12, 0);
        tono(880, 0.25, 'triangle', 0.14, 0.15);
        tono(1320, 0.5, 'sine', 0.1, 0.3);
    } else if (tier === 'epico') {
        // Acorde resonante: 3 tonos simultáneos + eco
        tono(440, 0.6, 'sine', 0.12, 0);
        tono(554, 0.6, 'sine', 0.1, 0);
        tono(660, 0.6, 'sine', 0.1, 0);
        tono(880, 0.8, 'triangle', 0.06, 0.4);
    } else if (tier === 'legendario') {
        // Impacto + reverb: tono grave + agudo retardado
        tono(110, 0.5, 'square', 0.08, 0);
        tono(220, 0.4, 'sine', 0.12, 0.1);
        tono(440, 0.5, 'sine', 0.1, 0.3);
        tono(880, 0.7, 'triangle', 0.08, 0.5);
    } else if (tier === 'mitico') {
        // Crescendo: 5 tonos ascendentes + acorde final
        tono(330, 0.3, 'sine', 0.06, 0);
        tono(440, 0.3, 'sine', 0.08, 0.2);
        tono(554, 0.3, 'sine', 0.1, 0.4);
        tono(660, 0.3, 'triangle', 0.1, 0.6);
        tono(880, 0.4, 'triangle', 0.12, 0.8);
        // Acorde final
        tono(880, 1.0, 'sine', 0.1, 1.1);
        tono(1100, 1.0, 'sine', 0.08, 1.1);
        tono(1320, 1.0, 'sine', 0.06, 1.1);
    }
}
