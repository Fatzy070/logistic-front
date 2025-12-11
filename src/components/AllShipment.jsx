import React, { useEffect, useState } from 'react';
import api from '../context/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Weight, 
  DollarSign, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Link2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AllShipment = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [filteredShipments, setFilteredShipments] = useState([]);

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                setLoading(true);
                const res = await api.get('/shipments');
                setShipments(res.data.shipments || []);
            } catch (error) {
                console.error('Error fetching shipments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchShipments();
    }, []);

    useEffect(() => {
        let results = shipments;
        
       
        if (searchTerm) {
            results = results.filter(shipment => 
                shipment.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shipment.receiverPhone?.includes(searchTerm)
            );
        }
        

        if (statusFilter !== 'all') {
            results = results.filter(shipment => shipment.status === statusFilter);
        }
        
        setFilteredShipments(results);
    }, [shipments, searchTerm, statusFilter]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'in transit': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'in transit': return <Truck className="w-4 h-4" />;
            case 'delivered': return <CheckCircle className="w-4 h-4" />;
            case 'cancelled': return <AlertCircle className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 text-lg">Loading your shipments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mdp-4 md:p-8">
            <div className="md:max-w-7xl md:mx-auto">
              
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 md:mb-12"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                                Shipment Management
                            </h1>
                            <p className="text-gray-600">
                                Track and manage all your shipments in one place
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{shipments.length}</div>
                            <div className="text-sm text-gray-500">Total Shipments</div>
                        </div>
                    </div>

                  
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {shipments.filter(s => s.status === 'pending').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Pending</div>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-500" />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {shipments.filter(s => s.status === 'in transit').length}
                                    </div>
                                    <div className="text-sm text-gray-500">In Transit</div>
                                </div>
                                <Truck className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {shipments.filter(s => s.status === 'delivered').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Delivered</div>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {shipments.filter(s => s.status === 'cancelled').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Cancelled</div>
                                </div>
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                        </div>
                    </div>

             
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by receiver name, tracking number, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in transit">In Transit</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-500">
                            Showing {filteredShipments.length} of {shipments.length} shipments
                        </div>
                    </div>
                </motion.div>

               
                <AnimatePresence>
                    {filteredShipments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200"
                        >
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Shipments Found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {searchTerm || statusFilter !== 'all' 
                                    ? 'No shipments match your search criteria. Try adjusting your filters.'
                                    : 'You haven\'t created any shipments yet. Get started by creating your first shipment!'}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                            {filteredShipments.map((shipment, index) => (
                                <motion.div
                                    key={shipment._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden"
                                >
                                    
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${getStatusColor(shipment.status)} text-sm font-medium`}>
                                                        {getStatusIcon(shipment.status)}
                                                        {shipment.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    Shipment to: {shipment.receiverName || 'N/A'}
                                                </h3>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    Tracking: <span className="font-mono font-semibold">{shipment.trackingNumber || 'Not assigned'}</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    ${shipment.price || '0.00'}
                                                </div>
                                                <div className="text-sm text-gray-500">Total</div>
                                            </div>
                                        </div>
                                    </div>

                                   
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm text-gray-500">Sender</div>
                                    <div className="font-medium">{shipment.senderName || 'N/A'}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <div className="text-sm text-gray-500">Receiver Phone</div>
                                                        <div className="font-medium">{shipment.receiverPhone || 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <div className="text-sm text-gray-500">Created</div>
                                                        <div className="font-medium">{formatDate(shipment.createdAt)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <div className="text-sm text-gray-500">Package Type</div>
                                                        <div className="font-medium">{shipment.packageType || 'Standard'}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Weight className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <div className="text-sm text-gray-500">Weight</div>
                        <div className="font-medium">{shipment.weight || '0'} kg</div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                                                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <div className="text-sm text-gray-500">Estimated Delivery</div>
                        <div className="font-medium">
                            {shipment.estimatedDelivery 
                              ? formatDate(shipment.estimatedDelivery) 
                              : 'Calculating...'}
                                </div>
                            </div>
                        </div>
                                            </div>
                </div>

                                       
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                            <div className="text-sm text-gray-500">Pickup Address</div>
                            <div className="font-medium">{shipment.pickupAddress || 'N/A'}</div>
                        </div>
                    </div>
                 <div className="flex items-start gap-3">
                     <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div className="flex-1">
                         <div className="text-sm text-gray-500">Delivery Address</div>
                         <div className="font-medium">{shipment.deliveryAddress || 'N/A'}</div>
                     </div>
                                            </div>
             </div>


             {shipment.note && (
            <div className="mt-6 pt-6 border-t border-gray-100">
                   <div className="flex items-start gap-3">
                      <div className="text-sm text-gray-500 font-medium">Special Instructions:</div>
                     <div className="text-gray-700 italic">{shipment.note}</div>
                                                </div>
                    </div>
                )}
            </div>

                                 
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2 transition-colors"
                onClick={() => window.reload}
                >
                     <RefreshCw className="w-4 h-4" />
                    Update Status
                </button>
               
                 <Link
                 to={`/track/${shipment.trackingNumber}`}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    Track Package
                </Link>
              
            </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Stats */}
                {filteredShipments.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm"
                    >
                        <p>
                            Displaying {filteredShipments.length} shipment{filteredShipments.length !== 1 ? 's' : ''} • 
                            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AllShipment;