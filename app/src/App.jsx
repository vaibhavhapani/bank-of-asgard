import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useAuthContext } from '@asgardeo/auth-react'

import './App.css'
import Signup from './components/signup/signup'
import UserProfile from './components/user-profile/user-profile'


// function App() {
//   const { state, signIn, signOut } = useAuthContext();

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Bank of Asgard</h1>

//       {state.isAuthenticated ? (
//         <>
//           <p>Welcome, {state.username}!</p>
//           <UserProfile/>
//           <button onClick={signOut}>Logout</button>
//         </>
//       ) : (
//         <>
//           <h2>Login</h2>
//           <button onClick={signIn}>Login with Asgardeo</button>
//           <Signup/>
//         </>
//       )}

//     </div>
//   );
// }

const App = () => {
const { state, signIn, signOut } = useAuthContext();

return (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
  <h1>Bank of Asgard</h1>
    {
        state.isAuthenticated
        ? (<>
            <p>Welcome, {state.username}!</p>
            <UserProfile/>
            <button onClick={() => signOut()}>Logout</button>
        </>
        )
        : (
          <>
            <button onClick={() => signIn()}>Login</button>
            <Signup/>
          </>
      )
    }
    </div>
)
};

export default App;
