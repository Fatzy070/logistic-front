import React, { useState, useEffect, useCallback } from 'react';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import api from '../context/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Calendar,
  User,
  Phone,
  Weight,
  DollarSign,
  Navigation,
  Shield,
  AlertCircle,
  Download,
  Share2,
  Home,
  Building,
  Compass,
  Route,
  Mail,
  Globe,
  Map
} from 'lucide-react';

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb'
};

const defaultCenter = {
  lat: 9.0765,  // Abuja, Nigeria
  lng: 7.3986
};

// Nigerian city coordinates for fallback
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

const Track = ({ googleMapsApiKey }) => {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [message, setMessage] = useState("");
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [useFallbackMap, setUseFallbackMap] = useState(false);

    // Extract city from address for fallback coordinates
    const getCityFromAddress = (address) => {
        if (!address) return 'abuja';
        
        const lowerAddress = address.toLowerCase();
        for (const [city, data] of Object.entries(nigerianCities)) {
            if (lowerAddress.includes(city)) {
                return city;
            }
        }
        
        // Check for partial matches
        if (lowerAddress.includes('lag')) return 'lagos';
        if (lowerAddress.includes('abj')) return 'abuja';
        if (lowerAddress.includes('kan')) return 'kano';
        if (lowerAddress.includes('kad')) return 'kaduna';
        if (lowerAddress.includes('ibd')) return 'ibadan';
        
        return 'abuja'; // Default to Abuja
    };

    // Process shipment locations
    useEffect(() => {
        if (!shipment) return;

        const processLocations = () => {
            try {
                // Get pickup city coordinates
                const pickupCity = getCityFromAddress(shipment.pickupAddress);
                const pickupCoords = nigerianCities[pickupCity] || nigerianCities.abuja;
                setPickupLocation({
                    ...pickupCoords,
                    address: shipment.pickupAddress
                });

                // Get delivery city coordinates
                const deliveryCity = getCityFromAddress(shipment.deliveryAddress);
                const deliveryCoords = nigerianCities[deliveryCity] || nigerianCities.abuja;
                setDeliveryLocation({
                    ...deliveryCoords,
                    address: shipment.deliveryAddress
                });

                // Calculate center point
                const centerLat = (pickupCoords.lat + deliveryCoords.lat) / 2;
                const centerLng = (pickupCoords.lng + deliveryCoords.lng) / 2;
                setMapCenter({ lat: centerLat, lng: centerLng });

                // Set current location based on status
                if (shipment.status === 'pending') {
                    setCurrentLocation(pickupCoords);
                } else if (shipment.status === 'in transit') {
                    setCurrentLocation({ 
                        lat: centerLat, 
                        lng: centerLng,
                        name: "En Route"
                    });
                } else if (shipment.status === 'delivered') {
                    setCurrentLocation(deliveryCoords);
                }
            } catch (error) {
                console.error('Error processing locations:', error);
            }
        };

        processLocations();
    }, [shipment]);

    const handleTrack = async () => {
        if (!trackingNumber.trim()) {
            setMessage("Please enter a tracking number");
            return;
        }

        setLoading(true);
        setMessage("");
        setShipment(null);
        setPickupLocation(null);
        setDeliveryLocation(null);
        setCurrentLocation(null);
        setMapError(false);
        
        try {
            const res = await api.get(`/shipments/track/${trackingNumber}`);
            setShipment(res.data.shipment);
        } catch (error) {
            console.error('Error tracking shipment', error);
            setMessage(error.response?.data.message || 'Shipment not found. Please check your tracking number.');
        } finally {
            setLoading(false);
        }
    };

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

    const getStatusSteps = () => {
        const steps = [
            { id: 'step-1', status: 'Pending', icon: <Package />, active: true },
            { id: 'step-2', status: 'Processing', icon: <Clock />, active: shipment?.status === 'in transit' || shipment?.status === 'delivered' },
            { id: 'step-3', status: 'In Transit', icon: <Truck />, active: shipment?.status === 'in transit' || shipment?.status === 'delivered' },
            { id: 'step-4', status: 'Delivered', icon: <CheckCircle />, active: shipment?.status === 'delivered' },
        ];
        return steps;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleTrack();
        }
    };

    const handleShare = () => {
        if (shipment?.trackingNumber) {
            navigator.clipboard.writeText(shipment.trackingNumber);
            alert('Tracking number copied to clipboard!');
        }
    };

    const handleMapError = () => {
        setMapError(true);
        setUseFallbackMap(true);
    };

    // Simple fallback map component
    const FallbackMap = () => (
        <div className="relative bg-gradient-to-br from-blue-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="absolute top-4 right-4">
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Simplified View
                </span>
            </div>
            
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Map className="w-5 h-5 text-blue-600" />
                    Route Visualization
                </h3>
                <span className="text-sm text-gray-500">
                    {shipment?.status === 'delivered' ? 'Journey Complete' : 'In Progress'}
                </span>
            </div>
            
            {/* Simplified map visualization */}
            <div className="relative h-48 bg-white rounded-lg overflow-hidden border border-gray-300">
                {/* Route Line */}
                <div className="absolute top-1/2 left-6 right-6 h-1.5 bg-gradient-to-r from-blue-400 via-blue-500 to-green-400 transform -translate-y-1/2"></div>
                
                {/* Pickup Point */}
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">P</span>
                        </div>
                        <span className="text-xs font-medium mt-2 text-gray-700">Pickup</span>
                    </div>
                </div>
                
                {/* Transit Point if in transit */}
                {shipment?.status === 'in transit' && (
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-blue-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
                                <Truck className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs font-medium mt-2 text-gray-700">Current</span>
                        </div>
                    </div>
                )}
                
                {/* Delivery Point */}
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
                            shipment?.status === 'delivered' ? 'bg-green-500' : 'bg-gray-400'
                        }`}>
                            <span className="text-white text-xs font-bold">D</span>
                        </div>
                        <span className="text-xs font-medium mt-2 text-gray-700">Delivery</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-semibold text-blue-700">Pickup</div>
                    <div className="text-xs text-gray-600 truncate">{shipment?.pickupAddress?.split(',')[0] || 'Origin'}</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-semibold text-green-700">Delivery</div>
                    <div className="text-xs text-gray-600 truncate">{shipment?.deliveryAddress?.split(',')[0] || 'Destination'}</div>
                </div>
            </div>
        </div>
    );

    // Custom loading component
    const MapLoading = () => (
        <div className="bg-gradient-to-br from-blue-50 to-gray-100 rounded-xl p-8 border border-gray-200">
            <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="font-semibold text-gray-900 mb-2">Loading Map</h3>
                <p className="text-gray-600 text-sm text-center max-w-md">
                    Loading Google Maps visualization for your shipment route...
                </p>
                <button 
                    onClick={() => setUseFallbackMap(true)}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Use simplified view instead
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
                        <Navigation className="w-8 h-8 text-blue-600" />
                        Track Your Shipment
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Enter your tracking number to get real-time updates on your package location and estimated delivery time
                    </p>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-10"
                >
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="max-w-2xl mx-auto">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tracking Number
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full pl-12 pr-4 py-4 text-lg bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Enter tracking number"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Find your tracking number in your confirmation email or shipment receipt
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleTrack}
                                    disabled={loading || !trackingNumber.trim()}
                                    className={`flex-1 text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                                        loading || !trackingNumber.trim()
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-[0.98]'
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5  border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Tracking...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5" />
                                            Track Shipment
                                        </>
                                    )}
                                </button>
                                
                                <button 
                                    onClick={handleShare}
                                    className="px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-3"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Share Tracking
                                </button>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
                        >
                            <div className="flex items-center gap-3 text-red-700">
                                <AlertCircle className="w-5 h-5" />
                                <p className="font-medium">{message}</p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Results Section */}
                <AnimatePresence>
                    {shipment && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Shipment Status Card */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(shipment.status)} text-sm font-semibold`}>
                                                    {getStatusIcon(shipment.status)}
                                                    {shipment.status || 'Processing'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Last updated: {formatDate(shipment.updatedAt)}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Shipment to {shipment.receiverName}
                                            </h2>
                                            <p className="text-gray-600 mt-1">
                                                Tracking: <span className="font-mono font-bold text-blue-600">{shipment.trackingNumber}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-gray-900">${shipment.price}</div>
                                            <div className="text-sm text-gray-500">Total Value</div>
                                        </div>
                                    </div>

                                    {/* Progress Timeline */}
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-900">Delivery Progress</h3>
                                            <span className="text-sm text-gray-500">
                                                Est. Delivery: {shipment.estimatedDelivery ? formatDate(shipment.estimatedDelivery) : 'Calculating...'}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
                                            <div className="relative flex justify-between">
                                                {getStatusSteps().map((step) => (
                                                    <div key={step.id} className="flex flex-col items-center relative z-10">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                                            step.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                                                        }`}>
                                                            {step.icon}
                                                        </div>
                                                        <span className={`text-sm font-medium ${step.active ? 'text-blue-600' : 'text-gray-400'}`}>
                                                            {step.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Map Section */}
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <Globe className="w-5 h-5 text-blue-600" />
                                                Live Location Tracking
                                            </h3>
                                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                                <Compass className="w-4 h-4" />
                                                Real-time tracking
                                            </span>
                                        </div>
                                        
                                        {useFallbackMap ? (
                                            <FallbackMap />
                                        ) : (
                                            <LoadScript 
                                                googleMapsApiKey={googleMapsApiKey}
                                                loadingElement={<MapLoading />}
                                                onError={handleMapError}
                                            >
                                                <GoogleMap
                                                    mapContainerStyle={mapContainerStyle}
                                                    center={mapCenter}
                                                    zoom={7}
                                                    options={{
                                                        streetViewControl: false,
                                                        mapTypeControl: false,
                                                        fullscreenControl: true,
                                                        zoomControl: true,
                                                        styles: [
                                                            {
                                                                featureType: "poi",
                                                                elementType: "labels",
                                                                stylers: [{ visibility: "off" }]
                                                            }
                                                        ]
                                                    }}
                                                >
                                                  
                                                    {pickupLocation && (
                                                        <Marker
                                                            position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }}
                                                            onClick={() => setSelectedMarker('pickup')}
                                                        />
                                                    )}

                                                    
                                                    {deliveryLocation && (
                                                        <Marker
                                                            position={{ lat: deliveryLocation.lat, lng: deliveryLocation.lng }}
                                                            onClick={() => setSelectedMarker('delivery')}
                                                        />
                                                    )}

                                                    {/* Current Location Marker */}
                                                    {currentLocation && shipment.status === 'in transit' && (
                                                        <Marker
                                                            position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                                                            icon={{
                                                                path: window.google.maps.SymbolPath.CIRCLE,
                                                                scale: 10,
                                                                fillColor: "#EF4444",
                                                                fillOpacity: 0.7,
                                                                strokeWeight: 2,
                                                                strokeColor: "#FFFFFF"
                                                            }}
                                                        />
                                                    )}

                                                    {/* Info Windows */}
                                                    {selectedMarker === 'pickup' && pickupLocation && (
                                                        <InfoWindow
                                                            position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }}
                                                            onCloseClick={() => setSelectedMarker(null)}
                                                        >
                                                            <div className="p-2">
                                                                <div className="font-bold text-blue-600">Pickup Location</div>
                                                                <div className="text-sm">{shipment.pickupAddress}</div>
                                                            </div>
                                                        </InfoWindow>
                                                    )}

                                                    {selectedMarker === 'delivery' && deliveryLocation && (
                                                        <InfoWindow
                                                            position={{ lat: deliveryLocation.lat, lng: deliveryLocation.lng }}
                                                            onCloseClick={() => setSelectedMarker(null)}
                                                        >
                                                            <div className="p-2">
                                                                <div className="font-bold text-green-600">Delivery Location</div>
                                                                <div className="text-sm">{shipment.deliveryAddress}</div>
                                                            </div>
                                                        </InfoWindow>
                                                    )}
                                                </GoogleMap>
                                            </LoadScript>
                                        )}
                                        
                                        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <span>Pickup: {shipment.pickupAddress?.split(',')[0] || 'Origin'}</span>
                                            </div>
                                            <Route className="w-4 h-4" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span>Delivery: {shipment.deliveryAddress?.split(',')[0] || 'Destination'}</span>
                                            </div>
                                        </div>
                                    </div>


                                    
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Track;