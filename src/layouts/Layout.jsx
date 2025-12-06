import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

const Layout = () => {
    return (
        <div className='min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-gray-50'>
            <Header />
            <main className='pt-4 pb-20 md:pb-4 px-4 md:px-8'>
                <Outlet />
            </main>
            <NavBar />
        </div>
    );
};

export default Layout;