import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useMood } from '../../context/MoodContext'; // [NEW]

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { moodGradient } = useMood(); // [NEW] Get current gradient class

  return (
    <div className={`min-h-screen transition-colors duration-500 mood-bg-container ${moodGradient}`}>
      <Navbar />
      
      <div className="flex pt-16 h-screen overflow-hidden">
        {/* Sidebar (Desktop) */}
        <div className="hidden md:block h-full z-30">
          <Sidebar />
        </div>

        {/* Sidebar (Mobile) */}
        <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden transition-transform duration-300 ease-in-out z-50`}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
           {/* We remove the hardcoded bg color here to let the gradient show */}
           <div className="max-w-7xl mx-auto min-h-[calc(100vh-8rem)]"> 
            <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;