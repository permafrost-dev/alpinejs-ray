import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { terser } from '@rollup/plugin-terser';

const options = {
    sourceMapsEnabled: true,
    minified: true,
};

const outputEntry = {
    file: `dist/standalone.js`,
    format: 'umd',
    //name: 'AlpineRay',
    sourcemap: options.sourceMapsEnabled,
    //exports: 'named',
    plugins: [],
    globals: {
        axios: 'axios',
    },
};

function makeEntryMinified(entry) {
    const result = Object.assign({}, entry);

    result['file'] = result['file'].replace(/\.js$/, '.min.js');
    result['plugins'] = [terser()];

    return Object.freeze(result);
}

function getEntryObject(entry) {
    return Object.freeze(Object.assign({}, entry));
}

export default {
    input: `src/index-standalone.ts`,
    output: [getEntryObject(outputEntry), makeEntryMinified(outputEntry)],
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
    external: ['axios'],
};
