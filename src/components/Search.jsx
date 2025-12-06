import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { IoSearch, IoNotificationsOutline } from "react-icons/io5";
const Search = () => {
    const [ open , setOpen ] = useState(false)

    const handleOpen = () => {
        setOpen(!open)
    }

    return (
        <div>
           <div className="relative hidden lg:flex">
                     <input
                       type="text"
                       placeholder="Search shipments..."
                       className="border rounded-full pl-10 pr-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                 <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            <div
            onClick={() => handleOpen()}
            className='lg:hidden'>
                <IoSearch size={20} className="text-gray-500"/>
            </div>
            {open && (
        <div className="absolute top-0 w-full text-gray-500 border inset-0 bg-white z-50">
          <div className='flex border items-center py-1 px-1'>
            <IoSearch size={20} className="mr-2"/>
            <input
              type="text"
              placeholder="Search for Anything"
              className="w-full text-gray-700 py-2 outline-none"
            />
            <button onClick={() => setOpen(false)} className="mr-4 text-gray-500">
              <IoMdClose size={20} />
            </button>
          </div>

         
        </div>
      )}
        </div>
    );
};

export default Search;