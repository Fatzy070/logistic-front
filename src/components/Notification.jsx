import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import api from '../context/api';
import { 
  Package,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Shield,
  Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user"));

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/notification`);
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Connect to Socket.IO
    const socket = io("http://localhost:3000", {
      path: "/socket.io",
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to server", socket.id);
      const userId = user?.userId;
      if (userId) {
        socket.emit("joinRoom", { userId });
      }
    });

    socket.on("newNotification", (notification) => {
      console.log("Notification received:", notification);
      setNotifications(prev => [notification, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="md:max-w-6xl md:mx-auto md:p-8">
  
      <div className="mb-12">
        <div className="md:flex items-center justify-between mb-6">
          <div>
            <h1 className=" text-[1.5rem] md:text-3xl font-bold text-gray-900">Shipment Updates</h1>
            <p className="text-gray-600 mt-2">Track and monitor all your logistics activities</p>
          </div>
          <button
            onClick={fetchNotifications}
            className="flex mt-2 md:mt-0 items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="font-medium">Refresh</span>
          </button>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-3 md:p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="w-[30px] h-[30px] md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 md:p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className=" w-[30px] h-[30px] md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => !n.read).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 md:p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="w-[30px] h-[30px] md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mr-4">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.message?.includes('transit') || n.message?.includes('shipped')).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 md:p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="w-[30px] h-[30px] md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.message?.includes('delivered') || n.message?.includes('completed')).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      
        <div className="border-b border-gray-100 px-3 md:px-8 py-6">
          <div className="md:flex  items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="md:text-xl font-bold text-gray-900">Recent Shipment Activities</h2>
                <p className="text-gray-500 text-sm">Real-time updates from your logistics network</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last update</p>
              <p className="text-gray-900 font-medium">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-16 text-center">
              <div className="inline-flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-700 font-medium">Loading shipments...</p>
                <p className="text-gray-500 text-sm mt-1">Fetching latest logistics data</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No shipment activities</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Your shipment dashboard will show real-time updates here when shipments are created or updated.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="px-3 md:px-8 py-6 hover:bg-gray-50/50 transition-all duration-300 group"
              >
                <div className="flex items-start">
                
                  <div className="relative mr-2 md:mr-6">
                    <div className="hidden  md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full md:flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 to-transparent"></div>
                  </div>

             
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="md:text-lg font-semibold text-gray-900">
                            {notification.message}
                          </h3>
                        </div>
                        
                      
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Shipment Created</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300" />
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">In Processing</span>
                          </div>
                        </div>

                     
                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reference</p>
                              <p className="text-sm font-mono font-medium text-gray-900">
                                {notification._id.substring(0, 8).toUpperCase()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-900">Active</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Priority</p>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                Standard
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                     
                      <div className="flex flex-col items-end space-y-4 md:ml-6">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{formatTime(notification.createdAt)}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notification.createdAt)}</p>
                        </div>
                        
                    
                      </div>
                    </div>

           
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Logistics ID: {notification._id.substring(18, 24).toUpperCase()}</span>
                        </div>
                      </div>
                     
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

     
        {notifications.length > 0 && (
          <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Shipment Activity Summary</p>
                  <p className="text-xs text-gray-500">
                    {notifications.length} total shipments • Updated in real-time
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Latest shipment</p>
                  <p className="text-gray-900 font-medium">
                    {notifications[0] ? formatRelativeTime(notifications[0].createdAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;