import { useState } from 'react'
import { BrowserRouter , Routes , Route  } from 'react-router-dom'
import SignupPage from './pages/auth/SignupPage'
import LoginPage from './pages/auth/LoginPage'
import HomePage from './pages/home/HomePage'
import Layout from './layouts/Layout'
import ProtectedRoute from './Auth/ProtectedRoute'
import CreateShipment from './components/CreateShipment'
import Shipment from './components/Shipment'
function App() {
 

  return (
    <>
      <BrowserRouter>
        <Routes> 
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}> 
          <Route path="/" element={<HomePage />} />
          <Route path="/create-shipment" element={<CreateShipment />} />
          <Route path="/shipments" element={<Shipment />} />
          </Route>
           </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
