import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from "react-toastify";
import App from './App.jsx'
import '/tailwind.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        pauseOnHover={true}
      />
    <App />
  </StrictMode>,
)
