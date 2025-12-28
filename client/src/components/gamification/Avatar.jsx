import { motion } from 'framer-motion';

const Avatar = ({ level = 1, size = 'md' }) => {
  // Size classes
  const dims = size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-32 h-32' : 'w-20 h-20';
  const fontSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-lg';
  
  // Level colors
  const ringColor = level > 10 ? 'border-purple-500' : level > 5 ? 'border-yellow-400' : 'border-[#4EC5C1]';

  return (
    <div className={`relative ${dims}`}>
      {/* Animated Glow Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 rounded-full border-2 border-dashed ${ringColor} opacity-50`}
      />
      
      {/* Avatar Circle */}
      <div className={`absolute inset-1 rounded-full bg-gradient-to-tr from-[#1A3C40] to-[#2D5C63] flex items-center justify-center text-white font-bold shadow-inner ${fontSize}`}>
        LVL {level}
      </div>

      {/* Status Dot */}
      <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-[#1E293B]"></div>
    </div>
  );
};

export default Avatar;