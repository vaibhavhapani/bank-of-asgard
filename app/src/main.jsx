import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from '@asgardeo/auth-react'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider
      config={ {
        signInRedirectURL: 'http://localhost:5173',
        signOutRedirectURL: 'http://localhost:5173',
        clientID: 'J_wjIo0qylHQDJCWfBZuE6cp1Qwa',
        baseUrl: 'https://api.asgardeo.io/t/sampleorg1',
        scope: ['openid', 'address', 'email', 'phone', 'profile', 'internal_login'],
      } }
    >
    <App />
    </AuthProvider>
  </StrictMode>,
)
