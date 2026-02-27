// El Duelo — Utilidades compartidas entre módulos

/**
 * Parsea color hex (#rrggbb) a componentes RGB.
 * Retorna un fallback púrpura si el formato es inválido.
 */
export function hexARgb(hex) {
    if (!hex || hex.length < 7) return { r: 200, g: 100, b: 255 };
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    };
}
