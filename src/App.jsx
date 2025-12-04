import { useState } from 'react'
import { BrowserRouter , Routes , Route  } from 'react-router-dom'
import SignupPage from './pages/auth/SignupPage'
import LoginPage from './pages/auth/LoginPage'
import HomePage from './pages/home/HomePage'
function App() {
 

  return (
    <>
      <BrowserRouter>
        <Routes> 
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
