// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/recommended'],
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: 'tsconfig.json',
      },
      rules: {
        '@typescript-eslint/no-extra-semi': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
}

module.exports = config
