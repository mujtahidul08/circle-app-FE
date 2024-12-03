import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "./components/ui/provider"
import './styles/index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Provider>
      <App />
    </Provider>
    </BrowserRouter> 
  </StrictMode>,
)
