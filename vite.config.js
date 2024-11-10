import { defineConfig } from 'vitest/config';

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
    build: {
        rollupOptions: {
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
