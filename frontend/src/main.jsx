import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import store from './store/index.js'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { ErrorProvider } from './context/ErrorContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <App />
  </StrictMode>,
)