/// <reference types="node" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { writeFileSync } from 'fs'

const versao = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || 'dev'

const headersSeguranca = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data:; connect-src 'self' https://brasilapi.com.br ws: wss:; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
}

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(versao) },
  // Workaround: conflito de tipos entre Vite 6 (projeto) e Vite 5 (vitest/node_modules)
  plugins: [
    react(),
    {
      name: 'version-json',
      closeBundle() {
        writeFileSync(
          path.resolve(__dirname, 'dist/version.json'),
          JSON.stringify({ version: versao })
        )
      },
    },
  ] as any,
  server: { headers: headersSeguranca },
  preview: { headers: headersSeguranca },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
