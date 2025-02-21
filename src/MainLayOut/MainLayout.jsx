import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from '../Componenets/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div>
            <Toaster></Toaster>
            <Navbar></Navbar>
            <Outlet></Outlet>
        </div>
    );
};

export default MainLayout;