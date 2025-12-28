import { motion } from 'framer-motion';

const BadgeCase = ({ badges = [] }) => {
  if (badges.length === 0) return (
    <div className="text-center text-gray-400 text-sm py-4">
      Log your first day to earn a badge!
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4">
      {badges.map((badge, index) => (
        <motion.div 
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-24"
        >
          <div className="text-3xl mb-1 filter drop-shadow-md">{badge.icon}</div>
          <p className="text-[10px] font-bold text-center leading-tight dark:text-gray-200">{badge.name}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default BadgeCase;