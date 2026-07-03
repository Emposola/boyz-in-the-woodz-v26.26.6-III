import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TriyakPerformanceMonitor } from 'triyak-react-performance'
import { analyzeSEO } from '@rwcode/seo'

// ============================================================

// ============================================================
// ───change this to true ───
const ENABLE_LOGS = false  // ← true when debugging

// ─── SILENCE ALL CONSOLE LOGS ───
if (!ENABLE_LOGS) {
  console.log = () => {}
  console.warn = () => {}
  console.info = () => {}
  console.debug = () => {}
  // console.error is NOT disabled so you can still see errors
}

// ─── Run SEO analysis in development (disabled by default) ───
if (import.meta.env.DEV && ENABLE_LOGS) {
  // analyzeSEO will automatically run when you add ?seo=1 to the URL
  console.log('🔍 SEO Analyzer available at: http://localhost:5173?seo=1')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TriyakPerformanceMonitor
      config={{
        coreWebVitals: true,
        memoryUsage: true,
        connectionAware: true,
        predictiveLoading: true,
        // ─── Disable console logs from the performance monitor ───
        logToConsole: ENABLE_LOGS && import.meta.env.DEV,
      }}
    >
      <App />
    </TriyakPerformanceMonitor>
  </React.StrictMode>
)