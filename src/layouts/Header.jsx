  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import Info from '../data/Info';
  import { Link } from 'react-router-dom';
  import { TbTruckDelivery, TbPackage } from "react-icons/tb";
  import Search from '../components/Search';
  import { IoIosNotificationsOutline } from "react-icons/io";
  import api from '../context/api'


  const Header = () => {
    const { nav, logi , navIcon , adminNav } = Info;
    const [ user , setUser  ] = useState("")
    const [ message , setMessage ] = useState("")


    useEffect(() => {
      const token = localStorage.getItem('token');
      const fetchUser = async () => {
        try {
          const res = await api.get('/profile')
          setUser(res.data.user)
        } catch (error) {
          console.log('error fetching user data:', error);
          setMessage(error.response?.data.message || 'Error fetching user data');
        }
      }
      fetchUser()
    })
    
    const getInitials = (name = "") => {
    if (!name.trim()) return "";

    const parts = name.trim().split(" ");


    const initials = parts
      .slice(0, 2)       
      .map(word => word[0].toUpperCase());

    return initials.join("");
  };
    return (
      <header className="bg-gradient-to-br from-blue-50 to-gray-100 border-b border-blue-100 py-3 px-4 lg:px-8 flex items-center justify-between">
      
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <TbTruckDelivery className="text-3xl text-blue-600" />
            <TbPackage className="absolute -top-1 -right-1 text-lg text-orange-500 bg-white rounded-full p-0.5" />
          </div>
          <div className="flex flex-col">
            <span className="md:text-2xl font-bold text-gray-900 leading-none">{logi}</span>
            <span className="text-[13px] md:text-xs text-gray-500 font-medium -mt-1">LOGISTICS SOLUTIONS</span>
          </div>
        </div>

       
        <div className="hidden md:flex gap-6">
          
        </div>

        <div className="hidden md:flex gap-6">
        {user?.role === 'admin' 
        ?  adminNav.map((item) => (
            <Link key={item.id} to={item.link}>
              <p className="font-semibold  text-gray-700 hover:text-blue-600 transition">
                {item.name}
              </p>
            </Link>
          ))
          : nav.map((item) => (
            <Link key={item.id} to={item.link}>
              <p className="font-semibold  text-gray-700 hover:text-blue-600 transition">
                {item.name}
              </p>
            </Link>
          ))
      }
        </div>
     
        <div className="flex items-center gap-5">
          
          <Search />
         <Link
        to='/notification'
         className="hidden md:block">
            <IoIosNotificationsOutline size={20} />
         </Link>

      
        <Link
        to='/profile'
        >
          <div className="w-[32px] h-[32px] text-[15px] md:w-10 md:h-10  rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold cursor-pointer">
            {getInitials(user?.name)}
        </div>
        </Link>
        </div>
      </header>
    );
  };

  export default Header;
