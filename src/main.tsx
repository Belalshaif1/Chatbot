import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider, useAuth } from './context/UserContext'
import { BotProvider } from './context/BotContext'
import { SourceProvider } from './context/SourceContext'
import { ChatProvider } from './context/ChatContext'
import { LangProvider } from './context/LangContext'

// Inner component that can access AuthContext to pass userId to BotProvider
function AppWithProviders() {
  const { currentUser, isSuperAdmin } = useAuth();
  return (
    <BotProvider userId={currentUser?.id} isSuperAdmin={isSuperAdmin}>
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
    <BrowserRouter>
      <LangProvider>
        <AuthProvider>
          <AppWithProviders />
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  </StrictMode>,
)
