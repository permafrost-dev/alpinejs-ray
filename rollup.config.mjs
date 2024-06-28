import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import packageJson from './package.json' with { type: "json" };

const options = {
    sourceMapsEnabled: false,
    minified: false,
};

export default {
    input: `src/index.ts`,
    output: [
        {
            file: `dist/index.cjs.js`,
            format: 'cjs',
            sourcemap: options.sourceMapsEnabled,
            exports: 'named',
            plugins: [],
        },
        {
            file: `dist/index.esm.mjs`,
            format: 'esm',
            sourcemap: options.sourceMapsEnabled,
            plugins: [],
        },
    ],
    plugins: [
        replace({
            values: {
                __BUILD_DATE__: () => new Date().toISOString(),
                __BUILD_VERSION__: () => packageJson.version,
            },
            preventAssignment: true,
        }),
        nodeResolve(),
        commonjs(),
        typescript(),
    ],
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
};
