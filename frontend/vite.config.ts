import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(projectRoot, './src'),
      '@encryption': path.resolve(projectRoot, '../encryption'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: path.resolve(projectRoot, './src/test/setup.ts'),
    include: ['tests/**/*.test.{ts,tsx}'],
  },
})
