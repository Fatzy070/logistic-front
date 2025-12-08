import { useState } from 'react'
import { BrowserRouter , Routes , Route  } from 'react-router-dom'
import SignupPage from './pages/auth/SignupPage'
import LoginPage from './pages/auth/LoginPage'
import HomePage from './pages/home/HomePage'
import Layout from './layouts/Layout'
import ProtectedRoute from './Auth/ProtectedRoute'
import CreateShipment from './components/CreateShipment'
import Shipment from './components/Shipment'
import AllUser from './components/AllUser'
import AllShipment from './components/AllShipment'
import Track from './components/Track'
import TrackShipment from './components/TrackShipment'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS
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
          <Route path="/all-shipments" element={<AllShipment />} />
          <Route path="/user" element={<AllUser />} />
          <Route path='/track' element={<Track googleMapsApiKey={GOOGLE_MAPS_API_KEY} />} />
          <Route path='/track/:trackingNumber' element={<TrackShipment googleMapsApiKey={GOOGLE_MAPS_API_KEY} />} />
          
          </Route>
           </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
