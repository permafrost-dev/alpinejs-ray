import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

const options = {
    sourceMapsEnabled: true,
    minified: true,
};

export default {
    input: `src/AlpineRay.ts`,
    output: [
        {
            file: `dist/standalone.js`,
            format: 'umd',
            sourcemap: options.sourceMapsEnabled,
            exports: 'auto',
            plugins: [],
        },
    ],
    // moduleContext: { 'src/v3/Vue2RayMixin.ts': 'this' },
    plugins: [
        replace({
            values: {
                __BUILD_DATE__: () => new Date().toISOString(),
                __BUILD_VERSION__: () => require('./package.json').version,
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
        'stopwatch-node',
        'md5',
        '@permafrost-dev/pretty-format',
        'stacktrace-js',
        'xml-formatter',
        'uuid',
    ],
};
