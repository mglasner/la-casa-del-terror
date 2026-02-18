// Observa datos/*.yaml y regenera los JS automáticamente

import { watch } from 'fs';
import { execSync } from 'child_process';

// Build inicial
execSync('node scripts/build-datos.js', { stdio: 'inherit' });
console.log('Observando datos/*.yaml...');

let timeout;
watch('datos', (_event, filename) => {
    if (!filename?.endsWith('.yaml')) return;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        console.log(`\n${filename} cambió, regenerando...`);
        try {
            execSync('node scripts/build-datos.js', { stdio: 'inherit' });
        } catch {
            // El error ya se imprimió via stdio
        }
    }, 200);
});
