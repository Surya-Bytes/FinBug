import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Dev-only: if no user is present, inject a test user to make dashboard visible locally
if (import.meta.env.DEV) {
  try {
    const existing = localStorage.getItem('user');
    if (!existing) {
      localStorage.setItem('user', JSON.stringify({ fullName: 'Dev Test', profileImageUrl: '' }));
    }
  } catch {
    // Ignore localStorage errors
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
