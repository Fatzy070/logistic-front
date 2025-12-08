import React, { useState } from 'react';
import api from '../context/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  MessageSquare,
  Truck
} from 'lucide-react';
import Info from '../data/Info';

const CreateShipment = () => {
    const [formData, setFormData] = useState({
        senderName: '',
        receiverName: '',
        receiverPhone: '',
        pickupAddress: '',
        deliveryAddress: '',
        packageType: '',
        weight: '',
        price: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);
    const { inputFields } = Info

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

       
        if (!/^\d+$/.test(formData.receiverPhone)) {
            toast.error("Phone number must contain only digits");
            setLoading(false);
            return;
        }

        if (formData.receiverPhone.length !== 11) {
            toast.error("Phone number must be 11 digits");
            setLoading(false);
            return;
        }

        if (!/^\d+(\.\d+)?$/.test(formData.weight)) {
            toast.error("Weight must be a valid number");
            setLoading(false);
            return;
        }

        if (!/^\d+$/.test(formData.price)) {
            toast.error("Price must be a valid number");
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/shipments', formData);
            
            
            setFormData({
                senderName: '',
                receiverName: '',
                receiverPhone: '',
                pickupAddress: '',
                deliveryAddress: '',
                packageType: '',
                weight: '',
                price: '',
                note: ''
            });
            
            toast.success(res.data.message || 'Shipment created successfully! 🎉');
        } catch (error) {
            console.log('Error creating shipment:', error);
            toast.error(error.response?.data?.message || 'Error creating shipment');
        } finally {
            setLoading(false);
        }
    };

    

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
           
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <Truck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Create New Shipment
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Fill in the details below to create a new shipment. All fields marked with * are required.
                    </p>
                </div>

               
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                  
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {inputFields.slice(0, 8).map((field, index) => (
                                <motion.div
                                    key={field.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="space-y-2"
                                >
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <field.icon className="w-4 h-4 mr-2 text-blue-600" />
                                        {field.placeholder}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={field.type || 'text'}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            required={field.required}
                                            step={field.step}
                                            className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                            placeholder={field.placeholder}
                                        />
                                        <field.icon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                      
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-2"
                        >
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                                Special Instructions (Optional)
                            </label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none"
                                placeholder="Any special handling instructions or notes for delivery..."
                            />
                        </motion.div>

                       
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="pt-4"
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center text-white gap-3 transition-all duration-300 ${
                                    loading 
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-[0.98]'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5  h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating Shipment...
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="w-6 h-6" />
                                        Create Shipment
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>

               
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200"
                >
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Quick Tips
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Ensure phone numbers are 11 digits and contain only numbers</li>
                        <li>• Double-check addresses for accuracy before submitting</li>
                        <li>• Weight should be in kilograms (e.g., 2.5)</li>
                        <li>• Price should be in whole numbers (no decimal points)</li>
                        <li>• All shipments are processed within 24 hours</li>
                    </ul>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CreateShipment;