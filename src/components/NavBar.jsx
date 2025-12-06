import React from 'react';
import Info from '../data/Info';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const { nav, adminNav , navIcon } = Info;
    return (
        <>
               <div className='bg-gradient-to-br from-blue-50 to-gray-100 border-b border-blue-100 md:hidden fixed py-3.5 justify-between px-5 bottom-0 flex border w-full'>
          {navIcon.map((item , index ) => {
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
          })}
        </div>
        </>
    );
};

export default NavBar;