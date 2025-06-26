import React from 'react';

const Button = ({ 
  children, 
  type = "button", 
  variant = "primary", 
  fullWidth = false,
  isLoading = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseStyle = "font-semibold py-2 px-4 rounded-md transition-colors";
  
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    secondary: "bg-white hover:bg-gray-100 text-green-700 border border-green-600",
    social: "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300",
    disabled: "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200",
    outline: "bg-white text-green-700 border border-green-300 hover:bg-green-50 focus:ring-green-500",
  };
  
  const widthStyle = fullWidth ? "w-full" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className} ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button; 