const Input = ({ label, type = 'text', name, value, onChange, placeholder, required = false, icon: Icon }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4EC5C1] focus:border-transparent transition-all dark:text-white`}
        />
      </div>
    </div>
  );
};

export default Input;