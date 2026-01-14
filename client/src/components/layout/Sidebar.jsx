import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Activity,
  MessageSquare,
  FileText,
  Settings,
  BookOpen,
  Users,
  LogOut,
  HelpCircle // ✅ Import Icon
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const { logout } = useAuth();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Track Day", path: "/track", icon: Activity },
    { name: "Journal", path: "/journal", icon: BookOpen },
    { name: "Community", path: "/community", icon: Users },
    { name: "AI Coach", path: "/chat", icon: MessageSquare },
    { name: "Reports", path: "/report", icon: FileText },
    // ✅ Added Help Here
    { name: "Help & Support", path: "/help", icon: HelpCircle },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", opacity: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
          )}

          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={`fixed left-0 top-16 bottom-0 w-64 bg-white/90 dark:bg-[#0F172A]/95 backdrop-blur-xl border-r border-gray-100 dark:border-gray-700 z-50 flex flex-col shadow-2xl`}
          >
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={isMobile ? onClose : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#4EC5C1] text-[#1A3C40] shadow-lg shadow-[#4EC5C1]/20 translate-x-1"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#4EC5C1]"
                    }`
                  }
                >
                  <link.icon size={20} />
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
               <button 
                 onClick={logout}
                 className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
               >
                 <LogOut size={20} />
                 Sign Out
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;