import React, { useEffect, useState } from 'react';
import Info from '../data/Info';
import { Link } from 'react-router-dom';
import api from '../context/api';

const NavBar = () => {
    const { nav, adminavIcon , navIcon } = Info;
    const [user , setUser ] = useState("")

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await api.get(`/profile`)

            setUser(res.data.user)
          } catch (error) {
            console.log('Error fetching User' , error.message)
            setMessage(error.response?.data.message || 'Something went wrong')
          }
        }
      fetchUser()
    },[])

    return (
        <>
               <div className='bg-gradient-to-br from-blue-50 to-gray-100 border-b border-blue-100 md:hidden fixed py-3.5 justify-between px-5 bottom-0 flex border w-full'>
          {user?.role === 'admin' 
          ? adminavIcon.map((item , index ) => {
            const IconComponent = item.icon;
            return (
              <Link
              key={index}
              to={item.link}
              className=''
              >
                <IconComponent size={25}/>
              
              </Link>
            )
          }) :
          navIcon.map((item , index ) => {
            const IconComponent = item.icon;
            return (
              <Link
              key={index}
              to={item.link}
              className=''
              >
                <IconComponent size={25}/>
              
              </Link>
            )
          })        
        }
        </div>
        </>
    );
};

export default NavBar;