import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  resolvePluginsRelativeTo: __dirname,
});

export default [
  ...compat.extends('eslint:recommended'),
];
