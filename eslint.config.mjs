import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores([
    'node_modules',
    'dist',
    'build',
    'coverage',
    'lib',
    'public',
    'docs',
    'tests',
    'examples',
    'scripts',
    'assets',
    'temp',
    'logs',
    'package-lock.json',
    'generated'
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      js
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    },
    extends: ['js/recommended']
  },
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended
])
