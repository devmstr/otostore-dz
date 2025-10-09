import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts'
    ],
    rules: {
      // Turn off unused variables completely
      'no-unused-vars': 'off',

      // Disable TypeScript rule

      'react-refresh/only-export-components': 'off', // disable completely
      'react/no-unescaped-entities': 'off', // temporarily disable for build

      // OR: Keep the rule but ignore variables starting with `_`
      // 'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  }
]

export default eslintConfig
