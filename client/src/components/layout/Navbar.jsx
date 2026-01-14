import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Flame, LogOut, User, Sun, Moon, Menu, LayoutDashboard } from "lucide-react";
import Avatar from "../gamification/Avatar";

// ✅ Prop 'isDashboard' add kiya
const Navbar = ({ toggleSidebar, isDashboard = false }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Default values to prevent crash if user data is missing
  const streak = user?.gamification?.streak || 0;
  const level = user?.gamification?.level || 1;
  const xp = user?.gamification?.xp || 0;
  const nextLevelXp = level * 100;
  const xpPercent = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <nav className="h-16 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 fixed top-0 w-full z-40 px-4 md:px-6 flex items-center justify-between transition-colors duration-300">
      
      <div className="flex items-center gap-3">
        {/* ✅ Sirf Dashboard par Menu button dikhega */}
        {isDashboard && (
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#1A3C40] dark:text-white transition-all active:scale-95"
          >
            <Menu size={24} />
          </button>
        )}

        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4EC5C1] rounded-lg flex items-center justify-center text-[#1A3C40] font-bold text-xl shadow-glow">
            H
          </div>
          <span className="font-poppins font-bold text-xl text-[#1A3C40] dark:text-white tracking-tight hidden sm:block">
            Health<span className="text-[#4EC5C1]">AI</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
        >
          {theme === "dark" ? <Sun size={20} className="text-yellow-400 fill-current" /> : <Moon size={20} className="text-[#1A3C40] fill-current" />}
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            
            {/* ✅ Agar User Home Page par hai (Dashboard nahi), toh Dashboard jane ka button dikhao */}
            {!isDashboard && (
              <Link 
                to="/dashboard"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1A3C40] text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            )}

            {/* Stats (Sirf Dashboard par dikhayein ya har jagah, ye aapki choice hai. Abhi har jagah rakha hai) */}
            <div className="hidden md:flex flex-col w-24">
              <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                <span>LVL {level}</span>
                <span>{xp}/{nextLevelXp} XP</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#4EC5C1] to-blue-500" style={{ width: `${xpPercent}%` }}></div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
              <Flame size={16} className="text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400">{streak} Days</span>
            </div>

            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 focus:outline-none">
                <Avatar level={level} size="sm" />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold truncate dark:text-white">{user.email}</p>
                  </div>
                  
                  {/* Public Page par bhi Dashboard link dropdown me */}
                  {!isDashboard && (
                     <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <LayoutDashboard size={16} /> Go to Dashboard
                    </Link>
                  )}

                  <Link to="/profile-setup" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <User size={16} /> Profile Settings
                  </Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
             <Link to="/login" className="px-4 py-2 text-sm font-bold text-[#1A3C40] dark:text-gray-200 hover:text-[#4EC5C1]">Login</Link>
             <Link to="/signup" className="px-5 py-2.5 bg-[#4EC5C1] text-[#1A3C40] text-sm font-bold rounded-xl hover:bg-[#3daea9] transition shadow-lg shadow-[#4EC5C1]/20">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;