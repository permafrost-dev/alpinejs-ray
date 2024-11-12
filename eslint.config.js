import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import { Linter } from 'eslint';

/** @type {Linter.Config} */
const config = [
    {
        files: ['src/**/*.js', 'src/**/*.ts'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        plugins: {
            ts: tsPlugin,
        },
        // extends: ['plugin:@typescript-eslint/recommended', 'eslint:recommended'],
        rules: {
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            indent: ['error', 4, { SwitchCase: 1 }],
            'max-len': ['warn', { code: 160, ignoreUrls: true }],
            'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
            'no-useless-escape': 'off',
        },
    },
];

export default config;
