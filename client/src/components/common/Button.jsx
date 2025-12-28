const Button = ({ children, onClick, type = 'button', variant = 'primary', isLoading, className = '' }) => {
  const baseStyles = "w-full py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-[0.98]";
  
  const variants = {
    primary: "bg-[#4EC5C1] text-[#1A3C40] hover:bg-[#3daea9] shadow-lg shadow-[#4EC5C1]/20",
    secondary: "bg-[#1A3C40] text-white hover:bg-[#142e32]",
    outline: "border-2 border-[#4EC5C1] text-[#1A3C40] dark:text-[#4EC5C1] hover:bg-[#4EC5C1]/10",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : children}
    </button>
  );
};

export default Button;