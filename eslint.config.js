import airbnb from 'eslint-config-airbnb-base';
import globals from 'globals';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,

  {
    files: ['**/*.js'],
    ...airbnb,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'import/extensions': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    },
  },
  {
    files: ['**/*.test.js', '**/tests/**'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
  prettier,
];
