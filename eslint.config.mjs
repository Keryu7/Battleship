import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import tsdocPlugin from 'eslint-plugin-tsdoc';
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'import': importPlugin,
      'tsdoc': tsdocPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-dupe-class-members': ['error'],
      '@typescript-eslint/no-useless-constructor': ['error'],
      '@typescript-eslint/no-inferrable-types': ['off'],
      'import/extensions': [
        'error',
        'ignorePackages',
        { js: 'always', jsx: 'never', ts: 'never', tsx: 'never' },
      ],
    },
    settings: {
      jest: true,
      node: true,
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
];