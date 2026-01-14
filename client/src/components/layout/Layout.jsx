import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useMood } from '../../context/MoodContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { moodGradient } = useMood();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      if (mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`min-h-screen transition-colors duration-500 mood-bg-container ${moodGradient}`}>
      
      {/* ✅ isDashboard={true} pass kiya taaki Menu button dikhe */}
      <Navbar toggleSidebar={toggleSidebar} isDashboard={true} />
      
      <div className="flex pt-16 min-h-screen relative">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isMobile={isMobile}
        />

        <main 
          className={`flex-1 p-4 md:p-8 transition-all duration-300 ease-in-out ${
            !isMobile && sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
           <div className="max-w-7xl mx-auto min-h-[calc(100vh-8rem)] animate-fadeIn"> 
            <Outlet />
           </div>
           
           {/* Optional: Dashboard me chhota footer agar chahiye */}
           <div className="mt-8 text-center text-xs text-gray-400 pb-4">
             &copy; 2026 HealthAI. All rights reserved.
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;