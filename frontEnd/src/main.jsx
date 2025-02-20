import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from '@asgardeo/auth-react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider
      config={ {
        signInRedirectURL: 'http://localhost:5173',
        signOutRedirectURL: 'http://localhost:5173',
        clientID: 'J_wjIo0qylHQDJCWfBZuE6cp1Qwa',
        baseUrl: 'https://api.asgardeo.io/t/sampleorg1',
        scope: ['openid', 'profile'],
      } }
    >
    <App />
    </AuthProvider>
  </StrictMode>,
)
