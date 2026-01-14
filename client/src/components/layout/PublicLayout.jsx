import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* isDashboard={false} pass kar rahe hain taaki Menu button na dikhe */}
      <Navbar isDashboard={false} />
      
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* ✅ Public pages par Footer dikhega */}
      <Footer />
    </div>
  );
};

export default PublicLayout;