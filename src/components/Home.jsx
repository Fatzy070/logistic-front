// Home.with.Skeleton.jsx
// Install: npm install react-loading-skeleton

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TbTruck, TbClock, TbCalendar } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { TbSearch, TbList, TbPlus } from "react-icons/tb";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Home = () => {
    const [user, setUser] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:3000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data.user);
            } catch (error) {
                console.log('Error fetching user data:', error);
                setMessage(error.response?.data.message || 'Error fetching user data');
            } finally {
                // small delay so skeleton feels smooth in dev
                setTimeout(() => setLoading(false), 450);
            }
        };
        fetchUser();
    }, []);

    const getInitials = (name = "") => {
        if (!name.trim()) return "";
        const parts = name.trim().split(" ");
        const initials = parts.slice(0, 2).map(word => word[0].toUpperCase());
        return initials.join("");
    };

    const getCurrentDate = () => {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <>
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Welcome back, <span className="text-blue-700">{loading ? <Skeleton width={120} /> : user?.name || 'Manager'}</span>
                        </h1>
                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                            <TbCalendar className="text-blue-500" />
                            {loading ? <Skeleton width={240} /> : getCurrentDate()}
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 text-gray-600">
                            <TbClock className="text-green-500" />
                            <span className="text-sm">{loading ? <Skeleton width={80} /> : 'Live tracking'}</span>
                        </div>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <TbTruck className="text-blue-500" />
                            <span className="text-sm">{loading ? <Skeleton width={50} /> : 'Active'}</span>
                        </div>
                    </div>
                </div>

                {/* User Card */}
                <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl border border-blue-100 p-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 md:w-16 md:h-16 text-xl md:text-2xl rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-bold">
                                {loading ? <Skeleton circle height={64} width={64} /> : getInitials(user?.name)}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {loading ? <Skeleton width={280} /> : "Ready to manage today's logistics?"}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {loading ? <Skeleton count={2} width={420} /> : 'Track shipments, create new deliveries, and monitor operations from your dashboard.'}
                            </p>
                        </div>
                        <div className="hidden md:block text-right">
                           <p className="text-sm text-gray-500">Member since</p>
<p className="font-mono font-bold text-blue-700">
  {loading ? <Skeleton width={100} /> : new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Stats */}
            <div className="grid  grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 px-4 py-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Shipments</p>
                            <p className="text-2xl font-bold text-gray-900">{loading ? <Skeleton width={80} /> : 'demo'}</p>
                        </div>
                        <TbTruck className="text-blue-500 text-xl" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 px-4 py-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Today</p>
                            <p className="text-2xl font-bold text-gray-900">{loading ? <Skeleton width={80} /> : 'demo'}</p>
                        </div>
                        <TbClock className="text-green-500 text-xl" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 px-4 py-10 hidden md:block">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{loading ? <Skeleton width={80} /> : 'demo'}</p>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

                <Link to='/create-shipment' className='group bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]'>
                    <div className='flex flex-col items-center text-center'>
                        <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4'>
                            {loading ? <Skeleton circle height={48} width={48} /> : <TbPlus className="text-2xl" />}
                        </div>
                        <h3 className='text-xl font-bold mb-2'>{loading ? <Skeleton width={140} /> : 'Create Shipment'}</h3>
                        <p className='text-blue-200 text-sm'>{loading ? <Skeleton width={200} /> : 'Schedule new pickup and delivery'}</p>
                    </div>
                </Link>

                <Link to='/track' className='group bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transition-all hover:scale-[1.02] hover:border-blue-300'>
                    <div className='flex flex-col items-center text-center'>
                        <div className='w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4'>
                            {loading ? <Skeleton circle height={48} width={48} /> : <TbSearch className="text-2xl text-blue-600" />}
                        </div>
                        <h3 className='text-xl font-bold text-gray-900 mb-2'>{loading ? <Skeleton width={140} /> : 'Track Shipment'}</h3>
                        <p className='text-gray-600 text-sm'>{loading ? <Skeleton width={200} /> : 'Real-time package tracking'}</p>
                    </div>
                </Link>

                <Link to='/shipments' className='group bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]'>
                    <div className='flex flex-col items-center text-center'>
                        <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4'>
                            {loading ? <Skeleton circle height={48} width={48} /> : <TbList className="text-2xl" />}
                        </div>
                        <h3 className='text-xl font-bold mb-2'>{loading ? <Skeleton width={140} /> : 'All Shipments'}</h3>
                        <p className='text-blue-200 text-sm'>{loading ? <Skeleton width={200} /> : 'Manage your shipment history'}</p>
                    </div>
                </Link>

            </div>
        </>
    );
};

export default Home;
