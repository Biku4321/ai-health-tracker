import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  MessageSquare,
  FileText,
  Settings,
  BookOpen,
  X,
} from "lucide-react";
import { Users } from "lucide-react";
const Sidebar = ({ onClose }) => {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Track Day", path: "/track", icon: Activity },
    { name: "Journal", path: "/journal", icon: BookOpen },
    { name: "Community", path: "/community", icon: Users }, // [NEW]
    { name: "AI Coach", path: "/chat", icon: MessageSquare },
    { name: "Reports", path: "/report", icon: FileText },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-r border-gray-100 dark:border-gray-700 h-screen pt-20 px-4 transition-colors duration-300">
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 text-gray-500"
      >
        <X size={24} />
      </button>

      <div className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                isActive
                  ? "bg-primary text-secondary shadow-glow"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`
            }
          >
            <link.icon size={20} />
            {link.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
