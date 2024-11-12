import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

function generateFilenameFromFormat(format) {
    if (format === 'cjs') {
        return 'index.cjs';
    }

    if (format === 'es') {
        return 'index.js';
    }

    return `index.${format}.js`;
}

export default defineConfig({
    build: {
        outDir: 'dist/lib',
        sourcemap: true,
        minify: true,
        lib: {
            entry: 'src/index.ts',
            name: 'AlpineRay',
            formats: ['es', 'cjs'],
            fileName: format => generateFilenameFromFormat(format),
        },
        rollupOptions: {
            output: {
                globals: {
                    axios: 'axios',
                    dayjs: 'dayjs',
                },
            },
            external: [
                'alpinejs',
                'axios',
                'dayjs',
                'crypto',
                'object-hash',
                'stopwatch-node',
                'md5',
                'node-ray',
                'node-ray/web',
                '@permafrost-dev/pretty-format',
                'stacktrace-js',
                'xml-formatter',
                'uuid',
            ],
            treeshake: true,
        },
    },
    resolve: {
        alias: {
            '@': resolve('.', 'src'),
        },
    },
    server: {
        watch: {
            usePolling: true,
            ignored: ['**/node_modules/**', '**/dist/**', './coverage/**', '**/.git/**'],
        },
    },
    test: {
        name: 'AlpineRay',
        globals: true,
        passWithNoTests: true,
        watch: false,
        environment: 'jsdom',
        alias: {
            '@': resolve('.', 'src'),
            '~tests': resolve('.', 'tests'),
        },
        coverage: {
            all: true,
            include: ['src/**/*.ts'],
            exclude: ['src/index.ts', 'src/index-standalone.ts'],
            reporter: [['text'], ['json', { file: 'coverage.json' }]],
        },
        include: ['tests/**/*.ts', 'tests/**/*.js', 'tests/*.ts'],
        reporters: ['default', process.env.CI ? 'github-actions' : 'verbose'],
    },
});
