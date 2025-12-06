import React from 'react';
import { IoSearch, IoNotificationsOutline } from "react-icons/io5";
const Notification = () => {
    return (
        <>
            <div className="relative cursor-pointer">
                 <IoNotificationsOutline className="text-2xl text-gray-700" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
         </div>
        </>
    );
};

export default Notification;