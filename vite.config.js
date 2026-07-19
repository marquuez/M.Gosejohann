import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const rootDir = dirname(fileURLToPath(import.meta.url))

// Strato: Website liegt im Domain-Root → base '/'
export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        impressum: resolve(rootDir, 'impressum.html'),
        datenschutz: resolve(rootDir, 'datenschutz.html'),
      },
    },
  },
})
