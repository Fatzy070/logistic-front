import React, { useState } from 'react';
import { FaEyeSlash, FaEye, FaTruck, FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const res = await axios.post('https://logistic-back.onrender.com/api/login', {
                email,
                password,
                rememberMe
            });
            
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            
            toast.success(`Welcome back, ${res.data.user.name || 'Logistics Manager'}!`);
            
           
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials');
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
          
            
            <div className="absolute top-4 left-4 flex items-center space-x-2">
                <FaTruck className="text-blue-600 text-2xl" />
                <span className="text-2xl font-bold text-gray-800">LogiXpress</span>
            </div>

            {/* Main Login Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md"
            >
                {/* Decorative Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                    <div className="absolute top-4 right-4 opacity-20">
                        <FaTruck className="text-6xl transform rotate-45" />
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FaTruck className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Welcome Back</h1>
                            <p className="text-blue-200">Logistics Management Portal</p>
                        </div>
                    </div>
                    
                    <p className="text-blue-100 mt-2">
                        Track shipments, manage inventory, and optimize your logistics operations
                    </p>
                </div>

              
                <div className="p-8">
                    <form onSubmit={handleSubmit}>
                       
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                <FaEnvelope className="inline mr-2 text-blue-500" />
                                Email
                            </label>
                            <div className="relative">
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="manager@yourcompany.com"
                                    required
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaEnvelope />
                                </div>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                <FaLock className="inline mr-2 text-blue-500" />
                                Password
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your password"
                                    required
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaLock />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between mb-8">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <a 
                                href="/forgot-password" 
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt />
                                    <span>Sign In to Dashboard</span>
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Demo Credentials Section */}
                
                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">
                            New to LogiTrack?{' '}
                            <a href="/signup" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                Request Access
                            </a>
                        </p>
                        <p className="text-xs text-gray-500 mt-4">
                            Need help? Contact support at support@logistrack.com
                        </p>
                    </div>
                </div>

                {/* Stats Footer */}
                <div className="bg-gray-50 px-8 py-4 flex justify-between border-t border-gray-200">
                    <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">1.2K+</div>
                        <div className="text-xs text-gray-500">Active Shipments</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-green-600">98.7%</div>
                        <div className="text-xs text-gray-500">On-Time Delivery</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">24/7</div>
                        <div className="text-xs text-gray-500">Tracking</div>
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

export default Login;