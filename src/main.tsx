import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext'
import { BotProvider } from './context/BotContext'
import { SourceProvider } from './context/SourceContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <BotProvider>
          <SourceProvider>
            <App />
          </SourceProvider>
        </BotProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
