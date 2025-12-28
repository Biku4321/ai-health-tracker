import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext"; // [FIX] Import Theme Context
import { Flame, Award, LogOut, User, Sun, Moon } from "lucide-react"; // [FIX] Added Sun/Moon Icons
import Avatar from "../gamification/Avatar";
const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // [FIX] Use Theme Hook
  const [menuOpen, setMenuOpen] = useState(false);

  //   const streakDays = 5;
  const streak = user?.gamification?.streak || 0;
  const level = user?.gamification?.level || 1;
  const xp = user?.gamification?.xp || 0;
  const nextLevelXp = level * 100;
  const xpPercent = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <nav
      className="h-16 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 fixed top-0 w-full z-40 px-6 flex items-center justify-between transition-colors duration-300"
      aria-label="Main Navigation"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#4EC5C1] rounded-lg flex items-center justify-center text-[#1A3C40] font-bold text-xl shadow-glow">
          H
        </div>
        <span className="font-poppins font-bold text-xl text-[#1A3C40] dark:text-white tracking-tight">
          Health<span className="text-[#4EC5C1]">AI</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* 🌓 Dark Mode Toggle (Visible to All) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun size={20} className="text-yellow-400 fill-current" />
          ) : (
            <Moon size={20} className="text-[#1A3C40] fill-current" />
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            {/* XP Bar (Hidden on mobile) */}
            <div className="hidden md:flex flex-col w-24">
              <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                <span>LVL {level}</span>
                <span>
                  {xp}/{nextLevelXp} XP
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4EC5C1] to-blue-500 transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Streak */}
            <div className="hidden sm:flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
              <Flame
                size={16}
                className="text-orange-500 fill-orange-500 animate-pulse"
              />
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                {streak} Days
              </span>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <Avatar level={level} size="sm" />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold truncate dark:text-white">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/profile-setup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <User size={16} /> Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm font-bold text-[#1A3C40] dark:text-[#4EC5C1]"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
