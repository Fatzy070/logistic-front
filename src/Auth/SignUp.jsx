import React, { useState } from 'react';
import { FaEyeSlash, FaEye, FaTruck, FaLock, FaEnvelope, FaUser, FaCheckCircle, FaSignInAlt } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [step, setStep] = useState(1);

    const nextStep = () => {
        if (step === 1 && (!name || !email || !password)) {
            toast.error("Please fill in all required fields");
            return;
        }
        
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        
        
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }
        
        setStep(2);
    };

    const prevStep = () => {
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!termsAccepted) {
            toast.error("Please accept the terms and conditions");
            return;
        }

        setIsLoading(true);
        
        try {
            const res = await axios.post('https://logistic-back.onrender.com/api/signup', {
                name,
                email,
                password
            });
            
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            
            toast.success(
                <div>
                    <p className="font-bold">Account created successfully! 🎉</p>
                    <p className="text-sm">Welcome to LogiTrack, {name}!</p>
                </div>,
                { autoClose: 3000 }
            );
            
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Registration failed. Please try again.';
            toast.error(errorMessage);
            console.error("Signup error:", error);
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

           
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md"
            >
               
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                    <div className="absolute top-4 right-4 opacity-20">
                        <FaTruck className="text-6xl transform rotate-45" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Join LogiXpress</h1>
                            <p className="text-blue-200 mt-2">Create your logistics management account</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-blue-300">Step {step} of 2</div>
                            <div className="flex space-x-1 mt-2">
                                {[1, 2].map((num) => (
                                    <div 
                                        key={num}
                                        className={`h-1 w-8 rounded-full ${step >= num ? 'bg-white' : 'bg-blue-400'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            <div className="p-8"><form onSubmit={handleSubmit}>
<AnimatePresence mode="wait">
                            
    {step === 1 && (
           <motion.div
            key="step1"
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
         >
            <h2 className="text-xl font-semibold text-gray-800">AcSetup</h2>
             
           
            <div>
                 <label className="block text-gray-700 text-sm font-semmb-2">
                       <FaUser className="inline mr-2 text-blue-500" />
                    Full Name *
                </label>
                <div className="relative  ">
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-gray-500 rounded-lg focus:rfocus:ring-blue-500 focus:border-transptransition-all"
                         placeholder="John Doe"
                         required
                                            />
                    <FaUser className="absolute left-4 top-1/2 tran-translate-y-1/2 text-gray-400" />
                </div>
            </div>

                              
            <div>
                <label className="block text-gray-700 text-sm font-semmb-2">
                    <FaEnvelope className="inline mr-2 text-blue-500" />
                    Email Address *
                </label>
                <div className="relative">
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-gray-500 rounded-lg focus:rfocus:ring-blue-500 focus:border-transptransition-all"
                        placeholder="you@company.com"
                        required
                                            />
                    <FaEnvelope className="absolute left-4 totransform -translate-y-3/2  text-gray-400" />
                </div>
             </div>

            <div>
        <label className="block text-gray-700 text-sm font-smb-2">
            <FaLock className="inline mr-2 text-blue-500" />
             Password *
        </label>
        <div className="relative">
            <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-4 py-3 pl-12 pr-12 border border-gray-500  rounded-lg focus:ring-blue-500 focus:border-trantransition-all"
                  placeholder="Create a strong password"
                  required
                  minLength="8"
             />
             <FaLock className="absolute left-4 top-1/2 tr-translate-y-1/2 text-gray-400" />
            <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                     </div>

                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <div className={`flex items-center ${password.length >= 8 ? 'text-green-600' : ''}`}>
                    <FaCheckCircle className="mr-1 text-xs" /> At least 8 characters
                    </div>
                    <div className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                    <FaCheckCircle className="mr-1 text-xs" /> One uppercase letter
                    </div>
                    <div className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-600' : ''}`}>
                    <FaCheckCircle className="mr-1 text-xs" /> One number
                    </div>
                    </div>
                    </div>
            <div className="flex justify-end pt-2">
                        <motion.button
                            type="button"
                            onClick={nextStep}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                        >
                               <span>Continue</span>
                               <span>→</span>
                           </motion.button>
                       </div>
                        </motion.div>
                    )}
             {/* Step 2: Terms & Conditions */}
                     {step === 2 && (
                         <motion.div
                             key="step2"
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                               className="space-y-6"
                           >
                                <h2 className="text-xl font-semibold text-gray-800">Terms & Conditions</h2>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                                        <h3 className="font-semibold text-gray-800 mb-2">LogiTrack Terms of Service</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            By creating an account, you agree to our terms of service and privacy policy. 
                                            LogiTrack provides logistics management services including shipment tracking, 
                                            inventory management, and supply chain analytics.
                                        </p>
                                        
                                        <h4 className="font-medium text-gray-800 mb-1">Data Usage</h4>
                                        <p className="text-xs text-gray-600 mb-3">
                                            Your data will be used to provide logistics management services, improve our platform, 
                                            and communicate important updates. We never sell your personal data to third parties.
                                        </p>
                                        
                                        <h4 className="font-medium text-gray-800 mb-1">Account Security</h4>
                                        <p className="text-xs text-gray-600">
                                            You are responsible for maintaining the confidentiality of your account credentials. 
                                            Notify us immediately of any unauthorized use of your account.
                                        </p>
                                    </div>

                                    
                                    <div>
                                        <label className="flex items-start space-x-3 cursor-pointer">
                                            <input 
                                                type="checkbox"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="w-5 h-5 mt-1 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <div className="text-sm text-gray-600">
                                                <p className="font-medium">I agree to the LogiTrack Terms of Service and Privacy Policy</p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    I have read and understand the terms above
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            ← Back
                                        </button>
                                        
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isLoading || !termsAccepted}
                                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Creating Account...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaSignInAlt />
                                                    <span>Create Account</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Features Footer */}
                <div className="bg-gray-50 px-8 py-4 flex justify-between border-t border-gray-200">
                    <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">✓</div>
                        <div className="text-xs text-gray-500">Secure</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-green-600">✓</div>
                        <div className="text-xs text-gray-500">Reliable</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">✓</div>
                        <div className="text-xs text-gray-500">24/7 Support</div>
                    </div>
                </div>
            </motion.div>


        </div>
    );
};

export default SignUp;