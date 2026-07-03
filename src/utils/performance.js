// Performance monitoring utilities
import { reportWebVitals } from 'web-vitals'

export function reportPerformance() {
  reportWebVitals((metric) => {
    // Send to analytics
    console.log(`[Performance] ${metric.name}: ${metric.value}`)
    
    // You can send to Google Analytics or other services
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        non_interaction: true,
      })
    }
  })
}