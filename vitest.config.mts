/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node' // or 'jsdom' if testing browser logic
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname)
    }
  }
})
