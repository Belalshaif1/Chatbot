import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/UserContext'
import { BotProvider } from './context/BotContext'
import { SourceProvider } from './context/SourceContext'
import { ChatProvider } from './context/ChatContext'
import { LangProvider } from './context/LangContext'

import { ErrorBoundary } from './components/ErrorBoundary'

// Inner component that can access AuthContext to pass userId to BotProvider
function AppWithProviders() {
  return (
    <BotProvider>
      <SourceProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </SourceProvider>
    </BotProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LangProvider>
          <AuthProvider>
            <AppWithProviders />
          </AuthProvider>
        </LangProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
