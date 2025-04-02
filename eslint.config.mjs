import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next',
    'next/core-web-vitals',
    'next/typescript',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended'
  ),
  {
    ignores: ['node_modules', '.next'],
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
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
          bracketSameLine: false,
          quoteProps: 'as-needed',
        },
      ],
      // Turn off the TypeScript no-unused-vars rule as it will conflict
      '@typescript-eslint/no-unused-vars': 'off',
      // Add the unused-imports rules
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];

export default eslintConfig;
