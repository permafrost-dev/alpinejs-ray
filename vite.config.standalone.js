import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    build: {
        outDir: 'dist/cdn',
        sourcemap: true,
        minify: true,
        lib: {
            entry: 'src/index-standalone.ts',
            name: 'AlpineRay',
            formats: ['umd'],
            fileName: format => `standalone.${format}.js`,
        },
        rollupOptions: {
            external: ['alpinejs', 'axios'],
            output: { globals: { axios: 'axios' } },
            treeshake: true,
        },
    },
    resolve: {
        alias: {
            '@': resolve('.', 'src'),
        },
    },
});
