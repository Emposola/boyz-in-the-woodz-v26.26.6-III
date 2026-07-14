import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// On GitHub Pages the site is served from /<repo-name>/, so we set `base`
// to that path ONLY when building for Pages (GITHUB_PAGES env).
// Local dev keeps base '/' so the dev server is unaffected.
const BASE = process.env.GITHUB_PAGES ? '/boyz-in-the-woodz-v26.26.6-III-master/' : '/'

export default defineConfig({
  base: BASE,
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})