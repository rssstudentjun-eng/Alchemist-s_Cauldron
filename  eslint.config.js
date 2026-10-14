import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default defineConfig([
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    {
        files: ['**/*.{js,mjs,ts}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
        ],
        rules: {
            eqeqeq: ['error', 'always'],
            'prefer-const': 'error',
            curly: ['error', 'all'],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
        },
    },
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            globals: globals.browser,
        },
    },
    {
        files: ['*.config.{js,mjs,ts}'],
        languageOptions: {
            globals: globals.node,
        },
    },
]);