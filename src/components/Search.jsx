import React, { useState, useEffect, useRef } from 'react';
import { IoMdClose } from "react-icons/io";
import { IoSearch, IoLocation, IoCalendar, IoPerson } from "react-icons/io5";
import { FaTruck, FaBox, FaPhone, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import api from '../context/api';

const Search = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [shipments, setShipments] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

   
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsSearching(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

  
    useEffect(() => {
        const fetchShipments = async () => {
            try {
                setIsLoading(true);
                const res = await api.get('/shipments/mine');
                setShipments(res.data.shipments || []);
                setFilteredResults(res.data.shipments || []);
            } catch (error) {
                console.error('Error fetching shipments:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchShipments();
    }, []);

    
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredResults(shipments);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const term = searchTerm.toLowerCase();
        
        const results = shipments.filter(shipment => {
           
            const searchFields = [
                shipment.receiverName,
                shipment.trackingNumber,
                shipment.receiverPhone,
                shipment.destination,
                shipment.status,
                shipment.senderName,
                shipment.senderPhone
            ];

            return searchFields.some(field => 
                field && field.toString().toLowerCase().includes(term)
            );
        });

       
        const timeoutId = setTimeout(() => {
            setFilteredResults(results);
        }, 150);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, shipments]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClear = () => {
        setSearchTerm('');
        setFilteredResults(shipments);
        setIsSearching(false);
    };

    const handleShipmentClick = (trackingNumber) => {
        if (!trackingNumber) {
            console.error('No tracking number available');
            return;
        }
        
 
        navigate(`/track/${trackingNumber}`);
        
       
        setIsOpen(false);
        setSearchTerm('');
        setIsSearching(false);
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'in transit':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatPhone = (phone) => {
        if (!phone) return '';
        // Format phone number for display
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    };

    const getStatusIcon = (status) => {
        switch(status?.toLowerCase()) {
            case 'delivered':
                return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
            case 'in transit':
                return <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>;
            case 'pending':
                return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
            default:
                return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
        }
    };

    return (
        <div className="relative" ref={searchRef}>
         
            <div className="hidden lg:block relative w-80">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search shipments, customers, tracking..."
                        value={searchTerm}
                        onChange={handleSearch}
                        onFocus={() => setIsOpen(true)}
                        className="w-full pl-12 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    />
                    <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    
                    {searchTerm && (
                        <button
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <IoMdClose size={18} />
                        </button>
                    )}
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {isSearching ? 'Search Results' : 'Recent Shipments'}
                                </h3>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                                    {filteredResults.length} found
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                {searchTerm ? `Searching for "${searchTerm}"` : 'Click any shipment to track it'}
                            </p>
                        </div>

                        <div className="overflow-y-auto max-h-[420px]">
                            {isLoading ? (
                                <div className="p-8 text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="mt-2 text-sm text-gray-600">Loading shipments...</p>
                                </div>
                            ) : filteredResults.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FaBox className="text-gray-400 text-xl" />
                                    </div>
                                    <p className="text-gray-700 font-medium mb-1">No shipments found</p>
                                    <p className="text-sm text-gray-500">
                                        {searchTerm ? `No results for "${searchTerm}"` : 'No shipments available'}
                                    </p>
                                </div>
                            ) : (
    <div className="divide-y divide-gray-100">
         {filteredResults.slice(0, 6).map((shipment) => (
               <div
                 key={shipment._id}
                   onClick={() => handleShipmentClick(shipment.trackingNumber)}
                    className="p-4 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 group relative"
                       >
                 <div className="flex items-start space-x-3">
    <div className={`p-2.5 rounded-lg ${getStatusColor(shipment.status)} border`}>
                                                    <FaTruck className="text-lg" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600">
                                                                {shipment.receiverName || 'Unknown Recipient'}
                                                            </h4>
                                                            {shipment.trackingNumber && (
                                                                <p className="text-xs text-gray-500 mt-0.5">
                                                                    Tracking: <span className="font-mono font-medium">{shipment.trackingNumber}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="flex items-center space-x-1">
                                                                {getStatusIcon(shipment.status)}
                                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(shipment.status)}`}>
                                                                    {shipment.status || 'Unknown'}
                                                                </span>
                                                            </div>
                                                            <FaArrowRight className="text-gray-400 group-hover:text-blue-500 transition-colors text-sm" />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <IoPerson className="mr-2 text-gray-400" />
                                                            <span className="truncate">{shipment.receiverName}</span>
                                                            {shipment.receiverPhone && (
                                                                <>
                                                                    <span className="mx-2 text-gray-300">•</span>
                                                                    <FaPhone className="mr-2 text-gray-400" />
                                                                    <span>{formatPhone(shipment.receiverPhone)}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        
                                                        {shipment.destination && (
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <IoLocation className="mr-2 text-gray-400" />
                                                                <span className="truncate">{shipment.destination}</span>
                                                            </div>
                                                        )}
                                                        
                                                        {shipment.createdAt && (
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <IoCalendar className="mr-2 text-gray-400" />
                                                                <span>
                                                                    {new Date(shipment.createdAt).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {filteredResults.length > 6 && (
                            <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="text-center">
                                    <button 
                                        onClick={() => {
                                         
                                            navigate('/shipments');
                                            setIsOpen(false);
                                            setSearchTerm('');
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                                    >
                                        View all {filteredResults.length} shipments
                                        <FaArrowRight className="ml-2 text-sm" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {!searchTerm && filteredResults.length > 0 && (
                            <div className="p-3 border-t border-gray-100 bg-gray-50">
                                <p className="text-xs text-gray-500 text-center">
                                    Click any shipment to track it
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

          
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <IoSearch size={22} className="text-gray-600" />
            </button>

        
            {isOpen && (
                <div className="fixed inset-0 bg-white z-50 lg:hidden">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center space-x-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search shipments, customers, tracking..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    autoFocus
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                />
                                <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                
                                {searchTerm && (
                                    <button
                                        onClick={handleClear}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <IoMdClose size={20} />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setSearchTerm('');
                                    setIsSearching(false);
                                }}
                                className="p-3 text-gray-600 hover:text-gray-800"
                            >
                                <IoMdClose size={24} />
                            </button>
                        </div>
                    </div>

              
                    <div className="p-4">
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {searchTerm ? `Results for "${searchTerm}"` : 'Recent Shipments'}
                                </h3>
                                {filteredResults.length > 0 && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                        {filteredResults.length} found
                                    </span>
                                )}
                            </div>
                            {searchTerm ? (
                                <p className="text-xs text-gray-500">
                                    Tap any shipment to track it
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500">
                                    Search or select a shipment to track
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            {isLoading ? (
                                <div className="py-12 text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="mt-2 text-sm text-gray-600">Searching...</p>
                                </div>
                            ) : filteredResults.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaBox className="text-gray-400 text-2xl" />
                                    </div>
                                    <p className="text-gray-700 font-medium text-lg mb-1">No shipments found</p>
                                    <p className="text-gray-500">
                                        {searchTerm ? `No results for "${searchTerm}"` : 'Try searching by name, phone, or tracking number'}
                                    </p>
                                </div>
                            ) : (
                                filteredResults.map((shipment) => (
                                    <div
                                        key={shipment._id}
                                        onClick={() => handleShipmentClick(shipment.trackingNumber)}
                                        className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] group"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                                                    {shipment.receiverName}
                                                </h4>
                                                {shipment.trackingNumber && (
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Tracking: <span className="font-mono font-medium">{shipment.trackingNumber}</span>
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center space-x-1">
                                                    {getStatusIcon(shipment.status)}
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(shipment.status)}`}>
                                                        {shipment.status}
                                                    </span>
                                                </div>
                                                <FaArrowRight className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <IoPerson className="mr-3 text-gray-400" />
                                                <span className="truncate">{shipment.receiverName}</span>
                                                {shipment.receiverPhone && (
                                                    <>
                                                        <span className="mx-2 text-gray-300">•</span>
                                                        <FaPhone className="mr-3 text-gray-400" />
                                                        <span>{formatPhone(shipment.receiverPhone)}</span>
                                                    </>
                                                )}
                                            </div>
                                            
                                            {shipment.destination && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <IoLocation className="mr-3 text-gray-400" />
                                                    <span className="truncate">{shipment.destination}</span>
                                                </div>
                                            )}
                                            
                                            {shipment.createdAt && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <IoCalendar className="mr-3 text-gray-400" />
                                                    <span>
                                                        {new Date(shipment.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;