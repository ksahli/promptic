import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const core = fileURLToPath(new URL('./src/core', import.meta.url));
const renderer = fileURLToPath(new URL('./src/renderer', import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            'promptic/core': core,
            'promptic/renderer': renderer,
        },
    },
    test: {
        include: ['src/**/*.test.ts'],
        environment: 'node',
    },
});
