import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import api from '../context/api';
import { 
  Search, MapPin, Package, Truck, CheckCircle, Clock, Calendar,
  AlertCircle, Share2, Navigation, Map
} from 'lucide-react';

const mapContainerStyle = { width: '100%', height: '300px', borderRadius: '12px', border: '1px solid #e5e7eb' };
const defaultCenter = { lat: 9.0765, lng: 7.3986 }; // Abuja default

const nigerianCities = {
  lagos: { lat: 6.5244, lng: 3.3792, name: 'Lagos' },
  abuja: { lat: 9.0765, lng: 7.3986, name: 'Abuja' },
  kaduna: { lat: 10.5264, lng: 7.4381, name: 'Kaduna' },
  kano: { lat: 12.0022, lng: 8.5919, name: 'Kano' },
  ibadan: { lat: 7.3775, lng: 3.9470, name: 'Ibadan' },
  portHarcourt: { lat: 4.8156, lng: 7.0498, name: 'Port Harcourt' },
  benin: { lat: 6.3176, lng: 5.6145, name: 'Benin' },
  maiduguri: { lat: 11.8333, lng: 13.1500, name: 'Maiduguri' },
};

const TrackShipment = ({ googleMapsApiKey }) => {
  const { trackingNumber } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showSimplified, setShowSimplified] = useState(true); // show simplified initially
  const [mapLoaded, setMapLoaded] = useState(false);

  const getCityFromAddress = (address) => {
    if (!address) return 'abuja';
    const lower = address.toLowerCase();
    for (const city of Object.keys(nigerianCities)) if (lower.includes(city)) return city;
    return 'abuja';
  };

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const res = await api.get(`/shipments/track/${trackingNumber}`);
        setShipment(res.data.shipment);
      } catch (error) {
        setMessage(error.response?.data.message || 'Shipment not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchShipment();
  }, [trackingNumber]);

  useEffect(() => {
    if (!shipment) return;
    const pickupCity = getCityFromAddress(shipment.pickupAddress);
    const deliveryCity = getCityFromAddress(shipment.deliveryAddress);

    const pickupCoords = nigerianCities[pickupCity] || nigerianCities.abuja;
    const deliveryCoords = nigerianCities[deliveryCity] || nigerianCities.abuja;

    setPickupLocation({ ...pickupCoords, address: shipment.pickupAddress });
    setDeliveryLocation({ ...deliveryCoords, address: shipment.deliveryAddress });

    const centerLat = (pickupCoords.lat + deliveryCoords.lat) / 2;
    const centerLng = (pickupCoords.lng + deliveryCoords.lng) / 2;
    setMapCenter({ lat: centerLat, lng: centerLng });

    if (shipment.status === 'pending') setCurrentLocation(pickupCoords);
    else if (shipment.status === 'in transit') setCurrentLocation({ lat: centerLat, lng: centerLng });
    else if (shipment.status === 'delivered') setCurrentLocation(deliveryCoords);
  }, [shipment]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'in transit': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <AlertCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'in transit': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString('en-US', { weekday:'short', year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : 'N/A';

  const handleShare = () => {
    if (shipment?.trackingNumber) {
      navigator.clipboard.writeText(shipment.trackingNumber);
      alert('Tracking number copied to clipboard!');
    }
  };

  const handleMapLoad = () => setMapLoaded(true);
  const handleMapError = () => setShowSimplified(true);

  const FallbackMap = () => (
    <div className="relative bg-gradient-to-br from-blue-50 to-gray-100 rounded-xl p-6 border border-gray-200">
      <div className="absolute top-4 right-4 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
        Simplified View
      </div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-600" /> Route Visualization
        </h3>
        <span className="text-sm text-gray-500">
          {shipment?.status === 'delivered' ? 'Journey Complete' : 'In Progress'}
        </span>
      </div>
      <div className="relative h-48 bg-white rounded-lg border border-gray-300">
        <div className="absolute top-1/2 left-6 right-6 h-1.5 bg-gradient-to-r from-blue-400 via-blue-500 to-green-400 transform -translate-y-1/2"></div>
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-xs mt-2 text-gray-700">Pickup</span>
        </div>
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
            shipment?.status === 'delivered' ? 'bg-green-500' : 'bg-gray-400'
          }`}>
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="text-xs mt-2 text-gray-700">Delivery</span>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="p-6 text-center">Loading shipment...</div>;
  if (message) return <div className="p-6 text-center text-red-600">{message}</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Navigation className="w-6 h-6 text-blue-600" /> Shipment Tracking
        </h1>
        <p className="text-gray-600">Tracking number: <span className="font-mono font-bold">{shipment.trackingNumber}</span></p>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(shipment.status)}`}>
            {getStatusIcon(shipment.status)}
            {shipment.status}
          </span>
          <span className="text-gray-500 text-sm">Last updated: {formatDate(shipment.updatedAt)}</span>
          <button onClick={handleShare} className="ml-auto text-blue-600 hover:underline flex items-center gap-1">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setShowSimplified(!showSimplified)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {showSimplified ? 'View Full Map' : 'View Simplified'}
        </button>

        {/* Map */}
        <div className="mb-4">
          {showSimplified && <FallbackMap />}
          {!showSimplified && (
            <LoadScript
              googleMapsApiKey={googleMapsApiKey}
              onLoad={handleMapLoad}
              onError={handleMapError}
            >
              <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={7}>
                {pickupLocation && <Marker position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }} onClick={() => setSelectedMarker('pickup')} />}
                {deliveryLocation && <Marker position={{ lat: deliveryLocation.lat, lng: deliveryLocation.lng }} onClick={() => setSelectedMarker('delivery')} />}
                {currentLocation && shipment.status === 'in transit' && <Marker position={{ lat: currentLocation.lat, lng: currentLocation.lng }} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor:'#EF4444', fillOpacity:0.7, strokeWeight:2, strokeColor:'#FFF' }} />}
                {selectedMarker === 'pickup' && pickupLocation && <InfoWindow position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }} onCloseClick={() => setSelectedMarker(null)}><div><b>Pickup:</b> {pickupLocation.address}</div></InfoWindow>}
                {selectedMarker === 'delivery' && deliveryLocation && <InfoWindow position={{ lat: deliveryLocation.lat, lng: deliveryLocation.lng }} onCloseClick={() => setSelectedMarker(null)}><div><b>Delivery:</b> {deliveryLocation.address}</div></InfoWindow>}
              </GoogleMap>
            </LoadScript>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackShipment;
