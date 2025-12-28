const StatCard = ({ title, value, unit, icon: Icon, trend }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 border border-white/20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl shadow-glass transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl"></div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</p>
          <h3 className="text-4xl font-extrabold text-secondary dark:text-white mt-2">
            {value}<span className="text-lg text-gray-400 ml-1 font-medium">{unit}</span>
          </h3>
          {/* Trend Indicator */}
        </div>
        <div className="p-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-inner text-primary">
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
};