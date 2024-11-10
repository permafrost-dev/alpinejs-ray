import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

function generateFilenameFromFormat(format) {
    if (format === 'cjs') {
        return 'alpine-ray.cjs';
    }

    return `alpine-ray.${format}.js`;
}

export default defineConfig({
    test: {
        name: 'AlpineRay',
        globals: true,
        passWithNoTests: true,
        watch: false,
        environment: 'jsdom',
        alias: {
            '@/': new URL('./src/', import.meta.url).pathname,
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
    resolve: {
        alias: {
            '@': resolve('.', 'src'),
        },
    },
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'AlpineRay',
            formats: ['es', 'cjs', 'umd'],
            fileName: format => generateFilenameFromFormat(format),
        },
        outDir: 'dist-temp-2',
        minify: true,
        rollupOptions: {
            external: [
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
    server: {
        watch: {
            usePolling: true,
            ignored: ['**/node_modules/**', '**/dist/**', './coverage/**', '**/.git/**'],
        },
    },
});
