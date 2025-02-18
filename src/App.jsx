import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useAuthContext } from '@asgardeo/auth-react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const { state, signIn, signOut } = useAuthContext();

  return (
    <>
     {state.isAuthenticated ? (
      <>
        <p>Welcome {state.username}</p>
        <button onClick={() => signOut()}>Logout</button>
      </>
      ) : (
        <button onClick={() => signIn()}>Login</button>
      )}  
    </>
  )
}

export default App
