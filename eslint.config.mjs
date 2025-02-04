import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'),
    {
        ignores: ['node_modules', '.next'],
    },
    {
        rules: {
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    jsxSingleQuote: true,
                    trailingComma: 'es5',
                    printWidth: 100,
                    tabWidth: 2,
                    useTabs: false,
                    semi: true,
                    bracketSpacing: true,
                    arrowParens: 'always',
                    endOfLine: 'lf',
                    bracketSameLine: false,
                    quoteProps: 'as-needed',
                },
            ],
        },
    },
];

export default eslintConfig;
