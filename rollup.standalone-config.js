import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

const options = {
    sourceMapsEnabled: true,
    minified: true,
};

export default {
    input: `src/index.ts`,
    output: {
            file: `dist/standalone.js`,
            format: 'umd',
            name: 'AlpineRay',
            sourcemap: options.sourceMapsEnabled,
            exports: 'named',
            plugins: [],
            globals: { 'axios': 'axios' },
        },
    
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
        'axios', 'node-ray',
    ],
};
